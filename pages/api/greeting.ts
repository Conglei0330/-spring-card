import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGreeting, type GenerateGreetingParams } from '@/lib/bailian';
import { checkRateLimit } from '@/lib/rate-limit';
import { withAuth } from '@/lib/auth';

// 使用认证中间件
export default withAuth(async function handler(
  req: NextApiRequest & { user: any },
  res: NextApiResponse
) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '请使用 POST 方法' });
  }

  try {
    // 获取客户端 IP（用于限流）
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                req.socket.remoteAddress ||
                req?.user?.userId || // 如果使用用户ID限流，可以用 userId 替代 IP
                'unknown';

    // 限流检查（可以改为基于用户ID限流）
    const rateLimitGreeting = parseInt(process.env.RATE_LIMIT_GREETING || '10', 10);
    const rateLimit = checkRateLimit(`greeting:${ip}`, rateLimitGreeting);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: '生成次数过多，请稍后再试',
        resetAt: rateLimit.resetAt,
      });
    }

    // 解析请求参数
    const {
      target = '爸妈',
      style = '喜庆温暖',
      length = 'medium',
      signature = '',
    } = req.body;

    // 参数验证
    if (!['short', 'medium', 'long'].includes(length)) {
      return res.status(400).json({ error: '长度参数不正确' });
    }

    // 调用百炼生成贺词
    const params: GenerateGreetingParams = {
      target,
      style,
      length: length as 'short' | 'medium' | 'long',
      signature: signature || undefined,
    };

    const result = await generateGreeting(params);

    // 返回成功结果
    return res.status(200).json({
      success: true,
      data: result,
      remaining: rateLimit.remaining,
      userId: req.user.userId, // 返回当前用户ID
    });
  } catch (error: any) {
    console.error('贺词生成 API 错误:', error);

    // 返回错误信息
    return res.status(500).json({
      success: false,
      error: error.message || '生成失败，请稍后再试',
    });
  }
});
