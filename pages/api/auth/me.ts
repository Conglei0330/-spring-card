import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const payload = await getCurrentUserFromRequest(req);

    if (!payload) {
      return res.status(200).json({ success: false, data: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
      },
    });

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    return res.status(200).json({ success: false, data: null });
  }
}
