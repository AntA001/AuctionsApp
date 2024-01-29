import { Outlet } from 'react-router-dom';

import NavigationComponent from '../components/NavigationComponent';

export default function Seller() {
  return (
    <>
      <NavigationComponent to="create" text="My auctions" />
      <Outlet />
    </>
  );
}
