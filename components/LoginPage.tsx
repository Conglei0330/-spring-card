'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取重定向地址
  const redirect = (router.query.redirect as string) || '/';

  const validatePhone = (value: string) => {
    return /^1[3-9]\d{9}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 前端验证
    if (!validatePhone(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    setLoading(true);

    try {
      await login(phone);

      // 登录成功，跳转到目标页面
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-newchinese flex items-center justify-center px-4 py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-gold"
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-liquid-gold/20">
          {/* 标题 */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-ink-black font-serif mb-2">
              登录账号
            </h1>
            <p className="text-ink-black/60 text-sm md:text-base">
              输入手机号即可开始您的创意之旅
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* 手机号 */}
            <div>
              <label className="block text-ink-black font-medium mb-2 text-sm md:text-base">
                手机号
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-imperial-red focus:outline-none transition-colors text-base text-center text-lg font-medium"
                maxLength={11}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                中国大陆手机号 +86，新用户将自动注册
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading || phone.length !== 11}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
