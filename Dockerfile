FROM node:22.21.1-alpine3.23 AS base

WORKDIR /app

COPY package.json package-lock.json* ./

FROM base AS build

COPY --from=base /app/package.json /app/package-lock.json* ./

RUN npm ci --only=production

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Создаем public папку и временный __env.js
RUN mkdir -p /app/public && \
    echo "window.env = {}" > /app/public/__env.js

RUN npm run build

FROM node:22.21.1-alpine3.23 AS frontend

WORKDIR /app

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nextjs /app/.next ./.next
COPY --from=build --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nextjs /app/next.config.ts ./next.config.ts
COPY --from=build --chown=nextjs:nextjs /app/scripts ./scripts
COPY --from=build --chown=nextjs:nextjs /app/public ./public

# Даем права на запись для обновления __env.js
RUN chown -R nextjs:nextjs /app/public

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]