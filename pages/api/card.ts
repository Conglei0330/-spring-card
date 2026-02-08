import type { NextApiRequest, NextApiResponse } from 'next';
import { generateCardBackground, type GenerateCardBackgroundParams } from '@/lib/bailian';
import { downloadAndUploadToOSS } from '@/lib/oss';
import { checkRateLimit } from '@/lib/rate-limit';
import { v4 as uuidv4 } from 'uuid';
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
                req?.user?.userId || 'unknown';

    // 限流检查（图片生成限制更严格）
    const rateLimitImage = parseInt(process.env.RATE_LIMIT_IMAGE || '3', 10);
    const rateLimit = checkRateLimit(`card:${ip}`, rateLimitImage);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: '生成次数过多，请稍后再试',
        resetAt: rateLimit.resetAt,
      });
    }

    // 解析请求参数
    const { style = 'default' } = req.body;

    // 参数验证
    const validStyles = ['default', 'ink', 'paper-cut', 'lantern', 'modern'];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ error: '风格参数不正确' });
    }

    // 调用百炼生成背景图
    const params: GenerateCardBackgroundParams = { style };
    const tempImageUrl = await generateCardBackground(params);

    // 上传到 OSS（可选，如果不配置 OSS 则直接返回临时 URL）
    let finalImageUrl = tempImageUrl;

    if (process.env.OSS_BUCKET) {
      try {
        const fileName = `${uuidv4()}.png`;
        finalImageUrl = await downloadAndUploadToOSS(tempImageUrl, fileName);
      } catch (ossError) {
        console.warn('OSS 上传失败，使用临时 URL:', ossError);
        // 如果 OSS 上传失败，仍然返回临时 URL
      }
    }

    // 返回成功结果
    return res.status(200).json({
      success: true,
      data: {
        imageUrl: finalImageUrl,
        style,
      },
      remaining: rateLimit.remaining,
      userId: req.user.userId,
    });
  } catch (error: any) {
    console.error('图片生成 API 错误:', error);

    // 返回错误信息
    return res.status(500).json({
      success: false,
      error: error.message || '图片生成失败，请稍后再试',
    });
  }
});

// 配置：允许较长的响应时间（图片生成需要时间）
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
