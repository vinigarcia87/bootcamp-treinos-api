import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { prisma } from "../lib/db.js";
// Enable dayjs plugins
dayjs.extend(utc);
export class GetStats {
    async execute(dto) {
        const fromDate = dayjs.utc(dto.from).startOf("day");
        const toDate = dayjs.utc(dto.to).endOf("day");
        // Buscar todas as workout sessions do usuário no período
        const sessions = await prisma.workoutSession.findMany({
            where: {
                workoutDay: {
                    workoutPlan: {
                        userId: dto.userId,
                    },
                },
                startedAt: {
                    gte: fromDate.toDate(),
                    lte: toDate.toDate(),
                },
            },
            include: {
                workoutDay: true,
            },
            orderBy: {
                startedAt: "asc",
            },
        });
        // Montar consistencyByDay - incluir apenas dias que possuem pelo menos uma sessão
        const consistencyByDay = {};
        const sessionsByDate = new Map();
        sessions.forEach((session) => {
            const dateKey = dayjs.utc(session.startedAt).format("YYYY-MM-DD");
            if (!sessionsByDate.has(dateKey)) {
                sessionsByDate.set(dateKey, []);
            }
            sessionsByDate.get(dateKey).push(session);
        });
        sessionsByDate.forEach((dateSessions, dateKey) => {
            consistencyByDay[dateKey] = {
                workoutDayStarted: dateSessions.length > 0,
                workoutDayCompleted: dateSessions.some((session) => session.completedAt !== null),
            };
        });
        // Calcular completedWorkoutsCount
        const completedSessions = sessions.filter((session) => session.completedAt !== null);
        const completedWorkoutsCount = completedSessions.length;
        // Calcular conclusionRate
        const totalSessions = sessions.length;
        const conclusionRate = totalSessions > 0 ? completedWorkoutsCount / totalSessions : 0;
        // Calcular totalTimeInSeconds
        const totalTimeInSeconds = completedSessions.reduce((total, session) => {
            if (session.completedAt && session.startedAt) {
                const startTime = dayjs.utc(session.startedAt);
                const endTime = dayjs.utc(session.completedAt);
                const durationInSeconds = endTime.diff(startTime, "seconds");
                return total + durationInSeconds;
            }
            return total;
        }, 0);
        // Calcular workoutStreak
        const workoutStreak = await this.calculateWorkoutStreak(dto.userId, toDate);
        return {
            workoutStreak,
            consistencyByDay,
            completedWorkoutsCount,
            conclusionRate,
            totalTimeInSeconds,
        };
    }
    async calculateWorkoutStreak(userId, endDate) {
        // Buscar todas as sessões completadas do usuário, ordenadas por data decrescente
        const completedSessions = await prisma.workoutSession.findMany({
            where: {
                workoutDay: {
                    workoutPlan: {
                        userId: userId,
                    },
                },
                completedAt: {
                    not: null,
                },
                startedAt: {
                    lte: endDate.endOf("day").toDate(),
                },
            },
            include: {
                workoutDay: true,
            },
            orderBy: {
                startedAt: "desc",
            },
        });
        if (completedSessions.length === 0) {
            return 0;
        }
        // Agrupar sessões por data
        const sessionsByDate = new Map();
        completedSessions.forEach((session) => {
            const dateKey = dayjs.utc(session.startedAt).format("YYYY-MM-DD");
            sessionsByDate.set(dateKey, true);
        });
        // Contar dias consecutivos a partir da data mais recente com sessão
        let streak = 0;
        let checkDate = endDate;
        // Encontrar a data mais recente com sessão completada
        const mostRecentSessionDate = dayjs.utc(completedSessions[0].startedAt);
        // Se a data mais recente não for hoje ou ontem, streak é 0
        const daysDiff = checkDate.diff(mostRecentSessionDate, "days");
        if (daysDiff > 1) {
            return 0;
        }
        // Iniciar a contagem a partir da data da sessão mais recente
        checkDate = mostRecentSessionDate;
        while (sessionsByDate.has(checkDate.format("YYYY-MM-DD"))) {
            streak++;
            checkDate = checkDate.subtract(1, "day");
        }
        return streak;
    }
}
