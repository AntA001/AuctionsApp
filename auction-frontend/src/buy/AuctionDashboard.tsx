import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CreateBidModal } from '../bid/CreateBidModal';
import { useSocket } from '../util/SocketContext';
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

export default function AuctionDashboard() {
  const socket = useSocket();
  const [data, setData] = useState<Auction[]>([]);
  const [totalCount, setTotalCount] = useState(0); // Added totalCount
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selected, setSelected] = useState<Auction | null>(null);
  const [notification, setNotification] = useState({
    message: '',
    type: '', // 'success' or 'error'
  });

  const fetchAuctions = async (page: number) => {
    try {
      const userId = localStorage.getItem('user');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auctions/buyer/${userId}?page=${page}&limit=20`,
      );
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      return { auctions: [], totalCount: 0 }; // Return a default structure in case of an error
    }
  };

  // Effect to reset and fetch initial data on mount
  useEffect(() => {
    const initFetch = async () => {
      if (data.length === 0) {
        const { auctions, totalCount } = await fetchAuctions(0);
        setData(auctions);
        setTotalCount(totalCount); // Set correct total count from the initial fetch
        setPage(1);
        setHasMore(auctions.length === 20);
      }
    };

    //Updates local data regarding price when bids are placed
    //This helps provide up to date data to CreateBidModal
    const handleBidUpdate = (data: { auctionId: string; newPrice: number }) => {
      setData((prevData) =>
        prevData.map((auction) =>
          auction.id === data.auctionId
            ? { ...auction, startPrice: data.newPrice }
            : auction,
        ),
      );
    };

    initFetch();

    socket?.on('auctionsUpdated', async () => {
      const { auctions, totalCount } = await fetchAuctions(page);
      setData(auctions);
      setTotalCount(totalCount);
      setHasMore(auctions.length === 20);
    });

    socket?.on('bidPlaced', handleBidUpdate);

    return () => {
      socket?.off('auctionsUpdated');
      socket?.off('bidPlaced', handleBidUpdate);
      setData([]);
      setTotalCount(0);
      setPage(0);
      setHasMore(true);
    };
  }, [socket]);

  const handleNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    if (type === 'success') setModalShow(false);
  };

  const next = async () => {
    const { auctions: nextPageData } = await fetchAuctions(page);
    setData((prevData) => [...prevData, ...nextPageData]);
    setPage((prevPage) => prevPage + 1);
    if (nextPageData.length < 20) setHasMore(false);
  };

  return (
    <Container className="auctionDash-container">
      {data.length ? (
        //Changed auction count to be more dynamic
        <div>
          <div className="auction-count">
            Showing <strong>{data.length}</strong> of{' '}
            <strong>{totalCount}</strong> Auctions
          </div>
          <InfiniteScroll
            dataLength={data.length}
            next={next}
            height={`70vh`}
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
        </div>
      ) : (
        'NO RESULTS FOUND'
      )}
      {modalShow && (
        <CreateBidModal
          auction={selected as Auction}
          show={modalShow}
          onHide={() => setModalShow(false)}
          onNotify={handleNotification}
        />
      )}

      {notification.message && (
        <ToastMessage
          show={true}
          message={notification.message}
          bg={notification.type === 'error' ? 'danger' : 'success'}
          onClose={() => setNotification({ message: '', type: '' })} // Clear the notification
        />
      )}
    </Container>
  );
}
