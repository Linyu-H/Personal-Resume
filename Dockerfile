# ---------- 构建阶段：编译 better-sqlite3 原生模块 ----------
FROM node:22-slim AS builder

# better-sqlite3 在 Node 22 上通常需要现场编译
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ---------- 运行阶段：精简镜像 ----------
FROM node:22-slim AS runner

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# 复用已编译好的依赖（同为 debian glibc，原生模块可直接用）
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY backend ./backend
COPY frontend ./frontend
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh \
    && mkdir -p data

EXPOSE 3000

# 首次启动自动初始化并填充数据库，然后启动服务
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "backend/server.js"]
