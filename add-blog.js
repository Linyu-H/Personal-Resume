// 添加博客文章的脚本
const { db } = require('./backend/models/database');

// 添加新博客
function addBlog(blogData) {
  const insert = db.prepare(`
    INSERT INTO blogs (title, slug, summary, content, tags, cover_image)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = insert.run(
      blogData.title,
      blogData.slug,
      blogData.summary,
      blogData.content,
      JSON.stringify(blogData.tags),
      blogData.cover_image || null
    );

    console.log(`✅ 博客添加成功！ID: ${result.lastInsertRowid}`);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('❌ 添加失败:', error.message);
  }
}

// 示例：添加一篇新博客
const myBlog = {
  title: '我的第一篇博客',
  slug: 'my-first-blog',  // URL 中使用，只能包含字母、数字、连字符
  summary: '这是我的第一篇技术博客，记录学习过程。',
  content: `# 我的第一篇博客

## 前言

今天开始写博客了！记录我的技术学习之路。

## 正文内容

这里使用 Markdown 格式书写：

- 支持列表
- 支持**粗体**和*斜体*
- 支持代码块

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

## 总结

今天学到了很多！
`,
  tags: ['学习', '博客', '记录'],  // 标签数组
  cover_image: null  // 封面图片路径（可选）
};

// 执行添加
addBlog(myBlog);

// 查看所有博客
console.log('\n📚 当前所有博客：');
const blogs = db.prepare('SELECT id, title, slug, created_at FROM blogs ORDER BY created_at DESC').all();
blogs.forEach(blog => {
  console.log(`- [${blog.id}] ${blog.title} (${blog.slug})`);
});
