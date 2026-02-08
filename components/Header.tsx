'use client';

import { useAuth } from '@/lib/auth-context';
import UserMenu from '@/components/UserMenu';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-imperial-red via-red-600 to-liquid-gold py-16 px-4">
      {/* 背景纹理层 - 新中式纹样 */}
      <div className="bg-texture-layer">
        {/* 云纹 SVG */}
        <svg
          className="animate-cloud"
          style={{ top: '10%', left: '5%', width: '200px', height: '200px' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M40,60 Q50,40 70,50 Q80,35 95,45 Q105,30 120,45 Q130,35 145,50 Q160,40 170,60 Q180,55 175,70 Q170,85 155,85 Q145,90 130,80 Q120,95 105,85 Q95,90 80,80 Q65,90 50,85 Q35,85 30,70 Q25,55 40,60 Z"
                fill="rgba(255, 215, 0, 0.3)" />
        </svg>

        <svg
          className="animate-cloud"
          style={{ top: '20%', right: '10%', width: '150px', height: '150px', animationDelay: '1s' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M40,60 Q50,40 70,50 Q80,35 95,45 Q105,30 120,45 Q130,35 145,50 Q160,40 170,60 Q180,55 175,70 Q170,85 155,85 Q145,90 130,80 Q120,95 105,85 Q95,90 80,80 Q65,90 50,85 Q35,85 30,70 Q25,55 40,60 Z"
                fill="rgba(255, 215, 0, 0.25)" />
        </svg>

        {/* 印章 SVG */}
        <svg
          className="animate-seal"
          style={{ bottom: '15%', left: '8%', width: '100px', height: '100px' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          fill="none"
        >
          <rect x="10" y="10" width="100" height="100" rx="4"
                fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3" />
          <rect x="15" y="15" width="90" height="90" rx="2"
                fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
        </svg>

        <svg
          className="animate-seal"
          style={{ top: '30%', right: '5%', width: '80px', height: '80px', animationDelay: '2s' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          fill="none"
        >
          <rect x="10" y="10" width="100" height="100" rx="4"
                fill="none" stroke="rgba(255, 215, 0, 0.3)" stroke-width="3" />
        </svg>

        {/* 圆环 SVG */}
        <svg
          className="animate-ring"
          style={{ bottom: '10%', right: '15%', width: '120px', height: '120px' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="45" stroke="rgba(255, 215, 0, 0.3)" stroke-width="1.5" />
          <circle cx="50" cy="50" r="35" stroke="rgba(255, 215, 0, 0.2)" stroke-width="1" />
          <circle cx="50" cy="50" r="25" stroke="rgba(255, 215, 0, 0.3)" stroke-width="1.5" />
        </svg>
      </div>

      {/* 流体金属光泽装饰 */}
      <div className="absolute inset-0">
        <div
          className="animate-gold"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            width: '60%',
            height: '200px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.15), transparent)',
            transform: 'translateX(-50%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* 用户菜单（仅在登录后显示） */}
      {!loading && (
        <div className="absolute top-4 right-4 z-20">
          <UserMenu />
        </div>
      )}

      {/* 主标题 */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif tracking-wide animate-slide-up">
          策马新春
        </h1>
        <p className="text-xl md:text-2xl text-yellow-100 font-medium font-sans animate-slide-up" style={{ animationDelay: '0.2s' }}>
          AI 智能助手为您生成新春祝福
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-yellow-100 font-sans animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span className="text-base">✨ 鎏金设计 · 流体智慧 · 祈福迎春</span>
        </div>
      </div>

      {/* 底部波浪 - 新中式风格 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 fill-rice-paper"
        >
          <path
            d="M0,60 C150,60 300,0 450,30 C600,60 750,30 900,45 C1000,55 1100,30 1200,45 L1200,120 L0,120 Z"
            fill="rgba(255, 251, 242, 0.3)"
          />
          <path
            d="M0,90 C200,90 400,40 600,70 C800,100 1000,60 1200,80 L1200,120 L0,120 Z"
            fill="rgba(255, 251, 242, 0.6)"
          />
          <path
            d="M0,100 C150,100 300,70 500,90 C700,110 900,80 1200,100 L1200,120 L0,120 Z"
            fill="#FFFBF2"
          />
        </svg>
      </div>
    </header>
  );
}
