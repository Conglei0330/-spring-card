import jwt from 'jsonwebtoken';
import { DEFAULT_AVATAR } from './default-avatar';

// 重新导出 DEFAULT_AVATAR
export { DEFAULT_AVATAR };

const JWT_SECRET = process.env.JWT_SECRET || 'secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  phone: string;
}

// 中国大陆手机号验证
export function validatePhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

// 密码强度验证（6-20位，至少包含字母和数字）
export function validatePassword(password: string): boolean {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasValidLength = password.length >= 6 && password.length <= 20;

  return hasLetter && hasNumber && hasValidLength;
}

// 生成 JWT Token
export function generateToken(payload: JWTPayload): string {
  // jsonwebtoken 的 sign 方法支持 expiresIn 选项
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
}

// 验证 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// 从请求对象获取 Token
export function getTokenFromRequest(req: any): string | null {
  return req.cookies?.auth_token || null;
}

// 设置 Cookie（用于 API 路由响应）
export function setAuthCookie(res: any, token: string) {
  res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

// 清除 Cookie
export function clearAuthCookie(res: any) {
  res.setHeader('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=lax');
}

// 获取当前登录用户（从请求对象）
export async function getCurrentUserFromRequest(req: any): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

// API 路由认证中间件
export function withAuth(handler: Function) {
  return async (req: any, res: any) => {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ error: '未登录，请先登录', needLogin: true });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: '登录已过期，请重新登录', needLogin: true });
    }

    req.user = payload;
    return handler(req, res);
  };
}
