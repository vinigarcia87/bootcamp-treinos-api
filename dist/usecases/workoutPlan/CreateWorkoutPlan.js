import { NotFoundError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
export class CreateWorkoutPlan {
    async execute(dto) {
        const existingWorkoutPlan = await prisma.workoutPlan.findFirst({
            where: {
                isActive: true,
            },
        });
        // Transaction
        return prisma.$transaction(async (tx) => {
            if (existingWorkoutPlan) {
                await tx.workoutPlan.update({
                    where: { id: existingWorkoutPlan.id },
                    data: { isActive: false },
                });
            }
            const workoutPlan = await tx.workoutPlan.create({
                data: {
                    userId: dto.userId,
                    name: dto.name,
                    isActive: true,
                    workoutDays: {
                        create: dto.workoutDays.map((workoutDay) => ({
                            name: workoutDay.name,
                            weekDay: workoutDay.weekDay,
                            isRest: workoutDay.isRest,
                            estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
                            coverImageUrl: workoutDay.coverImageUrl,
                            exercises: {
                                create: workoutDay.exercises.map((exercise) => ({
                                    order: exercise.order,
                                    name: exercise.name,
                                    sets: exercise.sets,
                                    reps: exercise.reps,
                                    restTimeInSeconds: exercise.restTimeInSeconds,
                                })),
                            },
                        })),
                    },
                },
            });
            // Retorna workoutPlan incluindo (left join) workoutDays e exercises
            const result = await tx.workoutPlan.findUnique({
                where: { id: workoutPlan.id },
                include: {
                    workoutDays: {
                        include: {
                            exercises: true,
                        },
                    },
                },
            });
            if (!result) {
                throw new NotFoundError("Workout plan not found");
            }
            // Mapear resultado do Prisma para OutputDto
            return {
                id: result.id,
                name: result.name,
                workoutDays: result.workoutDays.map((day) => ({
                    name: day.name,
                    weekDay: day.weekDay,
                    isRest: day.isRest,
                    estimatedDurationInSeconds: day.estimatedDurationInSeconds,
                    coverImageUrl: day.coverImageUrl ?? undefined,
                    exercises: day.exercises.map((exercise) => ({
                        order: exercise.order,
                        name: exercise.name,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        restTimeInSeconds: exercise.restTimeInSeconds,
                    })),
                })),
            };
        });
    }
}
