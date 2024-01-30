import React, { useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {
  useNavigate,
  Form as RouterForm,
  useActionData,
} from 'react-router-dom';

import ToastMessage from '../util/Toast';

import { useAuth } from './AuthProvider';
import { User } from './User';

import './Login.scss';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  const body = JSON.stringify(userData);

  const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });
  if (res.status === 400) {
    const error = await res.json();
    return { error };
  } else {
    const user = await res.json();
    const firstLoginCheckDone = localStorage.getItem('firstLoginCheckDone');
    if (!firstLoginCheckDone) {
      const sellerResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/auctions/seller/${user.id}`,
      );
      if (sellerResponse.ok) {
        const sellerData = await sellerResponse.json();
        const isSeller = sellerData?.length > 0;
        user.isSeller = isSeller; // Attach isSeller property to user object
      }
      // Mark that the first login check has been done
      localStorage.setItem('firstLoginCheckDone', 'true');
    }

    return { user };
  }
}

export default function Login() {
  const actionData = useActionData() as Record<string, User | Error>;
  const { login } = useAuth();
  const navigate = useNavigate();

  const errorMessage = useMemo(
    () => (actionData?.error && (actionData.error as Error))?.message,
    [actionData],
  );

  useEffect(() => {
    if (actionData?.user) {
      login(actionData.user as User);
      // Redirect based on isSeller status (directly to the subpage since there is only 1 at the moment)
      // Timeeout with 0ms to defer navigation until after pending state updates and re-renders.
      setTimeout(() => {
        if ((actionData.user as User).isSeller) {
          navigate('/seller/create');
        } else {
          navigate('/buyer/auctions');
        }
      }, 0);
    }
  }, [actionData, login, navigate]);

  return (
    <Container className="login-container">
      <div className="login-box">
        <h1 className="login-title">WELCOME</h1>

        <RouterForm method="post">
          <Form.Group
            className="login-input-container"
            controlId="formBasicEmail"
          >
            <Form.Label>Subscribe/Login</Form.Label>
            <Form.Control
              name="name"
              type="text"
              className="login-input"
              placeholder="Enter your name"
              required
              onSubmit={() => console.log('jaaa')}
            />
          </Form.Group>
        </RouterForm>
      </div>
      <div className="toast-message">
        <ToastMessage
          show={!!(actionData?.error as Error)}
          message={errorMessage}
          bg="danger"
        />
      </div>
    </Container>
  );
}
