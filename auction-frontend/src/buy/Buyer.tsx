import { Outlet } from 'react-router-dom';

import NavigationComponent from '../components/NavigationComponent';

export default function Buyer() {
  return (
    <>
      <NavigationComponent to="auctions" text="Discover" />;
      <Outlet />
    </>
  );
}
