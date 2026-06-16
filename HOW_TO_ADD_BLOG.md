# 📝 如何添加你自己的博客

## 方法 1：使用脚本添加（推荐）

### 步骤 1：编辑博客内容

打开 `add-blog.js` 文件，修改博客内容：

```javascript
const myBlog = {
  title: '你的博客标题',
  slug: 'your-blog-slug',  // URL 友好的标识符，如：react-hooks-guide
  summary: '博客摘要，显示在列表页',
  content: `# 博客标题

## 章节 1

这里写正文内容...

### 小标题

- 列表项 1
- 列表项 2

\`\`\`javascript
// 代码示例
console.log('Hello');
\`\`\`

## 章节 2

更多内容...
`,
  tags: ['标签1', '标签2', 'Vue'],  // 标签数组
  cover_image: null  // 可选：'/assets/images/blog-cover.jpg'
};
```

### 步骤 2：运行脚本

```bash
node add-blog.js
```

### 步骤 3：查看效果

访问 http://localhost:3000/blog.html 即可看到新添加的博客！

---

## 方法 2：直接操作数据库

### 使用 SQLite 命令行

```bash
# 打开数据库
sqlite3 data/site.db

# 插入博客
INSERT INTO blogs (title, slug, summary, content, tags)
VALUES (
  '博客标题',
  'blog-slug',
  '博客摘要',
  '# Markdown 正文内容',
  '["标签1", "标签2"]'
);

# 查看所有博客
SELECT id, title, slug FROM blogs;

# 退出
.quit
```

---

## 方法 3：使用数据库管理工具

推荐工具：
- **DB Browser for SQLite** (免费，跨平台)
- **DBeaver** (免费，功能强大)
- **TablePlus** (付费，界面美观)

步骤：
1. 打开工具，连接到 `data/site.db`
2. 找到 `blogs` 表
3. 添加新记录，填写字段
4. 保存

---

## Markdown 语法参考

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 文本样式
```markdown
**粗体文字**
*斜体文字*
~~删除线~~
`行内代码`
```

### 列表
```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

### 链接和图片
```markdown
[链接文字](https://example.com)
![图片描述](图片URL)
```

### 代码块
````markdown
```javascript
function hello() {
  console.log('Hello, World!');
}
```
````

### 引用
```markdown
> 这是一段引用文字
> 可以多行
```

### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
```

---

## 博客字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | TEXT | ✅ | 博客标题 |
| slug | TEXT | ✅ | URL 标识符，唯一，如：my-first-blog |
| summary | TEXT | ❌ | 摘要，显示在列表页 |
| content | TEXT | ✅ | 正文内容，支持 Markdown |
| tags | TEXT | ❌ | JSON 数组，如：["Vue", "前端"] |
| cover_image | TEXT | ❌ | 封面图片路径 |
| created_at | DATETIME | 自动 | 创建时间 |
| views | INTEGER | 自动 | 浏览量（自动统计）|

---

## slug 命名规则

slug 是博客的 URL 标识符，必须：
- 只包含小写字母、数字、连字符 `-`
- 不能包含空格、中文、特殊字符
- 保持简短、有意义

**示例：**
- ✅ `react-hooks-guide`
- ✅ `my-first-blog-2024`
- ✅ `vue3-composition-api`
- ❌ `我的博客` （包含中文）
- ❌ `React Hooks Guide` （包含空格和大写）

---

## 批量添加示例

```javascript
const blogs = [
  {
    title: 'Vue 3 入门指南',
    slug: 'vue3-getting-started',
    summary: 'Vue 3 快速上手教程',
    content: `# Vue 3 入门...`,
    tags: ['Vue', '前端']
  },
  {
    title: 'Spring Boot 实战',
    slug: 'spring-boot-practice',
    summary: 'Spring Boot 项目实战经验',
    content: `# Spring Boot...`,
    tags: ['Spring Boot', 'Java']
  }
];

blogs.forEach(blog => addBlog(blog));
```

---

## 常见问题

### Q: 博客不显示？
A: 检查：
1. slug 是否唯一（不能重复）
2. 数据库是否正常保存
3. 浏览器是否刷新

### Q: 代码高亮不工作？
A: 确保代码块指定了语言：
````markdown
```javascript
// 这样会高亮
```
````

### Q: 如何删除博客？
```bash
node -e "require('./backend/models/database').db.prepare('DELETE FROM blogs WHERE slug = ?').run('blog-slug')"
```

### Q: 如何更新博客？
```bash
# 使用 SQLite 命令行或数据库工具
sqlite3 data/site.db
UPDATE blogs SET content = '新内容' WHERE slug = 'blog-slug';
```

---

## 下一步

考虑添加：
1. 管理后台（Web 界面添加/编辑博客）
2. Markdown 文件导入功能
3. 图片上传功能
4. 博客分类功能

需要我帮你实现这些功能吗？
