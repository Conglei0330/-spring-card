import { useState, useRef, useEffect } from 'react';

export interface UserInfo {
  name: string;
  gender: string;
  birthDate: string;
  zodiac: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userInfo: UserInfo;
}

export default function ChatInterface({ userInfo }: ChatInterfaceProps) {
  const initialMessage = `您好，${userInfo.name}！我是您的运势助手。🎊\n\n根据您提供的信息：\n• 性别：${userInfo.gender === 'male' ? '男' : '女'}\n• 出生日期：${userInfo.birthDate}\n• 属相：${userInfo.zodiac || '系统推算中'}\n\n我可以帮您：\n• 📜 分析马年整体运势\n• 💰 预测事业财运发展\n• ❤️ 了解爱情婚姻运势\n• 🏥 关注健康状况\n• 🌟 提供开运建议\n\n请问您想了解哪方面的运势呢？`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 构建包含用户信息的消息
    const userContextMessage = `用户信息：姓名${userInfo.name}，性别${userInfo.gender === 'male' ? '男' : '女'}，出生日期${userInfo.birthDate}，属相${userInfo.zodiac || '马年'}。\n\n用户问题：${inputValue.trim()}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContextMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userContextMessage,
          userInfo,
          history: messages.slice(1).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '网络错误');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      alert(error.message || '发送失败，请稍后重试');
      setMessages(prev => [...prev.slice(0, -1)]); // 移除用户消息
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden h-[calc(100vh-200px)] min-h-[600px] flex flex-col border border-liquid-gold/20">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold">🔮 马年运势对话</h2>
        <p className="text-sm text-white/80 mt-1">与AI运势助手实时交流</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} userInfo={userInfo} />
        ))}
        {isLoading && <LoadingBubble />}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题...（按 Enter 发送）"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400 transition-colors"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            发送
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          💡 提示：您可以问我关于事业、财运、爱情、健康等方面的运势问题
        </p>
      </div>
    </div>
  );
}

// 消息气泡组件
interface MessageBubbleProps {
  message: Message;
  userInfo: UserInfo;
}

function MessageBubble({ message, userInfo }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-4 ${
          isUser
            ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white'
            : 'bg-gradient-to-br from-red-50 to-yellow-50 text-gray-800 border border-red-100'
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-red-200' : 'text-gray-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

// 加载动画组件
function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl px-5 py-4 border border-red-100">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
