const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// 简单的管理员认证中间件（演示用）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
function adminAuth(req, res, next) {
  const token = req.headers.authorization || req.query.token;
  if (token === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ success: false, message: '未授权访问' });
  }
}

// ==================== 博客管理 ====================

// 获取所有博客（包含完整信息）
router.get('/blogs', adminAuth, (req, res) => {
  try {
    const blogs = db.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
    blogs.forEach(blog => {
      blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
    });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加博客
router.post('/blogs', adminAuth, (req, res) => {
  try {
    const { title, slug, summary, content, tags, cover_image } = req.body;

    // 检查 slug 是否已存在
    const existing = db.prepare('SELECT id FROM blogs WHERE slug = ?').get(slug);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug 已存在' });
    }

    const insert = db.prepare(`
      INSERT INTO blogs (title, slug, summary, content, tags, cover_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      slug,
      summary,
      content,
      JSON.stringify(tags || []),
      cover_image || null
    );

    res.json({ success: true, message: '博客添加成功', data: { id: result.lastInsertRowid } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新博客
router.put('/blogs/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, summary, content, tags, cover_image } = req.body;

    const update = db.prepare(`
      UPDATE blogs
      SET title = ?, slug = ?, summary = ?, content = ?, tags = ?, cover_image = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      title,
      slug,
      summary,
      content,
      JSON.stringify(tags || []),
      cover_image || null,
      id
    );

    res.json({ success: true, message: '博客更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除博客
router.delete('/blogs/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM blogs WHERE id = ?').run(id);
    res.json({ success: true, message: '博客删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 项目管理 ====================

// 获取所有项目
router.get('/projects', adminAuth, (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    projects.forEach(project => {
      project.tech_stack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
      project.gallery = project.gallery ? JSON.parse(project.gallery) : [];
      project.stats = project.stats ? JSON.parse(project.stats) : {};
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加项目
router.post('/projects', adminAuth, (req, res) => {
  try {
    const { name, slug, summary, description, tech_stack, demo_url, source_url, category, featured, stats } = req.body;

    const insert = db.prepare(`
      INSERT INTO projects (name, slug, summary, description, tech_stack, demo_url, source_url, category, featured, stats)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name,
      slug,
      summary,
      description,
      JSON.stringify(tech_stack || []),
      demo_url || null,
      source_url || null,
      category || '',
      featured ? 1 : 0,
      JSON.stringify(stats || {})
    );

    res.json({ success: true, message: '项目添加成功', data: { id: result.lastInsertRowid } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新项目
router.put('/projects/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, summary, description, tech_stack, demo_url, source_url, category, featured, stats } = req.body;

    const update = db.prepare(`
      UPDATE projects
      SET name = ?, slug = ?, summary = ?, description = ?, tech_stack = ?, demo_url = ?, source_url = ?, category = ?, featured = ?, stats = ?
      WHERE id = ?
    `);

    update.run(
      name,
      slug,
      summary,
      description,
      JSON.stringify(tech_stack || []),
      demo_url || null,
      source_url || null,
      category || '',
      featured ? 1 : 0,
      JSON.stringify(stats || {}),
      id
    );

    res.json({ success: true, message: '项目更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除项目
router.delete('/projects/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ success: true, message: '项目删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 联系记录管理 ====================

// 获取所有联系记录
router.get('/contacts', adminAuth, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新联系记录状态
router.put('/contacts/:id/status', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, message: '状态更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除联系记录
router.delete('/contacts/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    res.json({ success: true, message: '记录删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 统计数据 ====================

// 获取网站统计
router.get('/stats', adminAuth, (req, res) => {
  try {
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get().count;
    const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    const totalViews = db.prepare('SELECT SUM(views) as total FROM blogs').get().total || 0;

    res.json({
      success: true,
      data: {
        blogs: blogCount,
        projects: projectCount,
        contacts: contactCount,
        totalViews: totalViews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
