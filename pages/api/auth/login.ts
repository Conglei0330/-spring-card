import type { NextApiRequest, NextApiResponse } from 'next';
import { findOrCreateUser } from '@/lib/user-store';
import { validatePhone, generateToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { phone } = req.body;

    // 参数验证
    if (!phone) {
      return res.status(400).json({ error: '手机号不能为空' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: '手机号格式不正确' });
    }

    // 查找或创建用户（使用内存存储）
    const user = findOrCreateUser(phone);

    // 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
    });

    // 设置 Cookie
    setAuthCookie(res, token);

    // 返回用户信息
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('登录错误:', error);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
}
