# BOOTCAMP TREINOS API

## Plugins para o VS Studio

- DotENV
- ESLint
- Prettier - Code formatter
- Prisma
- Thunder Client
- Git History

## Inicializaçao do projeto

$ npm init

// TypeScript 5.9 includes features specifically designed to improve Node.js compatibility and type checking
$ npm install typescript@5.9.3 @types/node@24 -D

$ npm install prettier@3.8.1 eslint@10.0.1 -D

$ git init

// The command npx tsc --init is used to initialize a TypeScript project by creating a default tsconfig.json configuration file in the current directory
$ npx tsc --init

// Compila typescript files em javascript files
$ npx tsc

// Roda o arquivo gerado em dist/index.js
$ node dist/index.js

// Hot Reload (roda qndo um arquivo atualiza)
$ npm install tsx@4.21.0 -D

// Roda o projeto com Hot Reload
$ npm run dev

// Configura o lint no projeto
$ npm init @eslint/config@1.11.0

// Corrige inconsistencias entre eslint e prettier
$ npm install eslint-config-prettier@10.1.8 -D

// Sorting para os imports
$ npm install eslint-plugin-simple-import-sort@12.1.1 -D

// Servidor de aplicaçao (express, nest, ...)
$ npm install fastify@5.7.4

// Gerenciador de arquivo .env
$ npm install dotenv@17.3.1

// TypeScript-first schema validation with static type inference
$ npm install zod@4.3.6 fastify-type-provider-zod@6.1.0

// Swagger
$ npm install @fastify/swagger@9.7.0 @fastify/swagger-ui@5.2.5

//Prisma ORM
$ npm install @prisma/client@7.4.0 @prisma/adapter-pg@7.4.0
$ npm install prisma@7.4.0 -D

// Inicializa configs do prisma
$ npx prisma init

// Formata arquivo de schema
$ npx prisma format

// Rodar banco de dados Postgres com Docker (Rancher Desktop)
$ docker compose up -d

// Conecta com o banco de dados e cria as tabelas
$ npx prisma db push

// Roda UI para visualizaçao do banco de dados
$ npx prisma studio

// Authentication framework for TypeScript
$ npm install better-auth@1.4.18

// Gera o prisma client - Cria classes para as tabelas do modelo
$ npx prisma generate

// Gera as tabelas para o banco de dados necessarias para auth
$ npx @better-auth/cli@1.4.18 generate

// Suporte CORS (para requests fora do dominio)
$ npm install @fastify/cors@11.2.0
