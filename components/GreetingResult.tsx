import { useState } from 'react';

export interface GreetingData {
  text: string;
  short: string;
  alt: string[];
}

interface GreetingResultProps {
  greeting: GreetingData;
  onGenerateCard: () => void;
  onRegenerate: () => void;
  cardLoading: boolean;
}

export default function GreetingResult({
  greeting,
  onGenerateCard,
  onRegenerate,
  cardLoading,
}: GreetingResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(greeting.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('复制失败，请手动选择文字复制');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-32">
      {/* 贺词卡片 */}
      <div className="greeting-card animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-spring-red font-kaiti">
            {greeting.short}
          </h2>
        </div>

        <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-song">
          {greeting.text}
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            {copied ? '✓ 已复制' : '📋 复制贺词'}
          </button>
          <button
            onClick={onRegenerate}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            🔄 换一条
          </button>
        </div>
      </div>

      {/* 备选贺词（可选，折叠显示） */}
      {greeting.alt && greeting.alt.length > 0 && (
        <details className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <summary className="cursor-pointer text-gray-600 font-medium">
            查看其他备选（{greeting.alt.length} 条）
          </summary>
          <div className="mt-4 space-y-3">
            {greeting.alt.map((text, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed"
              >
                {text}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* 吸底按钮：生成图片 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onGenerateCard}
            disabled={cardLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cardLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                正在生成贺卡（约10-20秒）...
              </span>
            ) : (
              '🎨 生成贺卡长图（9:16）'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
