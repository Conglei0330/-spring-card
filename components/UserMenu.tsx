'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative">
      {/* 用户头像按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
      >
        {/* 头像 */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-imperial-red to-liquid-gold flex items-center justify-center text-white text-sm md:text-base font-bold">
          {user.nickname?.[0] || user.phone[0]}
        </div>

        {/* 用户名（仅在大屏显示） */}
        <span className="text-white text-sm md:text-base font-medium hidden sm:block">
          {user.nickname || `用户${user.phone.slice(-4)}`}
        </span>

        {/* 下拉箭头 */}
        <svg
          className={`w-3 h-3 md:w-4 md:h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 菜单内容 */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
            {/* 用户信息 */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-ink-black truncate">{user.nickname}</p>
              <p className="text-xs text-ink-black/60">{user.phone}</p>
            </div>

            {/* 菜单项 */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/profile');
                }}
                className="w-full px-4 py-2 text-left text-sm text-ink-black/70 hover:bg-gray-50 hover:text-ink-black transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人设置
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
