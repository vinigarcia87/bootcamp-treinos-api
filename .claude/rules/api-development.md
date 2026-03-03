# API Development Rules

## Code Style

- Use TypeScript with strict mode
- Follow ESM imports/exports
- Sort imports using simple-import-sort plugin
- Use Prettier for formatting
- Prefer const over let, avoid var

## API Development

- Use Fastify with TypeProvider<ZodTypeProvider> for type-safe routes
- Define Zod schemas for all request/response validation
- Include OpenAPI documentation for all endpoints
- Use proper HTTP status codes and error handling

## Database

- Use Prisma with PostgreSQL adapter
- Generate client after schema changes: `npx prisma generate`
- Keep models focused on workout management domain
- Use proper relations and indexes

## Authentication

- Use better-auth for authentication flows
- Don't modify auth tables directly - use better-auth methods
- Ensure CORS is properly configured for frontend

## File Organization

- Keep generated Prisma code in src/generated/prisma/
- Place business logic in src/lib/
- Use descriptive file and variable names
- Group related functionality together

## Environment

- Never commit .env files
- Use proper environment variable validation
- Document all required env vars in CLAUDE.md

## Route Definitions

- Always use `app.withTypeProvider<ZodTypeProvider>().route()` for type safety
- Include proper schema definitions with tags and descriptions
- Use meaningful route names and group related endpoints

## Error Handling

- Use structured error responses with consistent format
- Include error codes for client handling
- Log errors appropriately without exposing sensitive data

## Validation

- Define Zod schemas for all inputs and outputs
- Validate query parameters, body, and headers as needed
- Use Zod transforms for data normalization

## Documentation

- Every endpoint should have OpenAPI documentation
- Include examples in schema definitions
- Keep API documentation up to date
- **ALWAYS** create documentation inside /docs directory
- Create a documentation for .env file and **ALWAYS** keep it updated
