
# === STAGE 1: Build static export ===
FROM node:22-alpine AS builder

WORKDIR /app

# Copier package.json et lock
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

# Copier tout le code
COPY . .

# Build Next.js en mode static export
RUN npm run build

# === STAGE 2: Serveur statique ===
FROM node:22-alpine AS runner

WORKDIR /app

# Copier le build statique
COPY --from=builder /app/out .

# Installer 'serve' pour servir le dossier out
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-l", "3000", "."]
