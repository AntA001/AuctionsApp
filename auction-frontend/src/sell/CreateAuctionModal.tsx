/* eslint-disable import/no-named-as-default */
import React, { useMemo, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DateTimePicker from 'react-datetime-picker';
import { Form as RouterForm } from 'react-router-dom';

import { useAuth } from '../auth/AuthProvider';
import { ItemCategory, Value } from '../buy/Auction';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const {
    title,
    category,
    description,
    startPrice,
    terminateAt,
    second,
    seller,
  } = Object.fromEntries(formData);

  const body = JSON.stringify({
    title,
    category,
    description,
    startPrice,
    seller,
    terminateAt:
      (terminateAt as string) +
      ':' +
      ((second as string).length === 1 ? '0' + second : second),
  });

  const res = await fetch(`${process.env.REACT_APP_API_URL}/auctions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });

  const auction = await res.json();
  return { auction };
}

export function CreateAuctionModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  const categories = useMemo(() => Object.values(ItemCategory), []);
  const [value, setValue] = useState<Value>(new Date());
  const { user } = useAuth();

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <RouterForm method="post" onSubmit={onHide}>
        <Modal.Header className="justify-content-center">
          <Modal.Title id="contained-modal-title-vcenter">
            Create your auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              placeholder="Enter title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Select a category"
              name="category"
              className="form-control"
              required
            >
              <option value="">Choose one option</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" required />
          </Form.Group>

          <Container>
            <Row>
              <Col>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label sm={4} column>
                    Initial price
                  </Form.Label>
                  <Col sm={3}>
                    <Form.Control
                      type="text"
                      placeholder="€"
                      name="startPrice"
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label sm={4} column>
                    Deadline
                  </Form.Label>
                  <Col sm={8} className="align-self-center">
                    <DateTimePicker
                      name="terminateAt"
                      value={value}
                      onChange={setValue}
                      format="yy-MM-dd h:mm:ss a"
                      minDate={new Date()}
                      clearIcon={null}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Control name="seller" defaultValue={user?.id} hidden />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-between px-5">
          <Button variant="primary" type="submit">
            Create Auction
          </Button>
          <Button variant="secondary" type="button" onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </RouterForm>
    </Modal>
  );
}
