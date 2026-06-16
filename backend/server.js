const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化数据库
initDatabase();

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false, // 允许内联脚本（用于开发）
}));

// CORS
app.use(cors());

// 解析 JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制 100 个请求
});
app.use('/api/', limiter);

// 联系表单特殊限流（防止垃圾邮件）
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 小时
  max: 5 // 限制 5 次提交
});
app.use('/api/contact', contactLimiter);

// API 路由
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 管理后台干净路由别名
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// SPA 路由回退（所有非 API 请求返回 index.html）
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ success: false, message: 'API 端点不存在' });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   个人网站服务器已启动                    ║
║                                        ║
║   地址: http://localhost:${PORT}       ║
║   环境: ${process.env.NODE_ENV}        ║
║                                        ║
║   API 端点:                            ║
║   - GET  /api/blogs                    ║
║   - GET  /api/blogs/:slug              ║
║   - GET  /api/projects                 ║
║   - GET  /api/projects/:slug           ║
║   - POST /api/contact                  ║
║   - *    /api/admin/*  (管理后台)       ║
║                                        ║
║   管理后台: http://localhost:${PORT}/admin ║
╚════════════════════════════════════════╝
  `);
});
