# Project Overview: bootcamp-treinos-api

**Purpose**: API de treinos construída com Fastify, TypeScript, Prisma e Better-Auth para gerenciamento de planos de treino.

**Tech Stack**:
- Node.js 24.x (obrigatório via engine-strict)
- pnpm 10.30.3 como package manager
- TypeScript com target ES2024
- Fastify 5 com ZodTypeProvider
- Prisma 7 com PostgreSQL adapter
- Better-Auth para autenticação
- Zod v4 para validação

**Core Architecture**:
- Layered: Routes → Use Cases → Prisma
- Routes apenas validam e chamam use cases
- Use Cases contém regra de negócio
- Prisma para persistência direta (sem repositories)

**Database**: PostgreSQL via Docker, schema em prisma/schema.prisma