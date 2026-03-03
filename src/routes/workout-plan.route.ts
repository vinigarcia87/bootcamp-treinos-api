import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { WorkoutPlanCtrl } from "../controllers/workoutplan.controller.js";
import { ErrorSchema, WorkoutPlanSchema } from "../schemas/schemas.js";

export const workoutPlanRoutes = async (app: FastifyInstance) => {
  const workoutPlanCtrl = new WorkoutPlanCtrl(app);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: WorkoutPlanSchema.omit({ id: true }),
      response: {
        201: WorkoutPlanSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: workoutPlanCtrl.createWorkoutPlan,
  });
};
