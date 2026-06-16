const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// 获取所有博客列表
router.get('/', (req, res) => {
  try {
    const { tag, search, limit = 10, offset = 0 } = req.query;

    let query = 'SELECT id, title, slug, summary, cover_image, tags, created_at, views FROM blogs WHERE 1=1';
    const params = [];

    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const blogs = db.prepare(query).all(...params);

    // 解析 tags JSON
    blogs.forEach(blog => {
      blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
    });

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
    const countParams = [];
    if (tag) {
      countQuery += ' AND tags LIKE ?';
      countParams.push(`%${tag}%`);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR summary LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      success: true,
      data: blogs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('获取博客列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取博客详情
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const blog = db.prepare('SELECT * FROM blogs WHERE slug = ?').get(slug);

    if (!blog) {
      return res.status(404).json({ success: false, message: '博客不存在' });
    }

    // 增加浏览量
    db.prepare('UPDATE blogs SET views = views + 1 WHERE id = ?').run(blog.id);
    blog.views += 1;

    // 解析 tags
    blog.tags = blog.tags ? JSON.parse(blog.tags) : [];

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('获取博客详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取所有标签
router.get('/meta/tags', (req, res) => {
  try {
    const blogs = db.prepare('SELECT tags FROM blogs WHERE tags IS NOT NULL').all();
    const tagsSet = new Set();

    blogs.forEach(blog => {
      const tags = JSON.parse(blog.tags);
      tags.forEach(tag => tagsSet.add(tag));
    });

    res.json({ success: true, data: Array.from(tagsSet) });
  } catch (error) {
    console.error('获取标签失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
