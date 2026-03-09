import { prisma } from "../../lib/db.js";
export class GetWorkoutPlans {
    async execute(dto) {
        // Construir where clause baseado no filtro active
        const whereClause = {
            userId: dto.userId,
        };
        if (dto.active !== undefined) {
            whereClause.isActive = dto.active;
        }
        // Buscar os workout plans com seus workout days e exercises
        const workoutPlans = await prisma.workoutPlan.findMany({
            where: whereClause,
            include: {
                workoutDays: {
                    include: {
                        exercises: {
                            orderBy: { order: "asc" },
                        },
                    },
                    orderBy: [{ weekDay: "asc" }, { createdAt: "asc" }],
                },
            },
            orderBy: [
                { isActive: "desc" }, // Ativos primeiro
                { createdAt: "desc" }, // Mais recentes primeiro
            ],
        });
        // Mapear os dados para o formato de saída
        return workoutPlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            isActive: plan.isActive,
            workoutDays: plan.workoutDays.map((day) => ({
                id: day.id,
                name: day.name,
                weekDay: day.weekDay,
                isRest: day.isRest,
                estimatedDurationInSeconds: day.estimatedDurationInSeconds,
                coverImageUrl: day.coverImageUrl || undefined,
                exercises: day.exercises.map((exercise) => ({
                    id: exercise.id,
                    name: exercise.name,
                    order: exercise.order,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    restTimeInSeconds: exercise.restTimeInSeconds,
                })),
            })),
        }));
    }
}
