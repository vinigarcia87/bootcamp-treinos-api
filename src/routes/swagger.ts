import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const swaggerRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/swagger.json",
    // Define your schema
    schema: {
      hide: true,
    },
    handler: async () => {
      return app.swagger();
    },
  });
};
