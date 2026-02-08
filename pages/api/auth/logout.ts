import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  // 清除 Cookie
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    data: { message: '已退出登录' },
  });
}
