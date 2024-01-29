import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActionData, useLoaderData } from 'react-router-dom';

import { Bid } from '../bid/bid';
import { CreateBidModal } from '../bid/CreateBidModal';
import ToastMessage from '../util/Toast';

import { Auction } from './Auction';
import { AuctionTile } from './Tile';

import './AuctionDashboard.scss';

export const loader = async () => {
  const userId = localStorage.getItem('user');
  const auctions = await fetch(
    `${process.env.REACT_APP_API_URL}/auctions/buyer/${userId}?page=0&limit=20`,
  ).then((res) => res.json());

  return { auctions };
};

type LoadAuctionData = {
  auctions: Auction[];
};

type CreateBidData = {
  bid: Bid;
};

export default function AuctionDashboard() {
  const { auctions } = useLoaderData() as LoadAuctionData;
  const createData = useActionData() as CreateBidData;
  const [data, setData] = useState<Auction[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selected, setSelected] = useState<Auction | null>(null);

  useEffect(() => {
    setData(auctions);
  }, [auctions]);

  const next = async () => {
    const userId = localStorage.getItem('user');
    const nextPage = page + 1;
    setPage(nextPage);
    const nextData: Auction[] = await fetch(
      `${process.env.REACT_APP_API_URL}/auctions/buyer/${userId}?page=${nextPage}&limit=20`,
    ).then((res) => res.json());
    setData([...data, ...nextData]);
    if (nextData.length < 20) setHasMore(false);
  };

  return (
    <Container className="auctionDash-container">
      {data.length && (
        <div className="auction-count">
          <strong>{data.length}</strong> auctions found:
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        height={600}
        hasMore={hasMore}
        loader={
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" />
          </div>
        }
        endMessage={
          <p className="end-message">
            <b>You have seen it all</b>
          </p>
        }
      >
        {data.map((auction) => (
          <div
            key={auction.id}
            onClick={() => {
              setSelected(auction);
              setModalShow(true);
            }}
          >
            <AuctionTile auction={auction} />
          </div>
        ))}
      </InfiniteScroll>
      {modalShow && (
        <CreateBidModal
          auction={selected as Auction}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}
      <div className="toast-message">
        <ToastMessage
          show={!!createData}
          message={`You successfully created on ${selected?.title}`}
          bg="success"
        />
      </div>
    </Container>
  );
}
