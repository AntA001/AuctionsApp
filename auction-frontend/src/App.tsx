import React, { Suspense, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import {
  Await,
  defer,
  Outlet,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './auth/AuthProvider';
import { User } from './auth/User';
import { SocketProvider } from './util/SocketContext';

import './App.scss';

export const loader = async () => {
  const userId = localStorage.getItem('user');
  if (userId) {
    //Added error checking with a try catch block
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
      );
      if (response.ok) {
        const user = await response.json();
        return defer({ user });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }
  return defer({ user: null });
};

//In case loader returns null we need to be able to accept it as a type
type AuthData = {
  user: User | null;
};

export default function App() {
  const { user } = useLoaderData() as AuthData;
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      login(user);
    }
  }, [user, login, navigate]);

  return (
    <SocketProvider>
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
    </SocketProvider>
  );
}
