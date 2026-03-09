import dayjs from "dayjs";
import { ForbiddenError, NotFoundError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
export class GetWorkoutDay {
    async execute(dto) {
        // Buscar o workout plan e verificar se pertence ao usuário
        const workoutPlan = await prisma.workoutPlan.findUnique({
            where: { id: dto.workoutPlanId },
            include: {
                workoutDays: {
                    where: { id: dto.workoutDayId },
                    include: {
                        exercises: {
                            orderBy: { order: "asc" },
                        },
                        sessions: {
                            orderBy: { startedAt: "desc" },
                        },
                    },
                },
            },
        });
        if (!workoutPlan) {
            throw new NotFoundError("Workout plan not found");
        }
        // Verificar se o usuário é o dono do workout plan
        if (workoutPlan.userId !== dto.userId) {
            throw new ForbiddenError("You are not the owner of this workout plan");
        }
        // Verificar se o workout day existe no workout plan
        const workoutDay = workoutPlan.workoutDays[0];
        if (!workoutDay) {
            throw new NotFoundError("Workout day not found in this workout plan");
        }
        // Mapear os dados para o formato de saída
        return {
            id: workoutDay.id,
            name: workoutDay.name,
            isRest: workoutDay.isRest,
            coverImageUrl: workoutDay.coverImageUrl || undefined,
            estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
            exercises: workoutDay.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                order: exercise.order,
                workoutDayId: exercise.workoutDayId,
                sets: exercise.sets,
                reps: exercise.reps,
                restTimeInSeconds: exercise.restTimeInSeconds,
            })),
            weekDay: workoutDay.weekDay,
            sessions: workoutDay.sessions.map((session) => ({
                id: session.id,
                workoutDayId: session.workoutDayId,
                startedAt: session.startedAt
                    ? dayjs(session.startedAt).format("YYYY-MM-DD")
                    : undefined,
                completedAt: session.completedAt
                    ? dayjs(session.completedAt).format("YYYY-MM-DD")
                    : undefined,
            })),
        };
    }
}
