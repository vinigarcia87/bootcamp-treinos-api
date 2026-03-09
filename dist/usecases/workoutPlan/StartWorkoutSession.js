import { ForbiddenError, NotFoundError, WorkoutPlanNotActiveError, WorkoutSessionAlreadyExistsError, } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
export class StartWorkoutSession {
    async execute(dto) {
        // Buscar o workout plan e verificar se pertence ao usuário
        const workoutPlan = await prisma.workoutPlan.findUnique({
            where: { id: dto.workoutPlanId },
            include: {
                workoutDays: {
                    where: { id: dto.workoutDayId },
                    include: {
                        sessions: true,
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
        // Verificar se o workout plan está ativo
        if (!workoutPlan.isActive) {
            throw new WorkoutPlanNotActiveError("Workout plan is not active");
        }
        // Verificar se o workout day existe no workout plan
        const workoutDay = workoutPlan.workoutDays[0];
        if (!workoutDay) {
            throw new NotFoundError("Workout day not found in this workout plan");
        }
        // Verificar se já existe uma sessão iniciada para este dia
        const existingSession = workoutDay.sessions.find((session) => session.startedAt && !session.completedAt);
        if (existingSession) {
            throw new WorkoutSessionAlreadyExistsError("A session is already started for this workout day");
        }
        // Criar a nova sessão de treino
        const workoutSession = await prisma.workoutSession.create({
            data: {
                id: crypto.randomUUID(),
                workoutDayId: dto.workoutDayId,
                startedAt: new Date(),
            },
        });
        return {
            userWorkoutSessionId: workoutSession.id,
        };
    }
}
