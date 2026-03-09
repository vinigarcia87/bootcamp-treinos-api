import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { ErrorSchema, MeResponseSchema } from "../schemas/schemas.js";
import { GetUserTrainData } from "../usecases/GetUserTrainData.js";
export const meRoutes = async (app) => {
    app.withTypeProvider().route({
        method: "GET",
        url: "/",
        schema: {
            operationId: "getCurrentUserTrainData",
            tags: ["Me"],
            summary: "Get current user train data",
            response: {
                200: MeResponseSchema,
                401: ErrorSchema,
                500: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const session = await auth.api.getSession({
                    headers: fromNodeHeaders(request.headers),
                });
                if (!session) {
                    return reply.status(401).send({
                        error: "Unauthorized",
                        code: "UNAUTHORIZED",
                    });
                }
                const getUserTrainData = new GetUserTrainData();
                const result = await getUserTrainData.execute({
                    userId: session.user.id,
                });
                // Retorna null se não existem dados, conforme especificado na task
                return reply.status(200).send(result);
            }
            catch (error) {
                app.log.error(error);
                return reply.status(500).send({
                    error: "Internal Server Error",
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        },
    });
};
