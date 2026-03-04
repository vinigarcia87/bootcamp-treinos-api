import {
  ForbiddenError,
  NotFoundError,
} from "../../errors/index.js";
import { prisma } from "../../lib/db.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  completedAt: string;
}

interface OutputDto {
  id: string;
  completedAt: string;
  startedAt: string;
}

export class UpdateWorkoutSession {
  async execute(dto: InputDto): Promise<OutputDto> {
    // Buscar o workout plan e verificar se pertence ao usuário
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: dto.workoutPlanId },
      include: {
        workoutDays: {
          where: { id: dto.workoutDayId },
          include: {
            sessions: {
              where: { id: dto.sessionId },
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

    // Verificar se a sessão existe no workout day
    const workoutSession = workoutDay.sessions[0];
    if (!workoutSession) {
      throw new NotFoundError("Workout session not found in this workout day");
    }

    // Atualizar a sessão com completedAt
    const updatedSession = await prisma.workoutSession.update({
      where: { id: dto.sessionId },
      data: {
        completedAt: new Date(dto.completedAt),
      },
    });

    return {
      id: updatedSession.id,
      completedAt: updatedSession.completedAt!.toISOString(),
      startedAt: updatedSession.startedAt.toISOString(),
    };
  }
}