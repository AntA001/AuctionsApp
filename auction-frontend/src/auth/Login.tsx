import React, { useEffect, useMemo } from 'react'
import { Form as RouterForm, useActionData } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { Container } from 'react-bootstrap'
import ToastMessage from '../util/Toast'
import { useAuth } from './AuthProvider'
import { User } from './User'

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const userData = Object.fromEntries(formData)

  const body = JSON.stringify(userData)

  const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  })
  if (res.status === 400) {
    const error = await res.json()
    return { error }
  } else {
    const user = await res.json()
    return { user }
  }
}

export default function Login() {
  const actionData = useActionData() as Record<string, User | Error>
  const { login } = useAuth()

  const errorMessage = useMemo(
    () => (actionData?.error && (actionData.error as Error))?.message,
    [actionData],
  )

  useEffect(() => {
    if (actionData?.user) {
      login(actionData.user as User)
    }
  }, [actionData])

  return (
    <Container
      style={{ height: '90vh' }}
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <div
        style={{ height: '250px' }}
        className="d-flex flex-column justify-content-between"
      >
        <h1 style={{ textAlign: 'center' }}>WELCOME</h1>

        <RouterForm method="post">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Subscribe/Login</Form.Label>
            <Form.Control
              name="name"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              required
              onSubmit={() => console.log('jaaa')}
            />
          </Form.Group>
        </RouterForm>
      </div>
      <div className="position-absolute" style={{ top: '10vh', right: 10 }}>
        <ToastMessage
          show={!!(actionData?.error as Error)}
          message={errorMessage}
          bg="danger"
        />
      </div>
    </Container>
  )
}
