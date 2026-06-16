// 幂等补全项目数据：按 slug 去重，已存在则更新，不存在则插入。
// 运行: node backend/models/seed-projects.js
const { db, initDatabase } = require('./database');

initDatabase();

const projects = [
  {
    name: 'Lcode Image',
    slug: 'lcode-image',
    summary: 'AI 图片生成站，提供文生图、参考图编辑、历史记录、社区分享、头像生成等完整功能。支持用户系统、邀请码注册、管理员后台和 Docker 一键部署。',
    description: [
      '<strong>用户系统</strong> - JWT 认证、邮箱注册、邀请码机制、权限管理',
      '<strong>AI 图片生成</strong> - 文生图、参考图编辑、参数调节、历史记录',
      '<strong>图片处理</strong> - 接入 Aliyun AI 阔图能力，支持图片扩展和优化',
      '<strong>社区分享</strong> - 作品展示、点赞评论、用户主页',
      '<strong>管理后台</strong> - 用户管理、配置上游接口、站点参数、定时任务',
      '<strong>Docker 部署</strong> - 容器化封装，支持一键启动和快速迁移',
    ].join('\n'),
    tech_stack: ['Vue 3', 'Pinia', 'Vue Router', 'Axios', 'ECharts', 'Vite', 'Node.js', 'Express', 'better-sqlite3', 'JWT', 'bcrypt', 'Docker', 'Aliyun AI'],
    demo_url: 'https://image2.lcode.space/',
    source_url: 'https://github.com/Linyu-H',
    category: 'fullstack,ai',
    featured: 1,
    stats: { 累计用户: '100+', 前端框架: 'Vue 3', 后端技术: 'Node.js', 容器化部署: 'Docker' },
  },
  {
    name: '实时热点监控系统',
    slug: 'hot-data-monitor',
    summary: '聚合知乎、微博、百度、B 站、GitHub、V2EX 等 30+ 平台的实时热点数据，通过 WebSocket 实时推送，支持分类展示、趋势图表和深色模式。',
    description: [
      '<strong>异步抓取</strong> - 基于 Spring WebFlux 实现高并发异步数据抓取',
      '<strong>实时推送</strong> - Spring WebSocket 实时推送热点更新',
      '<strong>数据解析</strong> - Jsoup HTML 解析 + Jackson JSON 处理',
      '<strong>可视化展示</strong> - ECharts 趋势图表、聚合排行榜',
      '<strong>响应式设计</strong> - 完整适配手机、平板和桌面端',
      '<strong>用户体验</strong> - 深色模式、触摸优化、无障碍访问',
    ].join('\n'),
    tech_stack: ['Spring Boot', 'Spring WebFlux', 'Spring WebSocket', 'Jsoup', 'Jackson', 'Vue 3', 'Pinia', 'ECharts', 'Vite'],
    demo_url: 'https://hot-data.lcode.space/',
    source_url: '',
    category: 'fullstack,backend',
    featured: 1,
    stats: { 数据源: '30+', 实时推送: 'WebSocket', 全端适配: '响应式' },
  },
  {
    name: '智能简历制作平台',
    slug: 'smart-resume-platform',
    summary: '全栈简历制作平台，提供可视化编辑器、AI 智能优化（润色/纠错/打分/岗位适配）、AI 模拟面试、会员体系、社区分享和后台运营完整功能。',
    description: [
      '<strong>可视化编辑器</strong> - 所见即所得，拖拽式模板定制',
      '<strong>AI 智能优化</strong> - 内容润色、语法纠错、评分建议、岗位适配分析',
      '<strong>AI 模拟面试</strong> - 根据简历内容生成面试问题和评估',
      '<strong>会员体系</strong> - 充值卡、额度管理、套餐权益',
      '<strong>社区分享</strong> - 模板库、作品展示、站内通知',
      '<strong>后端架构</strong> - Spring Boot 3.3 + MyBatis Plus，分层清晰',
      '<strong>容器化部署</strong> - Docker + docker-compose 一键启动，SQLite 数据持久化',
    ].join('\n'),
    tech_stack: ['Spring Boot 3.3', 'MyBatis Plus', 'SQLite', 'SpringDoc OpenAPI', 'BCrypt', 'Session 鉴权', 'Vue 3', 'Element Plus', 'Pinia', 'Axios', 'Docker'],
    demo_url: 'https://resume.lcode.space',
    source_url: '',
    category: 'fullstack,ai',
    featured: 1,
    stats: { 编辑方式: '可视化', AI能力: '优化+面试', 后端: 'Spring Boot 3.3' },
  },
  {
    name: '梨素材',
    slug: 'li-material',
    summary: '图片素材管理平台，支持素材展示、图片上传下载、信息解析和批量抓取。基于腾讯云 COS 封装文件服务，结合数据万象处理图片。',
    description: [
      '<strong>文件服务</strong> - 封装腾讯云 COS SDK，实现文件上传、下载、删除',
      '<strong>图片信息解析</strong> - 结合数据万象读取图片尺寸、格式、色彩等元信息',
      '<strong>批量抓取</strong> - 调用百度 API 并结合爬虫逻辑抓取图片地址',
      '<strong>素材管理</strong> - 分类展示、搜索筛选、批量操作',
    ].join('\n'),
    tech_stack: ['Spring Boot', '腾讯云 COS', '数据万象', '百度 API', '爬虫'],
    demo_url: 'http://111.231.51.40/',
    source_url: '',
    category: 'backend',
    featured: 0,
    stats: { 存储: '腾讯云 COS', 图片处理: '数据万象' },
  },
  {
    name: 'AI 中转站',
    slug: 'ai-gateway',
    summary: '基于 new-api 搭建的 AI 模型聚合服务，统一接入和管理多种 AI 模型接口，便于账号、额度和调用入口集中维护。',
    description: [
      '<strong>模型聚合</strong> - 统一管理多个 AI 模型服务接口',
      '<strong>账号管理</strong> - 集中维护 API Key、额度和权限',
      '<strong>平台部署</strong> - 负责服务部署、参数配置和版本更新',
      '<strong>监控维护</strong> - 日常可用性检查、异常处理、性能优化',
    ].join('\n'),
    tech_stack: ['new-api', 'AI 模型', '服务部署', '运维监控'],
    demo_url: 'https://api.lcode.store/',
    source_url: '',
    category: 'backend',
    featured: 0,
    stats: { 类型: '模型聚合', 运维: '集中管理' },
  },
  {
    name: '浏览器自动化脚本',
    slug: 'browser-automation',
    summary: '使用 Python Selenium 和 Playwright 编写的多种浏览器自动化脚本，用于网页操作、流程测试、数据采集和重复任务处理。',
    description: [
      '<strong>网页自动化</strong> - 表单填写、按钮点击、页面导航',
      '<strong>数据采集</strong> - 定向爬取、内容提取、结构化存储',
      '<strong>流程测试</strong> - 登录流程、交易流程、表单提交测试',
      '<strong>重复任务</strong> - 批量操作、定时执行、异常处理',
    ].join('\n'),
    tech_stack: ['Python', 'Selenium', 'Playwright', '自动化测试', '数据采集'],
    demo_url: '',
    source_url: '',
    category: 'automation',
    featured: 0,
    stats: {},
  },
];

const findBySlug = db.prepare('SELECT id FROM projects WHERE slug = ?');
const insert = db.prepare(`
  INSERT INTO projects (name, slug, summary, description, tech_stack, demo_url, source_url, category, featured, stats)
  VALUES (@name, @slug, @summary, @description, @tech_stack, @demo_url, @source_url, @category, @featured, @stats)
`);
const update = db.prepare(`
  UPDATE projects SET name=@name, summary=@summary, description=@description, tech_stack=@tech_stack,
    demo_url=@demo_url, source_url=@source_url, category=@category, featured=@featured, stats=@stats
  WHERE slug=@slug
`);

let inserted = 0, updated = 0;
for (const p of projects) {
  const row = {
    ...p,
    tech_stack: JSON.stringify(p.tech_stack || []),
    stats: JSON.stringify(p.stats || {}),
  };
  if (findBySlug.get(p.slug)) {
    update.run(row);
    updated++;
  } else {
    insert.run(row);
    inserted++;
  }
}

console.log(`项目数据补全完成：新增 ${inserted} 个，更新 ${updated} 个，共 ${projects.length} 个。`);
process.exit(0);
