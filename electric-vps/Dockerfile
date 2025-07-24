# === STAGE 1: Build ===
FROM node:22-alpine AS builder

# Arguments (passés depuis GitHub Actions ou autre)
ARG NEXT_PUBLIC_PROJECT_URL
ARG NEXT_PUBLIC_STAGING_PROJECT_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG LOCALHOST

# Variables d'environnement pour build uniquement (NON persistées dans image finale)
ENV NEXT_PUBLIC_PROJECT_URL=$NEXT_PUBLIC_PROJECT_URL \
    NEXT_PUBLIC_STAGING_PROJECT_URL=$NEXT_PUBLIC_STAGING_PROJECT_URL \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    LOCALHOST=$LOCALHOST

WORKDIR /app

# Dépendances
COPY package.json package-lock.json ./

# Installer les dépendances et nettoyer le cache npm
RUN npm install && npm cache clean --force

# Copier tout (code source, composants plasmic, tests, etc.)
COPY . .

# Revenir pour build de l'app Next.js
WORKDIR /app
RUN npm run build

# === STAGE 2: Runtime (léger & sans secrets) ===
FROM node:22-alpine AS runner

WORKDIR /app

# Copier uniquement ce qui est nécessaire pour exécuter l'app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
