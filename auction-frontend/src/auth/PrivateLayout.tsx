import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import React from 'react'
import { Button } from 'react-bootstrap'

export default function PrivateLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="app">
      <header className="header">
        <nav>
          <ul className="link-container">
            <li>
              <p className="mt-3">Auction app</p>
            </li>
            <li className="role-container">
              <NavLink
                to="/buyer"
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >
                Buyer
              </NavLink>
              <NavLink
                to="/seller"
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >
                Seller
              </NavLink>
            </li>
            <li>
              <Button
                variant="link"
                style={{ color: 'black', textDecoration: 'none' }}
                onClick={logout}
              >
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
