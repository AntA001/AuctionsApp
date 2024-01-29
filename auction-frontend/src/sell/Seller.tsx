import React from 'react';
import { Container } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import './Seller.scss';

export default function Seller() {
  return (
    <>
      <Container className="px-4 overflow-visible" fluid>
        <NavLink
          to="create"
          className={({ isActive }) =>
            isActive ? 'active nav-link' : 'nav-link'
          }
        >
          My auctions
        </NavLink>
        <div className="divider" />
      </Container>
      <Outlet />
    </>
  );
}
