# Database Rules

## Prisma Schema
- Use proper naming conventions (camelCase for fields, PascalCase for models)
- Include appropriate indexes for query performance
- Use relations properly with cascade deletes where appropriate
- Document complex fields with comments

## Migrations
- Always run `npx prisma db push` after schema changes during development
- Use `npx prisma generate` to update the client after schema changes
- Test schema changes thoroughly before deployment

## Queries
- Use Prisma's type-safe query methods
- Prefer `findUnique` over `findFirst` when possible
- Use proper error handling for database operations
- Include necessary relations in queries to avoid N+1 problems