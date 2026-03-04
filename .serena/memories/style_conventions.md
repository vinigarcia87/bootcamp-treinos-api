# Style and Conventions

**TypeScript**:
- Strict mode, target ES2024, ESM modules
- Named exports (não default exports)
- Arrow functions preferidas
- Interface > type
- PascalCase para classes, camelCase para variáveis/métodos

**File Naming**:
- kebab-case para arquivos (workout-plan.route.ts)
- PascalCase para use cases (CreateWorkoutPlan.ts)

**API Routes**:
- REST principles
- `app.withTypeProvider<ZodTypeProvider>().route()` para type safety
- Zod schemas com tags e summary para OpenAPI

**Use Cases**:
- Classes com método execute()
- InputDto e OutputDto interfaces
- Mapear resultado Prisma para OutputDto
- Lançar erros customizados (não tratar aqui)