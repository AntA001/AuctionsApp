import React, { useState } from 'react';
import { Button, Container, ListGroup } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import './CreateAuction.scss';
import { useActionData, useLoaderData } from 'react-router-dom';

import { Auction } from '../buy/Auction';
import { AuctionTile } from '../buy/Tile';
import ToastMessage from '../util/Toast';

import { CreateAuctionModal } from './CreateAuctionModal';

export const loader = async () => {
  const userId = localStorage.getItem('user');
  const auctions = await fetch(
    `${process.env.REACT_APP_API_URL}/auctions/seller/${userId}`,
  ).then((res) => res.json());

  return { auctions };
};

type LoadAuctionData = {
  auctions: Auction[];
};

type CreateAuctionData = {
  auction: Auction;
};

export default function CreateAuction() {
  const [modalShow, setModalShow] = useState(false);
  const { auctions } = useLoaderData() as LoadAuctionData;
  const createData = useActionData() as CreateAuctionData;

  return (
    <Container>
      <div className="button-container">
        <Button
          variant="outline-light"
          className="fab"
          onClick={() => setModalShow(true)}
        >
          <Plus color="black" size={30} />
        </Button>
      </div>
      <ListGroup>
        {auctions.map((auction) => (
          <AuctionTile key={auction.id} auction={auction} />
        ))}
      </ListGroup>
      <CreateAuctionModal show={modalShow} onHide={() => setModalShow(false)} />
      <div className="position-absolute" style={{ top: '10vh', right: 10 }}>
        <ToastMessage
          show={!!createData}
          message={`You successfully created on ${createData?.auction?.title}`}
          bg="success"
        />
      </div>
    </Container>
  );
}
