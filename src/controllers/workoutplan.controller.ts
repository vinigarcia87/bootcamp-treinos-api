import { fromNodeHeaders } from "better-auth/node";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { NotFoundError } from "../errors/index.js";
import { auth } from "../lib/auth.js";
import { WorkoutPlanSchema } from "../schemas/index.js";
import { CreateWorkoutPlan } from "../usecases/CreateWorkoutPlan.js";

const app = fastify();

export async function createWorkoutPlanCtrl(
  request: FastifyRequest<{ Body: z.infer<typeof WorkoutPlanSchema> }>,
  reply: FastifyReply,
) {
  try {
    // Captura a session do cookie
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.status(401).send({
        error: "Unauthorized",
        code: "UNAUTHORIZED",
      });
    }

    const createWorkoutPlan = new CreateWorkoutPlan();
    const result = await createWorkoutPlan.execute({
      userId: session.user.id,
      name: request.body.name,
      workoutDays: request.body.workoutDays,
    });
    return reply.status(201).send(result);
  } catch (error) {
    app.log.error(error);
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        error: error.message,
        code: "NOT_FOUND_ERROR",
      });
    }
    return reply.status(500).send({
      error: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
