// =====================
// 主题切换功能
// =====================

class ThemeManager {
  constructor() {
    this.themeToggleBtn = null;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // 应用保存的主题
    this.applyTheme(this.currentTheme);

    // 创建主题切换按钮
    this.createToggleButton();

    // 监听系统主题变化
    this.watchSystemTheme();
  }

  createToggleButton() {
    // 检查是否已存在按钮
    if (document.querySelector('.theme-toggle')) return;

    const button = document.createElement('button');
    button.className = 'theme-toggle ripple';
    button.setAttribute('aria-label', '切换主题');
    button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';

    button.addEventListener('click', () => this.toggleTheme());

    document.body.appendChild(button);
    this.themeToggleBtn = button;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);

    // 更新按钮图标
    if (this.themeToggleBtn) {
      this.themeToggleBtn.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  watchSystemTheme() {
    // 如果用户没有手动选择主题，跟随系统主题
    if (!localStorage.getItem('theme')) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e) => {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        if (this.themeToggleBtn) {
          this.themeToggleBtn.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
      };

      mediaQuery.addEventListener('change', handleChange);

      // 初始检查
      if (mediaQuery.matches) {
        this.currentTheme = 'dark';
        this.applyTheme(this.currentTheme);
        if (this.themeToggleBtn) {
          this.themeToggleBtn.innerHTML = '☀️';
        }
      }
    }
  }
}

// 导出单例
const themeManager = new ThemeManager();

// 如果在浏览器环境，自动初始化
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
  window.themeManager = themeManager;
}
