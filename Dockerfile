# -------- BUILD STAGE --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build


# -------- RUNTIME STAGE --------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# install ALL dependencies because prisma CLI needed for migrate deploy
RUN npm ci

# copy built files + prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
