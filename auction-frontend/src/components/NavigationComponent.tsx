import React from 'react';
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import './NavigationComponent.scss';

export default function NavigationComponent({
  to,
  text,
}: {
  to: string;
  text: string;
}) {
  return (
    <>
      <Container className="nav-link-container">
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive ? 'active nav-link' : 'nav-link'
          }
        >
          {text}
        </NavLink>
      </Container>
    </>
  );
}
