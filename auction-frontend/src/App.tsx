import React, { Suspense, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Await, defer, Outlet, useLoaderData } from 'react-router-dom';

import { AuthProvider, useAuth } from './auth/AuthProvider';
import { User } from './auth/User';

export const loader = async () => {
  const userId = localStorage.getItem('user');
  if (userId) {
    const fetchUser = fetch(
      `${process.env.REACT_APP_API_URL}/users/${userId}`,
    ).then((res) => res.json());
    return defer({ user: fetchUser });
  }
  return { user: null };
};

type AuthData = {
  user: User;
};

export default function App() {
  const { user } = useLoaderData() as AuthData;
  const { login } = useAuth();

  useEffect(() => {
    if (user) {
      login(user);
    }
  }, [user]);

  return (
    <Suspense fallback={<Spinner animation="grow" />}>
      <Await
        resolve={user}
        errorElement={
          <Alert variant="danger" dismissible={true}>
            Something went wrong!
          </Alert>
        }
      >
        {(user) => (
          <AuthProvider payload={user}>
            <Outlet />
          </AuthProvider>
        )}
      </Await>
    </Suspense>
  );
}
