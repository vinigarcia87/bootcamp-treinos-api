# BOOTCAMP TREINOS API

## Github

https://github.com/vinigarcia87/bootcamp-treinos-api/tree/master
https://github.com/fullstackclubeducacao/bootcamp-treinos/tree/aula-00

## Figma

https://www.figma.com/design/WrL53UwyzPqOzf1qVdscsN/FIT.AI--Alunos---c%C3%B3pia-?node-id=47-1546&p=f&t=0ElsQjK2x0ertof9-0

## Claude Code AI

https://www.reddit.com/r/ClaudeAI/comments/1piuih6/claude_rules_clauderules_are_here/
https://code.claude.com/docs/en/best-practices

https://code.claude.com/docs/en/mcp

- Ver mais tarde
  https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  https://github.com/hesreallyhim/awesome-claude-code

- Context7 MCP

  https://github.com/upstash/context7
  Up-to-date docs for LLMs and AI code editors Command
  Ajuda o Claude a pesquisar melhor tecnologias mais recentes

```
$ claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

- Serena MCP

https://github.com/oraios/serena

- Instalar uv
  An extremely fast Python package and project manager, written in Rust.

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)
```

- Figma

  O servidor MCP (local no app desktop ou remoto) permite que o Claude “leia” frames, componentes e variáveis de design

  Configuração (Desktop): Ative no Figma (Dev Mode > MCP server) e adicione ao Claude via CLI

```
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

## Cursor IDE

https://cursor.com/pricing

## Plugins para o VS Studio

- DotENV
- ESLint
- Prettier - Code formatter
- Prisma
- Thunder Client
- Git History

## Inicializaçao do projeto

```
$ pnpm init
```

```
// TypeScript 5.9 includes features specifically designed to improve Node.js compatibility and type checking
$ pnpm add typescript@5.9.3 @types/node@24 -D
```

```
$ pnpm add prettier@3.8.1 eslint@10.0.1 -D
```

```
$ git init
```

```
// The command npx tsc --init is used to initialize a TypeScript project by creating a default tsconfig.json configuration file in the current directory
$ npx tsc --init
```

```
// Compila typescript files em javascript files
$ npx tsc
```

```
// Roda o arquivo gerado em dist/index.js
$ node dist/index.js
```

```
// Hot Reload (roda qndo um arquivo atualiza)
$ pnpm add tsx@4.21.0 -D
```

```
// Roda o projeto com Hot Reload
$ pnpm run dev
```

```
// Configura o lint no projeto
$ pnpm init @eslint/config@1.11.0
```

```
// Corrige inconsistencias entre eslint e prettier
$ pnpm add eslint-config-prettier@10.1.8 -D
```

```
// Sorting para os imports
$ pnpm add eslint-plugin-simple-import-sort@12.1.1 -D
```

```
// Servidor de aplicaçao (express, nest, ...)
$ pnpm add fastify@5.7.4
```

```
// Gerenciador de arquivo .env
$ pnpm add dotenv@17.3.1
```

```
// TypeScript-first schema validation with static type inference
$ pnpm add zod@4.3.6 fastify-type-provider-zod@6.1.0
```

```
// Swagger
$ pnpm add @fastify/swagger@9.7.0

// Swagger UI - Nao vamos utilizar, nao instalar
$ pnpm add @fastify/swagger-ui@5.2.5
```

```
//Prisma ORM
$ pnpm add @prisma/client@7.4.0 @prisma/adapter-pg@7.4.0
$ pnpm add prisma@7.4.0 -D
```

```
// Inicializa configs do prisma
$ npx prisma init
```

```
// Formata arquivo de schema
$ npx prisma format
```

```
// Rodar banco de dados Postgres com Docker (Rancher Desktop)
$ docker compose up -d
```

```
// Conecta com o banco de dados e cria as tabelas
$ npx prisma db push
```

```
// Roda UI para visualizaçao do banco de dados
$ npx prisma studio
```

```
// Authentication framework for TypeScript
$ pnpm add better-auth@1.4.18
```

```
// Gera o prisma client - Cria classes para as tabelas do modelo
$ npx prisma generate
```

```
// Gera as tabelas para o banco de dados necessarias para auth
$ npx @better-auth/cli@1.4.18 generate
```

```
// Suporte CORS (para requests fora do dominio)
$ pnpm add @fastify/cors@11.2.0
```

```
// Adiciona documentaçao ao projeto
$ pnpm add @scalar/fastify-api-reference@1.44.20
```

## Rodar o projeto

```
$ pnpm run dev
```
