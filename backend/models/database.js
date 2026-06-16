const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/site.db');
const db = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 创建表
function initDatabase() {
  // 博客表
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      views INTEGER DEFAULT 0
    )
  `);

  // 项目表
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      description TEXT,
      cover_image TEXT,
      gallery TEXT,
      tech_stack TEXT,
      demo_url TEXT,
      source_url TEXT,
      category TEXT,
      featured INTEGER DEFAULT 0,
      stats TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 联系表单表
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `);

  console.log('数据库表创建成功');
}

// 插入示例数据
function seedData() {
  // 检查是否已有数据
  const blogCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
  if (blogCount.count > 0) {
    console.log('数据库已有数据，跳过初始化');
    return;
  }

  // 插入示例博客
  const insertBlog = db.prepare(`
    INSERT INTO blogs (title, slug, summary, content, cover_image, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const blogs = [
    {
      title: '我的全栈开发之旅',
      slug: 'my-fullstack-journey',
      summary: '从 Java 后端到全栈开发，记录我的技术成长历程。',
      content: `# 我的全栈开发之旅

## 起点

大学期间，我开始接触 Java 后端开发。Spring Boot 的便捷性让我快速上手了企业级应用开发。

## 技术栈扩展

随着项目经验的积累，我逐渐扩展到：
- 前端：Vue 3、React
- 数据库：MySQL、SQLite、Redis
- 部署：Docker、Linux 运维

## 未来方向

继续深入全栈技术栈，探索微服务架构和云原生应用。`,
      cover_image: '/assets/images/blog-1.jpg',
      tags: JSON.stringify(['全栈开发', 'Java', 'Vue'])
    },
    {
      title: 'Spring Boot 最佳实践',
      slug: 'spring-boot-best-practices',
      summary: '在实际项目中总结的 Spring Boot 开发规范和技巧。',
      content: `# Spring Boot 最佳实践

## 项目结构

推荐的分层架构：
- Controller：接口层
- Service：业务逻辑层
- Repository：数据访问层

## 配置管理

使用 \`application.yml\` 统一管理配置，区分开发、测试、生产环境。

## 异常处理

全局异常处理器 \`@ControllerAdvice\` 统一处理异常。`,
      cover_image: '/assets/images/blog-2.jpg',
      tags: JSON.stringify(['Spring Boot', '后端', '最佳实践'])
    },
    {
      title: 'Vue 3 Composition API 实战',
      slug: 'vue3-composition-api',
      summary: '深入理解 Vue 3 的 Composition API，构建可维护的前端应用。',
      content: `# Vue 3 Composition API 实战

## 为什么选择 Composition API

相比 Options API，Composition API 提供了更好的代码组织和复用能力。

## 核心概念

- \`ref\` 和 \`reactive\`
- \`computed\` 和 \`watch\`
- 生命周期钩子

## 实战案例

使用 Composition API 构建一个 Todo 应用。`,
      cover_image: '/assets/images/blog-3.jpg',
      tags: JSON.stringify(['Vue 3', '前端', 'JavaScript'])
    }
  ];

  for (const blog of blogs) {
    insertBlog.run(blog.title, blog.slug, blog.summary, blog.content, blog.cover_image, blog.tags);
  }

  // 插入项目数据
  const insertProject = db.prepare(`
    INSERT INTO projects (name, slug, summary, description, tech_stack, demo_url, source_url, category, featured, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    {
      name: 'Lcode Image',
      slug: 'lcode-image',
      summary: 'AI 图片生成站，支持文生图、参考图编辑、社区分享和管理后台。',
      description: '完整的 AI 图片生成平台，累计使用量 100+',
      tech_stack: JSON.stringify(['Vue 3', 'Node.js', 'Docker', 'AI']),
      demo_url: 'https://image2.lcode.space/',
      source_url: 'https://github.com/Linyu-H',
      category: 'fullstack,ai',
      featured: 1,
      stats: JSON.stringify({ users: '100+', tech: 'Vue 3', backend: 'Node.js', deploy: 'Docker' })
    },
    {
      name: '实时热点监控系统',
      slug: 'hot-data-monitor',
      summary: '聚合 30+ 平台热点数据，实时 WebSocket 推送。',
      description: '基于 Spring Boot WebFlux 异步抓取，ECharts 可视化展示',
      tech_stack: JSON.stringify(['Spring Boot', 'WebSocket', 'ECharts', '响应式']),
      demo_url: 'https://hot-data.lcode.space/',
      source_url: '',
      category: 'fullstack,backend',
      featured: 1,
      stats: JSON.stringify({ sources: '30+', realtime: 'WebSocket', responsive: '全端适配' })
    }
  ];

  for (const project of projects) {
    insertProject.run(
      project.name,
      project.slug,
      project.summary,
      project.description,
      project.tech_stack,
      project.demo_url,
      project.source_url,
      project.category,
      project.featured,
      project.stats
    );
  }

  console.log('示例数据插入成功');
}

module.exports = { db, initDatabase, seedData };
