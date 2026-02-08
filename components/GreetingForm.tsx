import { useState } from 'react';

export interface GreetingFormData {
  target: string;
  style: string;
  length: 'short' | 'medium' | 'long';
  signature: string;
}

interface GreetingFormProps {
  onGenerate: (data: GreetingFormData) => void;
  loading: boolean;
}

export default function GreetingForm({ onGenerate, loading }: GreetingFormProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [formData, setFormData] = useState<GreetingFormData>({
    target: '爸妈',
    style: '喜庆温暖',
    length: 'medium',
    signature: '',
  });

  const handleGenerate = () => {
    onGenerate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 主按钮 */}
      <div className="text-center mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              正在为你写祝福...
            </span>
          ) : (
            '一键生成贺词'
          )}
        </button>
      </div>

      {/* 可选项（折叠） */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-gray-600 text-sm underline"
        >
          {showOptions ? '收起选项' : '自定义选项（可选）'}
        </button>
      </div>

      {showOptions && (
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
          {/* 祝福对象 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              祝福对象
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['爸妈', '亲友', '同事', '客户', '老师', '长辈'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, target: option })}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.target === option
                      ? 'bg-spring-red text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 风格 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              风格
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['喜庆温暖', '文雅大气', '幽默风趣', '简短精炼', '四字成语'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, style: option })}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.style === option
                      ? 'bg-spring-red text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 长度 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              长度
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'short', label: '短（30-40字）' },
                { value: 'medium', label: '中（60-90字）' },
                { value: 'long', label: '长（100-150字）' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      length: option.value as 'short' | 'medium' | 'long',
                    })
                  }
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.length === option.value
                      ? 'bg-spring-red text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 署名 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              你的名字（选填）
            </label>
            <input
              type="text"
              value={formData.signature}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
              placeholder="如：小明"
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-spring-red focus:outline-none text-lg"
              maxLength={10}
            />
            <p className="text-sm text-gray-500 mt-2">
              留空则不显示署名
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
