#!/bin/bash

echo "================================"
echo "  个人网站启动脚本"
echo "================================"
echo ""

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，安装依赖..."
    npm install
fi

# 检查数据库
if [ ! -f "data/site.db" ]; then
    echo "🗄️  初始化数据库..."
    npm run init-db
fi

# 启动服务器
echo "🚀 启动服务器..."
echo ""
npm start
