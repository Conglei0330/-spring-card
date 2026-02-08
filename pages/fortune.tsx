import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import type { UserInfo } from '@/components/ChatInterface';
import ChatInterface from '@/components/ChatInterface';

export default function FortunePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  return (
    <>
      <Head>
        <title>算算运势 - 马年新春</title>
        <meta name="description" content="与 AI 智能体聊天，了解马年运势和新年吉凶" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-gradient-newchinese">
        {/* 返回首页按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-red-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">返回首页</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-20">
          {!userInfo ? (
            // 信息填写表单
            <div className="max-w-md mx-auto animate-slide-up">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-liquid-gold/20">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-spring-red mb-2 font-serif">
                  🔮 马年运势测算
                </h1>
                <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base">
                  填写您的基本信息，开启2026马年运势解读
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  setUserInfo({
                    name: formData.get('name') as string,
                    gender: formData.get('gender') as string,
                    birthDate: formData.get('birthDate') as string,
                    zodiac: formData.get('zodiac') as string,
                  });
                }} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      您的姓名
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="请输入姓名"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      性别
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          required
                          className="peer sr-only"
                        />
                        <div className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-red-500 peer-checked:bg-red-50">
                          👨 男
                        </div>
                      </label>
                      <label className="relative">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          required
                          className="peer sr-only"
                        />
                        <div className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-red-500 peer-checked:bg-red-50">
                          👩 女
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      出生日期
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      属相（可不填，系统会根据出生日期自动推算）
                    </label>
                    <select
                      name="zodiac"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base bg-white"
                    >
                      <option value="">自动推算</option>
                      <option value="鼠">🐭 鼠</option>
                      <option value="牛">🐮 牛</option>
                      <option value="虎">🐯 虎</option>
                      <option value="兔">🐰 兔</option>
                      <option value="龙">🐲 龙</option>
                      <option value="蛇">🐍 蛇</option>
                      <option value="马">🐴 马</option>
                      <option value="羊">🐑 羊</option>
                      <option value="猴">🐵 猴</option>
                      <option value="鸡">🐔 鸡</option>
                      <option value="狗">🐶 狗</option>
                      <option value="猪">🐷 猪</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    开始测算 ✨
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // 聊天界面
            <ChatInterface userInfo={userInfo} />
          )}
        </div>
      </div>
    </>
  );
}
