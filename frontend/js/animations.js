// =====================
// 页面加载动画
// =====================

class LoadingAnimation {
  constructor() {
    this.loader = null;
    this.init();
  }

  init() {
    // 创建加载器
    this.createLoader();

    // 页面加载完成后隐藏
    if (document.readyState === 'complete') {
      this.hide();
    } else {
      window.addEventListener('load', () => this.hide());
    }
  }

  createLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-logo">林宇航</div>
      <div class="loader-spinner"></div>
    `;

    document.body.prepend(loader);
    this.loader = loader;
  }

  hide() {
    setTimeout(() => {
      if (this.loader) {
        this.loader.classList.add('hidden');
        setTimeout(() => {
          this.loader.remove();
        }, 500);
      }
    }, 300);
  }
}

// =====================
// 滚动动画
// =====================

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // 使用 Intersection Observer 监听元素
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // 动画完成后停止观察（性能优化）
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // 观察所有需要动画的元素
    this.observeElements();

    // 页面动态加载内容时可能需要重新观察
    window.addEventListener('contentLoaded', () => this.observeElements());
  }

  observeElements() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => this.observer.observe(el));
  }
}

// =====================
// 返回顶部按钮
// =====================

class BackToTop {
  constructor() {
    this.button = null;
    this.init();
  }

  init() {
    this.createButton();
    this.attachListeners();
  }

  createButton() {
    // 检查是否已存在按钮
    if (document.querySelector('.back-to-top')) return;

    const button = document.createElement('button');
    button.className = 'back-to-top ripple';
    button.setAttribute('aria-label', '返回顶部');
    button.innerHTML = '↑';

    button.addEventListener('click', () => this.scrollToTop());

    document.body.appendChild(button);
    this.button = button;
  }

  attachListeners() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 300) {
        this.button?.classList.add('visible');
      } else {
        this.button?.classList.remove('visible');
      }

      lastScroll = currentScroll;
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// =====================
// 滚动进度条
// =====================

class ScrollProgress {
  constructor() {
    this.progressBar = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.attachListeners();
  }

  createProgressBar() {
    // 检查是否已存在进度条
    if (document.querySelector('.scroll-progress')) return;

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';

    document.body.appendChild(progress);
    this.progressBar = progress;
  }

  attachListeners() {
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;

      if (this.progressBar) {
        this.progressBar.style.width = `${scrolled}%`;
      }
    });
  }
}

// =====================
// 初始化所有动画
// =====================

function initAnimations() {
  // 检查用户是否偏好减少动画
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    new LoadingAnimation();
    new ScrollAnimations();
    new BackToTop();
    new ScrollProgress();
  } else {
    // 如果用户偏好减少动画，直接隐藏加载器
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// 导出
if (typeof window !== 'undefined') {
  window.ScrollAnimations = ScrollAnimations;
  window.BackToTop = BackToTop;
  window.ScrollProgress = ScrollProgress;
  window.initAnimations = initAnimations;
}
