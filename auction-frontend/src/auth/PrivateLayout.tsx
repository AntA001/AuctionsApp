import React from 'react';
import { Button } from 'react-bootstrap';
import { Navigate, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from './AuthProvider';

export default function PrivateLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
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
                to="/buyer/auctions"
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >
                Buyer
              </NavLink>
              <NavLink
                to="/seller/create"
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >
                Seller
              </NavLink>
            </li>
            <li>
              <Button variant="link" className="button-logout" onClick={logout}>
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
