import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';

interface FortuneRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userInfo?: {
    name: string;
    gender: string;
    birthDate: string;
    zodiac: string;
  };
}

interface FortuneResponse {
  success: boolean;
  data?: {
    reply: string;
  };
  error?: string;
}

// 使用认证中间件
export default withAuth(async function handler(
  req: NextApiRequest & { user: any },
  res: NextApiResponse<FortuneResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '方法不允许' });
  }

  try {
    const { message, history = [], userInfo } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: '消息不能为空' });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'API Key 未配置' });
    }

    // 构建系统提示词，包含运势分析的专业定位
    let systemPrompt = '你是一位专业的运势预测大师，精通八字、面相、风水、紫微斗数等传统命理知识。你的回答应该：\n\n1. 积极正面，给人鼓励和希望\n2. 科学理性，避免封建迷信\n3. 结合现代生活实际，给出实用建议\n4. 关注"马年"这个特定年份\n5. 可以涉及事业、财运、爱情、健康、学业等多个方面\n\n当用户询问运势时，应该给出：\n- 整体运势概述\n- 具体领域的分析和建议\n- 开运小贴士\n- 温馨提示\n\n注意：避免过于负面或恐怖的预言，始终传递正能量。';

    // 如果有用户信息，添加到系统提示词中
    if (userInfo) {
      systemPrompt += `\n\n用户基本信息：\n- 姓名：${userInfo.name}\n- 性别：${userInfo.gender === 'male' ? '男' : '女'}\n- 出生日期：${userInfo.birthDate}\n- 属相：${userInfo.zodiac || '系统推算中'}

请根据这些基本信息，为用户提供更精准的运势分析和建议。`;
    }

    // 构建消息历史
    type Message = { role: 'system' | 'user' | 'assistant'; content: string };
    const messages: Message[] = history.length > 0
      ? history
      : [ { role: 'system', content: systemPrompt } ];

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: message,
    });

    // 调用百炼 API（兼容模式）
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-max', // 使用 qwen-max 模型
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('百炼 API 错误:', response.status, errorText);
      return res.status(response.status).json({
        success: false,
        error: `API 调用失败: ${response.status}`,
      });
    }

    const result = await response.json();
    const assistantMessage = result.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ success: false, error: '未收到回复' });
    }

    return res.status(200).json({
      success: true,
      data: {
        reply: assistantMessage,
      },
    });
  } catch (error: any) {
    console.error('运势预测错误:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '服务器错误',
    });
  }
});
