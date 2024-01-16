import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import { User } from './User'

export type UserContext = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<UserContext>({
  user: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({
  children,
  payload,
}: {
  children: ReactNode
  payload: User
}) => {
  const [user, setUser] = useState<User | null>(payload)

  const login = (user: User) => {
    localStorage.setItem('user', user.id)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
