# Suggested Commands

**Development**:
```bash
pnpm dev                    # Start dev server with hot-reload (port 8081)
docker-compose up -d        # Start PostgreSQL
```

**Database**:
```bash
pnpm exec prisma migrate dev  # Run migrations
pnpm exec prisma generate     # Generate client
```

**Linting & Formatting**:
```bash
pnpm exec eslint .           # Lint code
pnpm exec prettier --write . # Format code
```

**System Commands** (Windows MINGW64):
- Use Unix-style commands (forward slashes)
- git, ls, cd, grep, find work normally
- Output paths to /dev/null not NUL