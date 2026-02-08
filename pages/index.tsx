import Head from 'next/head';
import Header from '@/components/Header';
import HomeCards from '@/components/HomeCards';

export default function Home() {
  return (
    <>
      <Head>
        <title>策马新春 - AI 智能祝福与运势预测</title>
        <meta name="description" content="策马新春贺卡生成器，AI 智能助手一键生成祝福语和贺卡，马年运势预测。新中式风格，鎏金设计，流体智慧。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-gradient-newchinese">
        {/* 顶部标题 -策马新春主题 */}
        <Header />

        {/* 功能选择卡片 */}
        <HomeCards />

        {/* 页脚 */}
        <footer className="text-center py-8 relative z-10">
          <p className="text-ink-black/60 font-sans">策马新春 · 由 AI 驱动</p>
          <p className="mt-2 text-ink-black/50 text-sm font-sans">© 2026 · 预祝您马到成功，新春大吉</p>
        </footer>
      </div>
    </>
  );
}
