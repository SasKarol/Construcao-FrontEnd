import { createContext, useEffect, useState, type ReactNode } from 'react';
import {
  authApi,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
  type AuthUser,
} from '../../services/api';

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<string | undefined>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function handleInvalidSession() {
      setUser(null);
    }

    window.addEventListener('auth:logout', handleInvalidSession);

    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.user);
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      window.removeEventListener('auth:logout', handleInvalidSession);
    };
  }, []);

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password });
    setAuthToken(response.token);
    setUser(response.user);
  }

  async function register(data: RegisterData) {
    const response = await authApi.register(data);
    setAuthToken(response.token);
    setUser(response.user);
  }

  async function forgotPassword(email: string) {
    const response = await authApi.forgotPassword(email);
    return response.resetToken;
  }

  async function resetPassword(token: string, password: string) {
    await authApi.resetPassword({ token, password });
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // Mesmo com a API indisponivel, a sessao local deve ser encerrada.
    } finally {
      clearAuthToken();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
