import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

interface AuthState {
  token: string;
  user: User;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setDate] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Church:token');
    const user = localStorage.getItem('@Church:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('auth/login', {
      email,
      password,
    });
    const { token, user } = response.data;

    api.defaults.headers.authorization = `Bearer ${token}`;

    localStorage.setItem('@Church:token', token);
    localStorage.setItem('@Church:user', JSON.stringify(user));
    setDate({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Church:token');
    localStorage.removeItem('@Church:user');
    setDate({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Church:user', JSON.stringify(user));
      setDate({
        token: data.token,
        user,
      });
    },
    [setDate, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an useProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
