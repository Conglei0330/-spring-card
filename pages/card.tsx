import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import GreetingForm, { type GreetingFormData } from '@/components/GreetingForm';
import GreetingResult, { type GreetingData } from '@/components/GreetingResult';
import CardPreview from '@/components/CardPreview';

export default function CardPage() {
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [cardBackground, setCardBackground] = useState<string | null>(null);
  const [formData, setFormData] = useState<GreetingFormData | null>(null);

  const [greetingLoading, setGreetingLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  // 生成贺词
  const handleGenerateGreeting = async (data: GreetingFormData) => {
    setGreetingLoading(true);
    setFormData(data);

    try {
      const response = await fetch('/api/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '生成失败');
      }

      setGreeting(result.data);

      // 滚动到结果区域
      setTimeout(() => {
        document.getElementById('greeting-result')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error: any) {
      alert(error.message || '网络有点忙，请稍后再试');
    } finally {
      setGreetingLoading(false);
    }
  };

  // 重新生成贺词
  const handleRegenerateGreeting = () => {
    if (formData) {
      handleGenerateGreeting(formData);
    }
  };

  // 生成贺卡背景图
  const handleGenerateCard = async () => {
    setCardLoading(true);

    try {
      const response = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: 'default' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '图片生成失败');
      }

      setCardBackground(result.data.imageUrl);

      // 滚动到图片预览区域
      setTimeout(() => {
        document.getElementById('card-preview')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error: any) {
      alert(error.message || '图片生成失败，请稍后再试');
    } finally {
      setCardLoading(false);
    }
  };

  // 重新生成贺卡
  const handleRegenerateCard = async () => {
    setCardBackground(null);
    await handleGenerateCard();
  };

  return (
    <>
      <Head>
        <title>写贺词和生成图片 - 马年新春贺卡</title>
        <meta name="description" content="马年新春贺卡生成器，使用 AI 一键生成祝福语和 9:16 竖版贺卡长图，适合发送给长辈、亲友、同事。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-spring-bg pb-32">
        {/* 返回首页按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-spring-red"
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

        {/* 顶部标题 */}
        <Header />

        {/* 生成表单 */}
        <GreetingForm
          onGenerate={handleGenerateGreeting}
          loading={greetingLoading}
        />

        {/* 贺词结果 */}
        {greeting && (
          <div id="greeting-result">
            <GreetingResult
              greeting={greeting}
              onGenerateCard={handleGenerateCard}
              onRegenerate={handleRegenerateGreeting}
              cardLoading={cardLoading}
            />
          </div>
        )}

        {/* 贺卡预览 */}
        {cardBackground && greeting && (
          <div id="card-preview" className="mt-8">
            <CardPreview
              greeting={greeting}
              backgroundUrl={cardBackground}
              signature={formData?.signature}
              onRegenerate={handleRegenerateCard}
            />
          </div>
        )}

        {/* 页脚 */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>马年新春贺卡 · 由 AI 驱动</p>
          <p className="mt-2">© 2026 · 祝您马到成功，新年快乐！</p>
        </footer>
      </div>
    </>
  );
}
