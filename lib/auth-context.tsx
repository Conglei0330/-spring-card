'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  phone: string;
  nickname?: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  checkLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查登录状态
  const checkLogin = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        setUser(null);
        return false;
      }

      // 检查响应是否有内容
      const text = await response.text();
      if (!text.trim()) {
        setUser(null);
        return false;
      }

      try {
        const result = JSON.parse(text);
        if (result.success && result.data) {
          setUser(result.data);
          return true;
        }
      } catch {
        // JSON 解析失败
        console.warn('checkLogin: 响应不是有效的JSON');
      }

      setUser(null);
      return false;
    } catch (error) {
      console.error('checkLogin 错误:', error);
      setUser(null);
      return false;
    }
  };

  // 登录（手机号直接登录，用户不存在则自动注册）
  const login = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`服务器错误: ${response.status} ${response.statusText} - 返回的不是JSON格式`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '登录失败');
      }

      setUser(result.data);
    } catch (error: any) {
      console.error('登录错误:', error);
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  // 初始化时检查登录状态
  useEffect(() => {
    checkLogin().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
