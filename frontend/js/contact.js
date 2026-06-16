// =====================
// 联系表单处理
// =====================

class ContactForm {
  constructor(formSelector = '#contact-form') {
    this.form = document.querySelector(formSelector);
    this.submitButton = null;
    this.isSubmitting = false;

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.attachListeners();
  }

  attachListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // 实时验证
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    let isValid = true;
    let errorMessage = '';

    // 清除之前的错误
    this.clearFieldError(field);

    // 验证规则
    if (field.required && !value) {
      isValid = false;
      errorMessage = '此字段为必填项';
    } else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '请输入有效的邮箱地址';
      }
    } else if (field.name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = '姓名至少需要2个字符';
    } else if (type === 'textarea' && value && value.length < 10) {
      isValid = false;
      errorMessage = '消息内容至少需要10个字符';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');

    let errorDiv = field.parentElement.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      field.parentElement.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // 防止重复提交
    if (this.isSubmitting) return;

    // 验证表单
    if (!this.validateForm()) {
      this.showNotification('请检查表单中的错误', 'error');
      return;
    }

    this.isSubmitting = true;
    this.setSubmitButtonState(true);

    // 收集表单数据
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.showNotification(result.message || '消息发送成功！我会尽快回复您。', 'success');
        this.form.reset();
      } else {
        this.showNotification(result.message || '发送失败，请稍后重试', 'error');
      }
    } catch (error) {
      console.error('提交失败:', error);
      this.showNotification('网络错误，请检查连接后重试', 'error');
    } finally {
      this.isSubmitting = false;
      this.setSubmitButtonState(false);
    }
  }

  setSubmitButtonState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.dataset.originalText = this.submitButton.textContent;
      this.submitButton.textContent = '发送中...';
      this.submitButton.classList.add('loading');
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = this.submitButton.dataset.originalText || '发送消息';
      this.submitButton.classList.remove('loading');
    }
  }

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 16px 24px;
      border-radius: 12px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);

    // 添加动画样式
    if (!document.getElementById('notification-style')) {
      const style = document.createElement('style');
      style.id = 'notification-style';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }
        input.error,
        textarea.error {
          border-color: #ef4444 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// =====================
// 初始化
// =====================

function initContactForm() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ContactForm('#contact-form');
    });
  } else {
    new ContactForm('#contact-form');
  }
}

// 自动初始化
initContactForm();

// 导出
if (typeof window !== 'undefined') {
  window.ContactForm = ContactForm;
}
