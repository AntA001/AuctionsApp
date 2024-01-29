import React, { useCallback } from 'react';
import { Col, Container, ListGroupItem, Row } from 'react-bootstrap';

import './Tile.scss';
import { timeLeft } from '../util/format-helper';

import { Auction } from './Auction';

export function AuctionTile({ auction }: { auction: Auction }) {
  const expiresIn = useCallback((date: string) => timeLeft(date), []);

  return (
    <ListGroupItem className="list-group-item">
      <Container>
        <Row className="align-items-center" style={{ height: '125px' }}>
          <Col sm={6}>
            <h3>{auction.title}</h3>
            <p className="truncate item">{auction.description}</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="item">{expiresIn(auction.terminateAt)}</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="item fw-bold">{auction.startPrice + '€'}</p>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
}
