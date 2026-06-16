#!/bin/sh
set -e

# 首次部署时数据库不存在 -> 初始化表结构并填充种子数据
if [ ! -f "data/site.db" ]; then
  echo "🗄️  未检测到数据库，正在初始化并填充种子数据..."
  node backend/models/init-database.js
  echo "✅ 数据库初始化完成"
fi

exec "$@"
