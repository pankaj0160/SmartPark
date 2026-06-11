# ─────────────────────────────────────────────────────────────────
#  Stage 1: Dependencies
#  We copy package.json FIRST so this layer is cached.
#  npm ci only re-runs when package.json changes — not on every
#  code edit. This makes rebuilds go from 30s → 1s.
# ─────────────────────────────────────────────────────────────────

# Use Node.js 20 on Alpine Linux (Alpine = tiny, ~5MB vs ~900MB full)
FROM node:20-alpine

# Set the working directory inside the container.
# All subsequent COPY and RUN commands operate from here.
WORKDIR /app

# Copy package files FIRST (before source code).
# Docker will cache the npm ci layer until package.json changes.
COPY package*.json ./

# Install production dependencies only.
# --omit=dev skips jest, nodemon, eslint etc. — not needed in production.
RUN npm install --omit=dev

# Now copy the rest of the source code.
# This layer changes every time you edit code.
# Placed AFTER npm ci so dependency install is cached.
COPY . .

# Document that the container listens on port 5000.
# This doesn't actually publish the port — docker-compose.yml does that.
EXPOSE 5000

# Health check: Docker will ping /api/health every 30s.
# If it fails 3 times, the container is marked "unhealthy".
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the server.
# Array form (not string) is required for proper signal handling.
# "docker stop" sends SIGTERM → Node.js can shut down gracefully.
CMD ["node", "src/server.js"]