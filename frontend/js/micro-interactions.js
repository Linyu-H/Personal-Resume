// =====================
// 微交互效果
// =====================

class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.initRippleEffect();
    this.initCustomCursor();
    this.initMagneticButtons();
  }

  // 涟漪效果
  initRippleEffect() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.ripple');
      if (!target) return;

      const ripple = document.createElement('span');
      const rect = target.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      `;

      target.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });

    // 添加 CSS 动画
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 自定义光标（仅桌面端）
  initCustomCursor() {
    // 移动端跳过
    if (window.innerWidth <= 768) return;
    if ('ontouchstart' in window) return;

    // 创建光标元素
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // 更新光标位置
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // 平滑跟随效果
    function animate() {
      const dx = mouseX - outlineX;
      const dy = mouseY - outlineY;

      outlineX += dx * 0.2;
      outlineY += dy * 0.2;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animate);
    }

    animate();

    // Hover 效果
    const hoverElements = 'a, button, .hover-effect, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(hoverElements)) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(hoverElements)) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });

    // 启用自定义光标
    document.body.classList.add('custom-cursor');
  }

  // 磁吸效果（按钮跟随鼠标）
  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach((element) => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.3;
        const moveY = y * 0.3;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }
}

// =====================
// 工具函数
// =====================

// 节流函数
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 平滑滚动到元素
function smoothScrollTo(element, offset = 0) {
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// =====================
// 初始化
// =====================

function initMicroInteractions() {
  // 检查用户是否偏好减少动画
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    new MicroInteractions();
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMicroInteractions);
} else {
  initMicroInteractions();
}

// 导出
if (typeof window !== 'undefined') {
  window.MicroInteractions = MicroInteractions;
  window.throttle = throttle;
  window.debounce = debounce;
  window.smoothScrollTo = smoothScrollTo;
}
