const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// 获取所有项目
router.get('/', (req, res) => {
  try {
    const { category, featured } = req.query;

    let query = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (featured) {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY created_at DESC';

    const projects = db.prepare(query).all(...params);

    // 解析 JSON 字段
    projects.forEach(project => {
      project.tech_stack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
      project.gallery = project.gallery ? JSON.parse(project.gallery) : [];
      project.stats = project.stats ? JSON.parse(project.stats) : {};
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取项目详情
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    // 解析 JSON 字段
    project.tech_stack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
    project.gallery = project.gallery ? JSON.parse(project.gallery) : [];
    project.stats = project.stats ? JSON.parse(project.stats) : {};

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
