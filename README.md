# 个人网站 - 全栈应用

林宇航的个人网站，基于 Node.js + Express + SQLite 构建，集成了深色模式、动画效果、粒子背景、博客系统、作品集展示和联系表单等完整功能。

## ✨ 功能特性

### 核心功能
- 🎨 **精美设计** - 米色纸质感设计风格，响应式布局
- 🌓 **深色模式** - 支持浅色/深色主题切换，localStorage 持久化
- ✨ **动画效果** - 加载动画、滚动动画、微交互效果
- 🎭 **粒子背景** - 原生 Canvas 实现的交互式粒子背景
- 📝 **博客系统** - Markdown 渲染、代码高亮、标签筛选
- 💼 **作品集** - 项目展示、详情页、分类筛选
- 📧 **联系表单** - 表单验证、邮件发送、防重复提交
- 🎯 **微交互** - 按钮涟漪、自定义光标、返回顶部、滚动进度条

### 技术栈

**前端**
- HTML5 / CSS3 / JavaScript (ES6+)
- CSS 变量（主题切换）
- Intersection Observer API（滚动动画）
- Canvas API（粒子背景）
- Marked.js（Markdown 渲染）
- Highlight.js（代码高亮）

**后端**
- Node.js + Express
- better-sqlite3（SQLite 数据库）
- nodemailer（邮件发送）
- helmet（安全防护）
- cors（跨域支持）
- express-rate-limit（限流）

## 📦 安装

### 环境要求
- Node.js >= 14.x
- npm >= 6.x

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd mine-jl
```

2. **安装依赖**
```bash
npm install
```

3. **初始化数据库**
```bash
npm run init-db
```

4. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置邮件服务（可选）：
```env
PORT=3000
NODE_ENV=development

# 邮件配置（使用 Gmail 示例）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

**Gmail 配置说明：**
- 需要开启"两步验证"
- 生成"应用专用密码"用于 `SMTP_PASS`
- 参考：https://support.google.com/accounts/answer/185833

## 🚀 运行

### 开发模式
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动，并支持热重载。

### 生产模式
```bash
npm start
```

## 📁 项目结构

```
mine-jl/
├── frontend/                 # 前端文件
│   ├── index.html           # 主页
│   ├── resume.html          # 简历页
│   ├── portfolio.html       # 作品集
│   ├── blog.html            # 博客列表
│   ├── blog-detail.html     # 博客详情
│   ├── project-detail.html  # 项目详情
│   ├── admin.html           # 管理后台（博客/项目/留言管理）
│   ├── css/
│   │   ├── common.css       # 公共样式（主题变量）
│   │   ├── animations.css   # 动画效果
│   │   └── micro-interactions.css # 微交互
│   ├── js/
│   │   ├── theme.js         # 主题切换
│   │   ├── animations.js    # 动画管理
│   │   ├── micro-interactions.js # 微交互效果
│   │   ├── particles.js     # 粒子背景
│   │   └── contact.js       # 联系表单
│   └── assets/
│       └── images/          # 图片资源
├── backend/
│   ├── server.js            # Express 服务器
│   ├── routes/              # API 路由
│   │   ├── blog.js          # 博客 API
│   │   ├── projects.js      # 项目 API
│   │   ├── contact.js       # 联系表单 API
│   │   └── admin.js         # 管理后台 API（增删改查）
│   ├── models/
│   │   ├── database.js      # 数据库模型
│   │   └── init-database.js # 数据库初始化
│   └── config/
│       └── email.js         # 邮件配置
├── data/
│   └── site.db              # SQLite 数据库
├── package.json
├── .env                     # 环境变量
└── README.md
```

## 🔌 API 接口

### 博客 API

**获取博客列表**
```
GET /api/blogs?tag=Vue&search=关键词&limit=10&offset=0
```

**获取博客详情**
```
GET /api/blogs/:slug
```

**获取所有标签**
```
GET /api/blogs/meta/tags
```

### 项目 API

**获取项目列表**
```
GET /api/projects?category=fullstack&featured=1
```

**获取项目详情**
```
GET /api/projects/:slug
```

### 联系表单 API

**提交联系表单**
```
POST /api/contact
Content-Type: application/json

{
  "name": "姓名",
  "email": "email@example.com",
  "subject": "主题（可选）",
  "message": "消息内容"
}
```

### 管理后台 API

所有 `/api/admin/*` 接口需携带管理密码，通过 `?token=密码` 或 `Authorization` 请求头传递。

```
GET    /api/admin/stats              # 网站统计
GET    /api/admin/blogs              # 博客列表（含正文）
POST   /api/admin/blogs              # 新增博客
PUT    /api/admin/blogs/:id          # 更新博客
DELETE /api/admin/blogs/:id          # 删除博客
GET    /api/admin/projects           # 项目列表
POST   /api/admin/projects           # 新增项目
PUT    /api/admin/projects/:id       # 更新项目
DELETE /api/admin/projects/:id       # 删除项目
GET    /api/admin/contacts           # 联系记录
DELETE /api/admin/contacts/:id       # 删除联系记录
```

## 🎨 主题定制

所有主题变量定义在 `frontend/css/common.css` 中：

```css
:root {
  /* 浅色模式 */
  --bg: #f6f3ed;
  --paper: #fffdf8;
  --text: #1f252d;
  --accent: #234f8f;
  /* ... */
}

[data-theme="dark"] {
  /* 深色模式 */
  --bg: #1a1d23;
  --paper: #23262d;
  --text: #e8e9ed;
  --accent: #5689c7;
  /* ... */
}
```

修改这些变量即可自定义颜色方案。

## ⚙️ 配置选项

### 禁用粒子背景
在 HTML 的 `<body>` 标签添加：
```html
<body data-particles="false">
```

### 禁用自定义光标（移动端自动禁用）
编辑 `frontend/js/micro-interactions.js`，注释掉 `initCustomCursor()` 调用。

### 调整粒子数量
编辑 `frontend/js/particles.js`：
```javascript
const defaultOptions = {
  particleCount: 80,  // 修改粒子数量
  speed: 0.3,
  // ...
};
```

## 📝 添加内容

### 使用管理后台（推荐）

访问 `http://localhost:3000/admin`（或点击任意页面页脚的「管理后台」链接），输入管理密码即可：

- **博客管理** — 添加 / 编辑 / 删除文章，支持 Markdown 正文和标签
- **项目管理** — 添加 / 编辑 / 删除作品集项目，含技术栈、分类、精选标记
- **联系记录** — 查看 / 删除访客留言
- **数据统计** — 博客、项目、留言数量与总浏览量

默认密码为 `admin123`，可在 `.env` 中通过 `ADMIN_PASSWORD` 修改：

```env
ADMIN_PASSWORD=your-secure-password
```

> ⚠️ 部署到生产环境前请务必修改默认密码。

### 通过代码添加博客文章

如需脚本化批量导入，也可直接操作数据库：

```javascript
const { db } = require('./backend/models/database');

db.prepare(`
  INSERT INTO blogs (title, slug, summary, content, tags)
  VALUES (?, ?, ?, ?, ?)
`).run(
  '文章标题',
  'article-slug',
  '文章摘要',
  '# 正文内容\n\nMarkdown 格式',
  JSON.stringify(['标签1', '标签2'])
);
```

### 添加项目

```javascript
db.prepare(`
  INSERT INTO projects (name, slug, summary, description, tech_stack, demo_url, category, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  '项目名称',
  'project-slug',
  '简短描述',
  '详细描述',
  JSON.stringify(['Vue 3', 'Node.js']),
  'https://demo.url',
  'fullstack',
  1
);
```

## 🚢 部署

### 部署到云服务器

1. 上传代码到服务器
2. 安装依赖：`npm install --production`
3. 初始化数据库：`npm run init-db`
4. 配置环境变量
5. 使用 PM2 运行：
```bash
npm install -g pm2
pm2 start backend/server.js --name personal-website
pm2 save
pm2 startup
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 性能优化建议

- ✅ 启用 Gzip 压缩
- ✅ 配置静态资源缓存
- ✅ 使用 CDN 加速外部资源
- ✅ 图片懒加载（已内置）
- ✅ 减少动画复杂度（移动端）

## 🔒 安全性

- ✅ Helmet 安全头
- ✅ CORS 配置
- ✅ API 限流
- ✅ 表单验证（前端 + 后端）
- ✅ SQL 注入防护（参数化查询）

## 📜 License

MIT

## 👨‍💻 作者

林宇航 - Java 后端开发 / Web 全栈工程师

- GitHub: [@Linyu-H](https://github.com/Linyu-H)
- Gitee: [@lin-yuhang1113](https://gitee.com/lin-yuhang1113)

## 🙏 致谢

- [Express](https://expressjs.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [nodemailer](https://nodemailer.com/)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
