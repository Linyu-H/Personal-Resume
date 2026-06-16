// =====================
// 粒子背景效果（原生 Canvas）
// =====================

// 读取当前主题的强调色（--accent），让粒子与企业蓝协调
function readAccentRGB() {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    let hex = v.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (![r, g, b].some(Number.isNaN)) return [r, g, b];
    }
  } catch (e) { /* 忽略，使用回退色 */ }
  return [100, 116, 139]; // slate-500 回退
}

function accentRGBA(alpha) {
  const [r, g, b] = readAccentRGB();
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

class ParticlesBackground {
  constructor(options = {}) {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;

    // 配置项
    this.config = {
      particleCount: options.particleCount || 80,
      particleColor: options.particleColor || accentRGBA(0.42),
      lineColor: options.lineColor || accentRGBA(0.16),
      followTheme: options.particleColor ? false : true,
      particleSize: options.particleSize || 2,
      lineDistance: options.lineDistance || 150,
      speed: options.speed || 0.5,
      interactive: options.interactive !== false,
      enabled: options.enabled !== false
    };

    if (this.config.enabled) {
      this.init();
    }
  }

  init() {
    // 创建 Canvas
    this.createCanvas();

    // 创建粒子
    this.createParticles();

    // 监听事件
    this.attachListeners();

    // 开始动画
    this.animate();
  }

  createCanvas() {
    // 检查是否已存在
    if (document.getElementById('particles-canvas')) {
      this.canvas = document.getElementById('particles-canvas');
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particles-canvas';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      `;
      document.body.prepend(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        size: Math.random() * this.config.particleSize + 1
      });
    }
  }

  attachListeners() {
    // 窗口大小改变
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    // 主题切换时刷新粒子颜色，使其跟随 --accent
    if (this.config.followTheme && typeof MutationObserver !== 'undefined') {
      this._themeObserver = new MutationObserver(() => {
        this.config.particleColor = accentRGBA(0.42);
        this.config.lineColor = accentRGBA(0.16);
      });
      this._themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    if (this.config.interactive) {
      // 鼠标移动
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      // 鼠标离开
      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.particleColor;
      this.ctx.fill();
    });
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.lineDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.config.lineColor;
          this.ctx.lineWidth = 1;
          this.ctx.globalAlpha = 1 - distance / this.config.lineDistance;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // 移动粒子
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界反弹
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx = -particle.vx;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy = -particle.vy;
      }

      // 鼠标交互
      if (this.config.interactive && this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
        }
      }
    });
  }

  animate() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 更新粒子
    this.updateParticles();

    // 绘制粒子
    this.drawParticles();

    // 绘制连线
    this.drawLines();

    // 继续动画
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._themeObserver) {
      this._themeObserver.disconnect();
      this._themeObserver = null;
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  toggle(enabled) {
    if (enabled && !this.canvas) {
      this.init();
    } else if (!enabled && this.canvas) {
      this.destroy();
    }
  }
}

// =====================
// 初始化
// =====================

let particlesInstance = null;

function initParticles(options = {}) {
  // 移动端默认禁用（性能考虑）
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

  // 检查用户偏好
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 默认配置
  const defaultOptions = {
    enabled: !isMobile && !prefersReducedMotion,
    particleCount: isMobile ? 30 : 80,
    speed: 0.3,
    interactive: !isMobile
  };

  const finalOptions = { ...defaultOptions, ...options };

  if (finalOptions.enabled) {
    particlesInstance = new ParticlesBackground(finalOptions);
  }
}

// 自动初始化（可通过设置 data-particles="false" 禁用）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const shouldInit = document.body.dataset.particles !== 'false';
    if (shouldInit) {
      initParticles();
    }
  });
} else {
  const shouldInit = document.body.dataset.particles !== 'false';
  if (shouldInit) {
    initParticles();
  }
}

// 导出
if (typeof window !== 'undefined') {
  window.ParticlesBackground = ParticlesBackground;
  window.initParticles = initParticles;
  window.particlesInstance = particlesInstance;
}
