# Install dependencies only when needed
FROM ubuntu:22.04 AS builder

RUN apt-get -y update && apt-get -y upgrade \ 
&& apt-get -y install nodejs openssl curl npm \
&& curl -fsSL https://deb.nodesource.com/setup_18.x | bash

# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY ./package.json .

COPY . .

RUN npm install
RUN npx prisma generate

RUN npx patch-package 
RUN npm run build

RUN mkdir -p /app/.next/cache/images

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN chown nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s --retries=10 \
    CMD curl --fail http://localhost:3000 || exit 1

CMD ["npm", "run", "start"]