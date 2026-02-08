/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 策马新春主题色彩系统
        'imperial-red': '#D32F2F',   // 御红 - 主色调
        'liquid-gold': '#FFD700',    // 鎏金 - 辅助色
        'rice-paper': '#FFFBF2',     // 宣纸白 - 背景色
        'ink-black': '#1A1A1A',      // 水墨黑 - 文字主色
        // 兼容旧的类名
        'spring-red': '#D32F2F',
        'spring-gold': '#FFD700',
        'spring-bg': '#FFFBF2',
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', '"STSong"', 'serif'],
        'sans': ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        'kaiti': ['"Noto Serif SC"', '"STKaiti"', 'KaiTi', 'serif'],
        'song': ['"Noto Serif SC"', '"STSong"', 'SimSun', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-newchinese': 'linear-gradient(135deg, #FFFBF2 0%, #FFF8E7 50%, #FFFBF2 100%)',
        'fluid-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        'imperial-gradient': 'linear-gradient(135deg, #D32F2F 0%, #FFD700 100%)',
      },
    },
  },
  plugins: [],
}
