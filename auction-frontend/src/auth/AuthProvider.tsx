import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from './User';

export type UserContext = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<UserContext>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
  payload,
}: {
  children: ReactNode;
  payload: User;
}) => {
  const [user, setUser] = useState<User | null>(payload);
  const navigate = useNavigate();

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', user.id);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('firstLoginCheckDone'); // Clear the first login check flag
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
