/**
 * 简单的内存限流器（生产环境建议用 Redis）
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * 检查是否超过限流
 * @param key 限流键（如 IP 地址）
 * @param limit 限制次数
 * @param windowMs 时间窗口（毫秒）
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000 // 默认 1 分钟
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // 如果不存在或已过期，重置
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // 检查是否超限
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // 增加计数
  entry.count++;

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * 定期清理过期记录（可选，避免内存泄漏）
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetAt) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => rateLimitStore.delete(key));
}

// 每 5 分钟清理一次
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
