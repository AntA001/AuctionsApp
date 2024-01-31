import React, { useEffect, useState } from 'react';
import { Col, Container, ListGroupItem, Row } from 'react-bootstrap';

import { timeLeft } from '../util/format-helper';

import { Auction } from './Auction';

import './Tile.scss';

export function AuctionTile({ auction }: { auction: Auction }) {
  const [remainingTime, setRemainingTime] = useState(
    timeLeft(auction.terminateAt),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = timeLeft(auction.terminateAt);
      setRemainingTime(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [auction.terminateAt]);

  return (
    <ListGroupItem
      className={`list-group-item ${remainingTime === 'FINISHED' ? 'finished' : ''}`}
    >
      <Container>
        <Row className="align-items-center" style={{ height: '125px' }}>
          <Col sm={6}>
            <h3>{auction.title}</h3>
            <p className="truncate item">{auction.description}</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p
              className={`item ${remainingTime === 'FINISHED' ? 'finished-timer' : ''}`}
            >
              {remainingTime}
            </p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="item fw-bold">{auction.startPrice + '€'}</p>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
}
