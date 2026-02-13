// 简单的用户数据存储（内存存储，适合测试和小规模使用）

interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
}

// 简单的内存存储
const users = new Map<string, User>();
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';

export function findOrCreateUser(phone: string): User {
  let user = users.get(phone);

  if (!user) {
    // 创建新用户
    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phone,
      nickname: `用户${phone.slice(-4)}`,
      avatar: `${DEFAULT_AVATAR}${phone}`,
    };
    users.set(phone, user);
  }

  return user;
}

export function findUser(phone: string): User | undefined {
  return users.get(phone);
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}
