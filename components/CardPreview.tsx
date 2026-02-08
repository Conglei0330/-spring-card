import { useState, useEffect } from 'react';
import type { GreetingData } from './GreetingResult';

interface CardPreviewProps {
  greeting: GreetingData;
  backgroundUrl: string;
  signature?: string;
  onRegenerate: () => void;
}

export default function CardPreview({
  greeting,
  backgroundUrl,
  signature,
  onRegenerate,
}: CardPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);

  // 图片加载完成
  const handleImageLoad = () => {
    setLoading(false);
  };

  // 当背景图变化时重新加载
  useEffect(() => {
    setLoading(true);
  }, [backgroundUrl]);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-8">
      {/* 祝福语展示 */}
      <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl p-6 shadow-lg mb-6 border-2 border-red-100">
        <h3 className="text-xl font-bold text-center text-spring-red mb-4 font-serif">
          ✨ 新春祝福语
        </h3>
        {greeting.short && (
          <div className="text-center text-lg font-bold text-red-600 mb-4">
            「{greeting.short}」
          </div>
        )}
        <div className="text-gray-800 leading-relaxed text-center whitespace-pre-wrap text-lg">
          {greeting.text}
        </div>
        {signature && (
          <div className="text-right text-gray-600 mt-4">
            —— {signature}
          </div>
        )}
      </div>

      {/* 背景图片展示 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-center text-spring-red mb-6 font-kaiti">
          🎨 贺卡背景
        </h3>

        {/* 加载中 */}
        {loading && (
          <div className="aspect-[9/16] bg-gradient-to-br from-red-100 to-yellow-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-bounce">🎨</div>
              <p className="text-gray-600">正在图片中...</p>
              <p className="text-sm text-gray-500 mt-2">AI生成需要10-20秒，请耐心等待</p>
            </div>
          </div>
        )}

        {/* 图片预览 */}
        {!loading && (
          <div>
            <div
              className="relative cursor-pointer group"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={backgroundUrl}
                alt="马年贺卡背景"
                className="w-full rounded-xl shadow-md group-hover:shadow-xl transition-shadow"
                onLoad={handleImageLoad}
                onError={() => setLoading(false)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-xl flex items-center justify-center">
                <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  点击查看大图
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              💡 长按图片可保存到相册
            </p>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = backgroundUrl;
                  link.download = `马年贺卡背景-${Date.now()}.png`;
                  link.click();
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                💾 保存图片
              </button>
              <button
                onClick={onRegenerate}
                disabled={loading}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 换一张
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 全屏查看 */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={backgroundUrl}
            alt="马年贺卡背景"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={() => setShowFullImage(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
