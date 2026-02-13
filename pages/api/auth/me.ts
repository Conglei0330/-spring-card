import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { findUser } from '@/lib/user-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const payload = await getCurrentUserFromRequest(req);

    if (!payload) {
      return res.status(200).json({ success: false, data: null });
    }

    const user = findUser(payload.phone);

    if (!user) {
      return res.status(200).json({ success: false, data: null });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    return res.status(200).json({ success: false, data: null });
  }
}
