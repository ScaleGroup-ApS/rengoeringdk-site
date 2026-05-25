# =============================================================================
# Customer Site — React Router 7 SSR (Node.js)
# =============================================================================
# Standalone Dockerfile for per-customer repos built via GitHub Actions.

# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install npm install

# Stage 2: Build
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production dependencies only
FROM node:20-slim AS production-deps
WORKDIR /app
COPY package.json ./
RUN npm install --production

# Stage 4: Runtime
FROM node:20-slim AS runtime
WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npm", "run", "start"]
