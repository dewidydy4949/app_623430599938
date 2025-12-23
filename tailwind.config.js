

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深色疗愈配色 - 保护弱光环境下的视力
        primary: '#6366F1',      // 靛蓝色（主色）- 平静舒缓
        secondary: '#8B5CF6',    // 紫色（辅助色）- 放松身心
        tertiary: '#EC4899',     // 粉紫色 - 温柔安抚
        accent: '#06B6D4',       // 青色（强调色）- 清新宁静
        success: '#10B981',      // 绿色 - 平和自然
        danger: '#F43F5E',       // 红色 - 温和警示
        warning: '#F59E0B',      // 琥珀色 - 柔和提醒
        info: '#3B82F6',         // 蓝色 - 沉静信赖
        'text-primary': '#F8FAFC',    // 灰白色（主文字）- 柔和易读
        'text-secondary': '#CBD5E1',   // 中灰色（次要文字）- 低调优雅
        'text-tertiary': '#94A3B8',   // 深灰色（辅助文字）- 背景融合
        'bg-primary': '#0F172A',      // 深蓝黑色（主背景）- AMOLED友好
        'bg-secondary': '#1E293B',     // 深蓝色（次背景）- 层次分明
        'bg-tertiary': '#334155',     // 中深蓝色 - 界面元素
        'glass-bg': 'rgba(30, 41, 59, 0.7)',  // 深色毛玻璃背景
        'bg-accent': '#1E3A8A',       // 深靛蓝色（强调背景）
        'border-light': '#334155',    // 深蓝色边框
        'border-medium': '#475569',   // 中蓝色边框
        'card-bg': '#1E293B',          // 深蓝色卡片
        'gradient-start': '#1E3A8A',   // 渐变起始色（深靛蓝）
        'gradient-end': '#312E81'      // 渐变结束色（深紫色）
      },
      boxShadow: {
        // 简约的阴影 - 更柔和、更微妙
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'minimal': '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'glass': '1.5rem'  // 24px 毛玻璃圆角
      },
      fontFamily: {
        'rounded': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '20px',
      }
    }
  },
  plugins: [],
}

