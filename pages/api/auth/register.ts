import type { NextApiRequest, NextApiResponse } from 'next';
import { findOrCreateUser, findUser } from '@/lib/user-store';
import { validatePhone, validatePassword, generateToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { phone, password } = req.body;

    // 参数验证
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: '手机号格式不正确' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: '密码需6-20位，且包含字母和数字' });
    }

    // 检查用户是否已存在
    const existingUser = findUser(phone);

    if (existingUser) {
      return res.status(400).json({ error: '该手机号已注册' });
    }

    // 创建用户（简化版，不存储密码）
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
    console.error('注册错误:', error);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
}
