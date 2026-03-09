import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import weekday from "dayjs/plugin/weekday.js";
import { NotFoundError } from "../../errors/index.js";
import { WeekDay } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/db.js";
// Enable dayjs plugins
dayjs.extend(utc);
dayjs.extend(weekday);
export class GetHomeData {
    async execute(dto) {
        // Buscar o workout plan ativo do usuário
        const activeWorkoutPlan = await prisma.workoutPlan.findFirst({
            where: {
                userId: dto.userId,
                isActive: true,
            },
            include: {
                workoutDays: {
                    include: {
                        exercises: true,
                        sessions: true,
                    },
                },
            },
        });
        if (!activeWorkoutPlan) {
            throw new NotFoundError("No active workout plan found");
        }
        // Converter a data recebida para dayjs e obter o dia da semana
        const inputDate = dayjs.utc(dto.date);
        const weekDayMap = {
            0: WeekDay.SUNDAY,
            1: WeekDay.MONDAY,
            2: WeekDay.TUESDAY,
            3: WeekDay.WEDNESDAY,
            4: WeekDay.THURSDAY,
            5: WeekDay.FRIDAY,
            6: WeekDay.SATURDAY,
        };
        const targetWeekDay = weekDayMap[inputDate.day()];
        // Encontrar o workout day correspondente à data
        const todayWorkoutDay = activeWorkoutPlan.workoutDays.find((day) => day.weekDay === targetWeekDay);
        // Calcular início e fim da semana (domingo a sábado) em UTC
        const startOfWeek = inputDate.startOf("week"); // domingo 00:00:00
        const endOfWeek = inputDate.endOf("week"); // sábado 23:59:59
        // Buscar todas as workout sessions do usuário na semana
        const weekSessions = await prisma.workoutSession.findMany({
            where: {
                workoutDay: {
                    workoutPlan: {
                        userId: dto.userId,
                    },
                },
                startedAt: {
                    gte: startOfWeek.toDate(),
                    lte: endOfWeek.toDate(),
                },
            },
            include: {
                workoutDay: true,
            },
        });
        // Montar consistencyByDay - incluir todos os dias da semana
        const consistencyByDay = {};
        for (let i = 0; i < 7; i++) {
            const currentDay = startOfWeek.add(i, "day");
            const dateKey = currentDay.format("YYYY-MM-DD");
            const sessionsOnDay = weekSessions.filter((session) => dayjs.utc(session.startedAt).isSame(currentDay, "day"));
            consistencyByDay[dateKey] = {
                workoutDayStarted: sessionsOnDay.length > 0,
                workoutDayCompleted: sessionsOnDay.some((session) => session.completedAt !== null),
            };
        }
        // Calcular workout streak
        const workoutStreak = await this.calculateWorkoutStreak(dto.userId, inputDate);
        return {
            activeWorkoutPlanId: activeWorkoutPlan.id,
            todayWorkoutDay: todayWorkoutDay
                ? {
                    workoutPlanId: activeWorkoutPlan.id,
                    id: todayWorkoutDay.id,
                    name: todayWorkoutDay.name,
                    isRest: todayWorkoutDay.isRest,
                    weekDay: todayWorkoutDay.weekDay,
                    estimatedDurationInSeconds: todayWorkoutDay.estimatedDurationInSeconds,
                    coverImageUrl: todayWorkoutDay.coverImageUrl || undefined,
                    exercisesCount: todayWorkoutDay.exercises.length,
                }
                : undefined,
            workoutStreak,
            consistencyByDay,
        };
    }
    async calculateWorkoutStreak(userId, currentDate) {
        // Buscar todas as sessões completadas do usuário, ordenadas por data decrescente
        const completedSessions = await prisma.workoutSession.findMany({
            where: {
                workoutDay: {
                    workoutPlan: {
                        userId: userId,
                        isActive: true,
                    },
                },
                completedAt: {
                    not: null,
                },
                startedAt: {
                    lte: currentDate.endOf("day").toDate(),
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
        // Contar dias consecutivos a partir da data mais recente
        let streak = 0;
        let checkDate = currentDate;
        while (sessionsByDate.has(checkDate.format("YYYY-MM-DD"))) {
            streak++;
            checkDate = checkDate.subtract(1, "day");
        }
        return streak;
    }
}
