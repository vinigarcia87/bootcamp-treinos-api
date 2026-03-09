import { ForbiddenError, NotFoundError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
export class GetWorkoutPlan {
    async execute(dto) {
        // Buscar o workout plan com seus workout days e exercises
        const workoutPlan = await prisma.workoutPlan.findUnique({
            where: { id: dto.workoutPlanId },
            include: {
                workoutDays: {
                    include: {
                        exercises: true,
                    },
                    orderBy: [{ weekDay: "asc" }, { createdAt: "asc" }],
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
        // Mapear os dados para o formato de saída
        return {
            id: workoutPlan.id,
            name: workoutPlan.name,
            workoutDays: workoutPlan.workoutDays.map((day) => ({
                id: day.id,
                weekDay: day.weekDay,
                name: day.name,
                isRest: day.isRest,
                coverImageUrl: day.coverImageUrl || undefined,
                estimatedDurationInSeconds: day.estimatedDurationInSeconds,
                exercisesCount: day.exercises.length,
            })),
        };
    }
}
