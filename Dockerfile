# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# المرحلة 1: تثبيت التبعيات (Deps Stage)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# نسخ ملفات pnpm
COPY package.json pnpm-lock.yaml ./
# تفعيل pnpm وتثبيت التبعيات
RUN corepack enable pnpm && pnpm i --frozen-lockfile


# المرحلة 2: البناء (Builder Stage)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# عملية البناء باستخدام pnpm
RUN corepack enable pnpm && pnpm run build


# المرحلة 3: التشغيل (Runner Stage)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
# يتم تعيين HOSTNAME هنا لضمان الاستماع لجميع الواجهات (0.0.0.0)
ENV HOSTNAME="0.0.0.0" 

CMD ["node", "server.js"]