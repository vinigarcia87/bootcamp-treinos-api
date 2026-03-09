FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# ----------- DEPENDENCIES -----------

FROM base AS deps

RUN pnpm install --frozen-lockfile

# ----------- BUILD -----------

FROM deps AS build

COPY . .

RUN pnpm run build && cp -r src/generated dist/generated

# ----------- PRODUCTION -----------

FROM base AS production

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
