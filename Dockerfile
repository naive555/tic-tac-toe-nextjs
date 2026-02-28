FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY bun.lock* package.json ./
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN bun run build


FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]