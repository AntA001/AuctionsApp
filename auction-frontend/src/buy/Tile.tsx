import React, { useEffect, useState } from 'react';
import { Col, Container, ListGroupItem, Row } from 'react-bootstrap';

import { timeLeft } from '../util/format-helper';
import { useSocket } from '../util/SocketContext';

import { Auction } from './Auction';

import './Tile.scss';

export function AuctionTile({ auction }: { auction: Auction }) {
  const socket = useSocket();
  const [remainingTime, setRemainingTime] = useState(
    timeLeft(auction.terminateAt),
  );
  const [currentPrice, setCurrentPrice] = useState(auction.startPrice);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = timeLeft(auction.terminateAt);
      setRemainingTime(updatedTimeLeft);
    }, 1000);

    // Event listener for auction price updates
    const handlePriceUpdate = (data: {
      auctionId: string;
      newPrice: number;
    }) => {
      if (data.auctionId === auction.id) {
        setCurrentPrice(data.newPrice);
      }
    };

    // Registers the event listener with the socket
    socket?.on('bidPlaced', handlePriceUpdate);

    // Cleanup function
    return () => {
      clearInterval(timer);
      socket?.off('bidPlaced', handlePriceUpdate);
    };
  }, [auction, socket]);

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
            <p className="item fw-bold">{currentPrice + '€'}</p>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
}
