import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form as RouterForm } from 'react-router-dom';

import { useAuth } from '../auth/AuthProvider';
import { Auction } from '../buy/Auction';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { timeLeft } from '../util/format-helper';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const { price, isMaximum, bidder, auction } = Object.fromEntries(formData);

  const body = JSON.stringify({
    price,
    isMaximum,
    bidder,
    auction,
  });

  const res = await fetch(`${process.env.REACT_APP_API_URL}/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });
  const bid = await res.json();
  return { bid };
}

export function CreateBidModal({
  auction,
  show,
  onHide,
  socket,
}: {
  auction: Auction;
  show: boolean;
  onHide: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
}) {
  interface BidUpdateData {
    auctionId: string;
    newPrice: number;
  }
  const { user } = useAuth();

  const [remainingTime, setRemainingTime] = useState(
    timeLeft(auction.terminateAt),
  );
  const [currentPrice, setCurrentPrice] = useState(auction.startPrice); // Add state to track current price

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(timeLeft(auction.terminateAt));
    }, 1000);

    const handleBidUpdate = (data: BidUpdateData) => {
      if (data.auctionId === auction.id) {
        setCurrentPrice(data.newPrice);
      }
    };

    socket.on('bidPlaced', handleBidUpdate);

    return () => {
      clearInterval(timer);
      socket.off('bidPlaced', handleBidUpdate);
    };
  }, [auction, socket]);

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
            Bid on auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{auction.title}</h3>

          <p>{auction.description}</p>
          <Container>
            <Row className="justify-content-center align-items-center">
              <Col sm={{ span: 5, offset: 1 }}>
                <p>Seller: {auction.seller.name}</p>
                <p>Deadline: {remainingTime}</p>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <p>
                  Price:{' '}
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {currentPrice}
                  </span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col sm={{ span: 5, offset: 1 }}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label sm={4} column>
                    Your offer
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      placeholder="€"
                      name="price"
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={{ span: 5, offset: 1 }}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label sm={4} column>
                    Is Max
                  </Form.Label>
                  <Col sm={8} className="align-self-center">
                    <Form.Check
                      id="custom-switch"
                      name="isMaximum"
                      type="switch"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Form.Control name="bidder" defaultValue={user?.id} hidden />
            <Form.Control name="auction" defaultValue={auction.id} hidden />
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-between px-5">
          <Button variant="primary" type="submit">
            Bid
          </Button>
          <Button variant="secondary" type="button" onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </RouterForm>
    </Modal>
  );
}
