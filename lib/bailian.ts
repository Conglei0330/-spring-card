import OpenAI from 'openai';

let bailianClient: OpenAI | null = null;

/**
 * 获取百炼客户端（单例）
 */
export function getBailianClient(): OpenAI {
  if (!bailianClient) {
    const apiKey = process.env.DASHSCOPE_API_KEY;

    if (!apiKey) {
      throw new Error('DASHSCOPE_API_KEY 未配置，请检查环境变量');
    }

    bailianClient = new OpenAI({
      apiKey,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  return bailianClient;
}

/**
 * 生成贺词
 */
export interface GenerateGreetingParams {
  target: string;
  style: string;
  length: 'short' | 'medium' | 'long';
  signature?: string;
}

export interface GreetingResult {
  text: string;
  alt: string[];
  short: string;
}

export async function generateGreeting(
  params: GenerateGreetingParams
): Promise<GreetingResult> {
  const { target, style, length, signature } = params;

  const lengthMap = {
    short: '30~40字',
    medium: '60~90字',
    long: '100~150字',
  };

  // 添加随机元素确保每次不重复
  const randomElement = ['瑞雪', '祥云', '春风', '金龙', '紫气', '福星'][Math.floor(Math.random() * 6)];
  const randomId = Math.random().toString(36).substring(7);

  const systemPrompt = `你是一位擅长新春祝福文案的中文文案师，面向长辈阅读。用词喜庆、健康、平安、团圆，避免生僻词与网络梗。避免夸张低俗与迷信。确保与"马年"相关，至少包含一个与"马"有关的吉祥意象或成语（如马到成功、一马当先、龙马精神等），但不要堆砌。

编号：${randomId}（用于确保每次生成不同内容）`;

  const userPrompt = `生成马年新春贺词（编号：${randomId}）：
- 对象：${target}
- 风格：${style}
- 长度：${lengthMap[length]}
- 随机元素：${randomElement}
${signature ? `- 署名：${signature}` : ''}

要求：每次生成都必须独一无二，使用不同的句式、比喻和祝福角度。避免重复使用相同的句式开篇或结尾语。

输出 JSON，字段：
- text（主贺词，${signature ? '末尾加"—— [署名]"' : '不含署名'}）
- alt（3条风格各异的备选贺词，确保3条之间也不重复）
- short（1条20字以内短句，用于卡片标题）`;

  try {
    const client = getBailianClient();
    const completion = await client.chat.completions.create({
      model: 'qwen-max',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9, // 增加随机性
      top_p: 0.9,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('百炼返回内容为空');
    }

    const result = JSON.parse(content);

    // 验证返回格式
    if (!result.text || !result.alt || !result.short) {
      throw new Error('百炼返回格式不正确');
    }

    return {
      text: result.text,
      alt: Array.isArray(result.alt) ? result.alt : [],
      short: result.short,
    };
  } catch (error: any) {
    console.error('百炼贺词生成失败:', error);
    throw new Error(`贺词生成失败: ${error.message}`);
  }
}

/**
 * 生成贺卡背景图（9:16，不含文字）
 */
export interface GenerateCardBackgroundParams {
  style?: 'default' | 'ink' | 'paper-cut' | 'lantern' | 'modern';
}

export async function generateCardBackground(
  params: GenerateCardBackgroundParams = {}
): Promise<string> {
  const { style = 'default' } = params;

  // 根据风格调整 Prompt (简化提示词以提高生成速度)
  const stylePrompts: Record<string, string> = {
    default: '红金配色、祥云、灯笼、烟花、剪纸风骏马或金色骏马剪影',
    'paper-cut': '剪纸艺术风格，红色底、金色骏马剪影，祥云镂空',
    ink: '水墨画风格，淡金色底、墨色骏马、飘逸笔触',
    lantern: '宫灯元素为主，红色灯笼串、金色流苏、骏马图案',
    modern: '现代简约风格，渐变红金背景、简洁骏马线条、几何装饰',
  };

  const prompt = `马年新春贺卡背景图，9:16竖版。${stylePrompts[style]}。国风插画风格，喜庆典雅。无文字无数字。`;

  try {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      throw new Error('DASHSCOPE_API_KEY 未配置');
    }

    console.log('开始生成图片...');

    // 使用原生 HTTP 请求调用百炼通义万相 API（异步模式）
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable', // 开启异步模式
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: prompt,
        },
        parameters: {
          size: '720*1280',
          n: 1,
          seed: Math.floor(Math.random() * 4294967290), // 使用随机种子确保每次生成不同
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('百炼 API 错误响应:', response.status, errorText);
      throw new Error(`百炼 API 返回 ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('百炼 API 响应:', JSON.stringify(result, null, 2));

    // 异步模式：获取任务 ID 并轮询
    if (result.output?.task_id) {
      const taskId = result.output.task_id;
      console.log('图片生成任务已提交，任务ID:', taskId);

      // 轮询获取结果（最多等待 60 秒）
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 每 2 秒查询一次

        const taskResponse = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!taskResponse.ok) {
          console.log(`任务查询失败 (${i + 1}/30)，继续重试...`);
          continue;
        }

        const taskResult = await taskResponse.json();
        console.log(`任务状态 (${i + 1}/30):`, taskResult.output?.task_status);

        // 任务完成
        if (taskResult.output?.task_status === 'SUCCEEDED') {
          const imageUrl = taskResult.output?.results?.[0]?.url;
          if (!imageUrl) {
            throw new Error('百炼未返回图片 URL');
          }
          console.log('图片生成成功:', imageUrl);
          return imageUrl;
        }

        // 任务失败
        if (taskResult.output?.task_status === 'FAILED') {
          const code = taskResult.code || 'UNKNOWN';
          const message = taskResult.message || '未知错误';
          throw new Error(`图片生成失败 (${code}): ${message}`);
        }

        // 超时时间过长或任务被取消
        if (taskResult.output?.task_status === 'TIMEOUT' || taskResult.output?.task_status === 'CANCELED') {
          throw new Error(`图片生成${taskResult.output?.task_status === 'TIMEOUT' ? '超时' : '被取消'}`);
        }

        // 继续等待
      }

      throw new Error('图片生成超时（60秒），请稍后重试');
    }

    // 如果响应中没有 task_id，可能是直接返回了结果
    const imageUrl = result.output?.results?.[0]?.url;
    if (imageUrl) {
      console.log('图片生成成功（直接返回）:', imageUrl);
      return imageUrl;
    }

    throw new Error('百炼 API 未返回图片 URL 或任务 ID');
  } catch (error: any) {
    console.error('百炼图片生成失败:', error);

    // 检查常见的错误类型
    if (error.message.includes('AccessDenied')) {
      throw new Error('API 权限不足，请检查 API Key 是否支持图片生成功能');
    }
    if (error.message.includes('QuotaExceeded')) {
      throw new Error('API 配额已用完，请充值或升级套餐');
    }

    throw new Error(`图片生成失败: ${error.message}`);
  }
}
