
# === STAGE 1: Build static export ===
FROM node:22-alpine AS builder

WORKDIR /app

# Copier package.json et lock
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

# Copier tout le code
COPY . .

# Build Next.js en mode serveur standalone
RUN npm run build

# === STAGE 2: Serveur Next.js (API support) ===
FROM node:22-alpine AS runner

WORKDIR /app

# Copier le build Next.js et les fichiers nécessaires
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# Ajoute d'autres fichiers de config si besoin

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
