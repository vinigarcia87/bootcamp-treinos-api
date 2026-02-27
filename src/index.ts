import "dotenv/config";

import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

// Instanciate the framework
const app = Fastify({
  logger: true,
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Declare a route
app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  // Define your schema
  schema: {
    description: "Hello World",
    tags: ["Hello World"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return {
      message: "Hello World",
    };
  },
});

// Run the server!
try {
  await app.listen({ port: Number(process.env.PORT) || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
