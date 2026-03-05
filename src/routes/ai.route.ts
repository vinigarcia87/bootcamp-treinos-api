import { google } from "@ai-sdk/google";
import { stepCountIs, streamText, tool } from "ai";
import { fromNodeHeaders } from "better-auth/node";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { WeekDay } from "../generated/prisma/enums.js";
import { auth } from "../lib/auth.js";
import { GetUserTrainData } from "../usecases/GetUserTrainData.js";
import { UpsertUserTrainData } from "../usecases/UpsertUserTrainData.js";
import { CreateWorkoutPlan } from "../usecases/workoutPlan/CreateWorkoutPlan.js";
import { GetWorkoutPlans } from "../usecases/workoutPlan/GetWorkoutPlans.js";

export const aiRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/chat",
    schema: {
      tags: ["AI"],
      summary: "Chat with AI personal trainer",
      body: z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          }),
        ),
      }),
    },
    handler: async (request, reply) => {
      try {
        // Auth Guard - Retornar 401 se session for null
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          return reply.status(401).send({
            error: "Unauthorized",
            code: "UNAUTHORIZED",
          });
        }

        const userId = session.user.id;
        const { messages } = request.body;

        // System prompt refinado para personal trainer virtual
        const systemPrompt = `Você é um personal trainer virtual especialista em montagem de planos de treino personalizado.

## Sua Personalidade
- Tom amigável, motivador e encorajador
- Use linguagem simples, sem jargões técnicos
- Seu público são pessoas leigas em musculação
- Respostas curtas e objetivas
- Seja entusiasmado e positivo

## Primeira Interação
- **SEMPRE** chame a tool getUserTrainData antes de qualquer interação
- Se o usuário NÃO tem dados cadastrados (retorna null):
  * Pergunte nome, peso (kg), altura (cm), idade e % de gordura corporal
  * Faça perguntas simples e diretas em uma única mensagem
  * Após receber, salve com updateUserTrainData (converter peso de kg para gramas)
- Se o usuário JÁ tem dados: cumprimente pelo nome de forma calorosa

## Criação de Planos de Treino
Para criar um plano, pergunte:
1. Qual seu objetivo? (ganhar massa, emagrecer, definir, etc)
2. Quantos dias por semana pode treinar?
3. Tem alguma restrição física ou lesão?

## Divisões de Treino (Splits)
Escolha a divisão adequada com base nos dias disponíveis:
- **2-3 dias/semana**: Full Body ou ABC (A: Peito+Tríceps, B: Costas+Bíceps, C: Pernas+Ombros)
- **4 dias/semana**: Upper/Lower (cada grupo 2x/semana) ou ABCD
- **5 dias/semana**: PPLUL (Push/Pull/Legs + Upper/Lower)
- **6 dias/semana**: PPL 2x (Push/Pull/Legs repetido)

## Princípios de Montagem
- Músculos sinérgicos juntos (peito+tríceps, costas+bíceps)
- Exercícios compostos primeiro, isoladores depois
- 4 a 8 exercícios por sessão
- 3-4 séries por exercício
- 8-12 reps para hipertrofia, 4-6 para força
- Descanso: 60-90s (hipertrofia), 2-3min (compostos)
- Evitar treinar mesmo grupo muscular em dias consecutivos
- Nomes descritivos para cada dia

## IMPORTANTE: Estrutura do Plano
- O plano DEVE ter EXATAMENTE 7 dias (MONDAY a SUNDAY)
- Dias sem treino: isRest: true, exercises: [], estimatedDurationInSeconds: 0
- Dias com treino: isRest: false, exercises preenchidos, duração estimada
- SEMPRE inclua coverImageUrl adequada para cada dia

## Imagens de Capa
**Dias superiores** (peito, costas, ombros, bíceps, tríceps, push, pull, upper, full body):
- https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCO3y8pQ6GBg8iqe9pP2JrHjwd1nfKtVSQskI0v
- https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCOW3fJmqZe4yoUcwvRPQa8kmFprzNiC30hqftL

**Dias inferiores** (pernas, glúteos, quadríceps, posterior, panturrilha, legs, lower):
- https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCOgCHaUgNGronCvXmSzAMs1N3KgLdE5yHT6Ykj
- https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCO85RVu3morROwZk5NPhs1jzH7X8TyEvLUCGxY

Alternar entre as opções para variar. Dias de descanso usam imagem superior.

Seja motivacional e ajude o usuário a alcançar seus objetivos!`;

        // Configurar tools para o personal trainer
        const tools = {
          getUserTrainData: tool({
            description:
              "Buscar dados de treino do usuário (peso, altura, idade, etc). Use sempre no início da conversa.",
            inputSchema: z.object({}),
            execute: async () => {
              const getUserTrainData = new GetUserTrainData();
              return await getUserTrainData.execute({ userId });
            },
          }),

          updateUserTrainData: tool({
            description: "Atualizar ou criar dados de treino do usuário",
            inputSchema: z.object({
              weightInGrams: z.number().positive().describe("Peso em gramas"),
              heightInCentimeters: z
                .number()
                .positive()
                .describe("Altura em centímetros"),
              age: z.number().positive().describe("Idade em anos"),
              bodyFatPercentage: z
                .number()
                .min(0)
                .max(100)
                .describe("Percentual de gordura corporal (0-100)"),
            }),
            execute: async (params) => {
              const upsertUserTrainData = new UpsertUserTrainData();
              return await upsertUserTrainData.execute({ userId, ...params });
            },
          }),

          getWorkoutPlans: tool({
            description: "Listar todos os planos de treino do usuário",
            inputSchema: z.object({}),
            execute: async () => {
              const getWorkoutPlans = new GetWorkoutPlans();
              return await getWorkoutPlans.execute({ userId });
            },
          }),

          createWorkoutPlan: tool({
            description: "Criar um novo plano de treino completo com 7 dias",
            inputSchema: z.object({
              name: z.string().describe("Nome do plano de treino"),
              workoutDays: z
                .array(
                  z.object({
                    name: z
                      .string()
                      .describe(
                        "Nome do dia (ex: 'Peito e Tríceps', 'Descanso')",
                      ),
                    weekDay: z.enum(WeekDay).describe("Dia da semana"),
                    isRest: z.boolean().describe("Se é dia de descanso"),
                    estimatedDurationInSeconds: z
                      .number()
                      .describe("Duração estimada em segundos"),
                    coverImageUrl: z
                      .string()
                      .url()
                      .describe("URL da imagem de capa"),
                    exercises: z
                      .array(
                        z.object({
                          order: z.number().describe("Ordem do exercício"),
                          name: z.string().describe("Nome do exercício"),
                          sets: z.number().describe("Número de séries"),
                          reps: z.number().describe("Número de repetições"),
                          restTimeInSeconds: z
                            .number()
                            .describe("Tempo de descanso em segundos"),
                        }),
                      )
                      .describe(
                        "Lista de exercícios (vazia para dias de descanso)",
                      ),
                  }),
                )
                .length(7)
                .describe("EXATOS 7 dias de treino (segunda a domingo)"),
            }),
            execute: async (params) => {
              const createWorkoutPlan = new CreateWorkoutPlan();
              return await createWorkoutPlan.execute({ userId, ...params });
            },
          }),
        };

        // Configurar streamText com tools e multi-step
        const result = streamText({
          model: google("gemini-2.5-flash"), // "gemini-2.0-flash"
          system: systemPrompt,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          tools,
          stopWhen: stepCountIs(5),
        });

        // Retornar stream response
        reply.header("Content-Type", "text/plain; charset=utf-8");
        return reply.send(result.toUIMessageStream());
        /*
        const response = result.toUIMessageStreamResponse();
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body);
        */
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
