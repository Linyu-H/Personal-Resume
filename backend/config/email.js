const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendContactEmail(contactData) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `【网站联系】${contactData.subject || '新消息'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #234f8f;">网站联系表单</h2>
        <div style="background: #f6f3ed; padding: 20px; border-radius: 8px;">
          <p><strong>姓名：</strong> ${contactData.name}</p>
          <p><strong>邮箱：</strong> ${contactData.email}</p>
          <p><strong>主题：</strong> ${contactData.subject || '无'}</p>
          <p><strong>消息：</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #68717d; font-size: 12px; margin-top: 20px;">
          发送时间：${new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('邮件发送失败:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendContactEmail };
