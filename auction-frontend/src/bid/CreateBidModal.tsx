import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';

import { useAuth } from '../auth/AuthProvider';
import { Auction } from '../buy/Auction';
import { timeLeft } from '../util/format-helper';
import { useSocket } from '../util/SocketContext';

export function CreateBidModal({
  auction,
  show,
  onHide,
  onNotify,
}: {
  auction: Auction;
  show: boolean;
  onHide: () => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
}) {
  const { user } = useAuth();
  const socket = useSocket();
  const [remainingTime, setRemainingTime] = useState(
    timeLeft(auction.terminateAt),
  );
  const [currentPrice, setCurrentPrice] = useState(auction.startPrice);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(timeLeft(auction.terminateAt));
    }, 1000);

    const handleBidUpdate = (data: { auctionId: string; newPrice: number }) => {
      if (data.auctionId === auction.id) {
        setCurrentPrice(data.newPrice);
      }
    };

    socket?.on('bidPlaced', handleBidUpdate);

    return () => {
      clearInterval(timer);
      socket?.off('bidPlaced', handleBidUpdate);
    };
  }, [auction, socket]);

  //Replaced router form submission logic with traditional onSubmit
  //In order to handle notification events
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = JSON.stringify({
      price: formData.get('price'),
      isMaximum: formData.get('isMaximum') === 'on',
      bidder: user?.id,
      auction: auction.id,
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place bid');
      }

      // Bid was successful, close the modal
      onNotify('Bid placed successfully!', 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      onNotify(errorMessage, 'error'); // Notify error
    }
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Bid on Auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
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
                    {`${currentPrice} €`}
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
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Place Bid
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
