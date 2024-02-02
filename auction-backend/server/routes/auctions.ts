import { Request, Response, Router } from 'express';
import { DI } from '../app';
import { QueryOrder } from '@mikro-orm/core';
import { AuctionStatus } from '../../database/types/types';
import { BidEntity } from '@/database/entities';
import { AuctionEntity } from '@/database/entities';

const router = Router();

type BidAccumulator = {
  highestBidEntity: BidEntity | null; // To store the highest bid entity
  highestAmount: number; // To keep track of the highest bid amount
};

router.get('/buyer/:id', async (req: Request, res: Response) => {
  const { page = 0, limit = 10 } = req.query;
  const userId = req.params.id;

  // Fetches all relevant auctions
  const [auctions] = await DI.auctionRepository.findAndCount(
    {
      $and: [
        { seller: { $ne: userId } },
        { status: { $ne: AuctionStatus.FINISHED } },
      ],
    },
    {
      populate: ['seller', 'bids'],
      orderBy: { terminateAt: QueryOrder.ASC },
      limit: Number(limit),
      offset: Number(page) * Number(limit),
    }
  );

  // Filters auctions based on highest bid
  const filteredAuctions = auctions.filter((auction: AuctionEntity) => {
    const highestBidAccumulator = auction.bids
      .getItems()
      .reduce<BidAccumulator>(
        (acc, bid) => {
          if (bid.price > acc.highestAmount) {
            return { highestBidEntity: bid, highestAmount: bid.price };
          }
          return acc;
        },
        { highestBidEntity: null, highestAmount: 0 }
      );

    // Checks if the current user is the highest bidder
    const isUserHighestBidder =
      highestBidAccumulator.highestBidEntity?.bidder.id === userId;
    return !isUserHighestBidder; // Keeps the auction if the user is not the highest bidder
  });

  res.json({ auctions: filteredAuctions, totalCount: filteredAuctions.length });
});

router.get('/seller/:id', async (req: Request, res: Response) => {
  const auctions = await DI.auctionRepository.find(
    {
      $and: [
        { seller: req.params.id },
        //? It was not specified in the requirements if the sellers page should show the finished ones or not. ->
        //? So I leave the FINISHED check commented out. ->
        //? Adding this would also require (ideally) adding a client socket listener in the frontend of the seller page too ->
        //? for real time updates (which, only for the seller page, are now handled just by the countdown frontend implementation) ->
        // { status: { $ne: AuctionStatus.FINISHED } },
      ],
    },
    {
      orderBy: { terminateAt: QueryOrder.DESC },
    }
  );
  res.json(auctions);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const auction = DI.auctionRepository.create(req.body);
    await DI.orm.em.persistAndFlush(auction);
    DI.io.emit('auctionsUpdated');

    res.json(auction);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const AuctionController = router;
