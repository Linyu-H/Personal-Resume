const express = require('express');
const router = express.Router();
const { db } = require('../models/database');
const { sendContactEmail } = require('../config/email');

// 表单验证中间件
function validateContactForm(req, res, next) {
  const { name, email, message } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: '请输入有效的姓名（至少2个字符）' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: '请输入有效的邮箱地址' });
  }

  if (!message || message.trim().length < 10) {
    return res.status(400).json({ success: false, message: '消息内容至少需要10个字符' });
  }

  next();
}

// 提交联系表单
router.post('/', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 存储到数据库
    const insert = db.prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(name.trim(), email.trim(), subject?.trim() || '', message.trim());

    // 发送邮件通知（异步，不阻塞响应）
    sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '网站联系',
      message: message.trim()
    }).catch(err => {
      console.error('邮件发送失败（已存储到数据库）:', err);
    });

    res.json({
      success: true,
      message: '消息发送成功！我会尽快回复您。',
      data: { id: result.lastInsertRowid }
    });
  } catch (error) {
    console.error('提交联系表单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误，请稍后重试' });
  }
});

// 获取联系记录（可选，用于管理后台）
router.get('/', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('获取联系记录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
