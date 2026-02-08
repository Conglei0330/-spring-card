'use client';

import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';

export default function HomeCards() {
  const router = useRouter();
  const { user } = useAuth();

  const cards = [
    {
      title: '生成贺卡',
      description: 'AI 一键生成新春祝福语与9:16竖版贺卡长图',
      subtitle: '智能创作 · 极简设计',
      icon: '🎨',
      color: 'from-imperial-red to-liquid-gold',
      link: '/card',
    },
    {
      title: '运势预测',
      description: '与 AI 智能体对话，解析马年运势与新年吉凶',
      subtitle: '专业解读 · 科学理性',
      icon: '🔮',
      color: 'from-liquid-gold to-orange-600',
      link: '/fortune',
    },
  ];

  const handleCardClick = (link: string, needAuth: boolean) => {
    if (needAuth && !user) {
      // 未登录，跳转到登录页，带上重定向参数
      router.push(`/login?redirect=${encodeURIComponent(link)}`);
      return;
    }

    // 已登录或无需登录，直接跳转
    router.push(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-gold"
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="animate-gold"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(211, 47, 47, 0.08) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '1.5s',
          }}
        />
      </div>

      {/* 卡片网格 */}
      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        {cards.map((card, index) => (
          <div
            key={card.link}
            onClick={() => handleCardClick(card.link, true)}
            role="button"
            tabIndex={0}
            className="group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div
              className={`
                relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br ${card.color}
                p-8 transition-all duration-500 transform
                group-hover:scale-105 group-hover:shadow-2xl
                group-hover:shadow-amber-500/20
              `}
            >
              {/* 背景纹理 */}
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />

              {/* 装饰纹样 */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg
                  className="animate-ring"
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" />
                  <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" />
                </svg>
              </div>

              {/* 主内容 */}
              <div className="relative z-10">
                {/* 图标 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-6xl animate-float">{card.icon}</div>
                </div>

                {/* 标题 */}
                <h2 className="text-3xl font-bold text-white mb-3 font-serif tracking-wide">
                  {card.title}
                </h2>

                {/* 副标题 */}
                <p className="text-yellow-100 text-sm font-sans mb-4 opacity-90">
                  {card.subtitle}
                </p>

                {/* 描述 */}
                <p className="text-white/90 leading-relaxed font-sans mb-6">
                  {card.description}
                </p>

                {/* 开始按钮 */}
                <div
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm
                    rounded-full text-white font-medium
                    transition-all duration-300
                    group-hover:bg-white/30 group-hover:translate-x-2
                  `}
                >
                  <span>开始体验</span>
                  <svg
                    className="w-5 h-5 animate-pulse-slow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* 底部流光效果 */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-ink-black/70 text-sm font-sans animate-fade-in" style={{ animationDelay: '0.6s' }}>
          ✨ 策马新春 · 双功能并行 · 恭候体验
        </p>
      </div>
    </div>
  );
}
