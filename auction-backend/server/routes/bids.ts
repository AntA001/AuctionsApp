import { Request, Response, Router } from 'express';
import { DI } from '../app';

const router = Router();

export const BidController = router;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { price, isMaximum, bidder: bidderId, auction: auctionId } = req.body;
    const bidPrice = parseFloat(price);

    if (isNaN(bidPrice)) {
      return res.status(400).json({ message: 'Invalid bid price format.' });
    }

    const bidder = await DI.userRepository.findOne({ id: bidderId });
    const auction = await DI.auctionRepository.findOne({ id: auctionId });

    if (!bidder || !auction) {
      return res.status(404).json({ message: 'Bidder or Auction not found.' });
    }

    const highestBid = await DI.bidRepository.findOne(
      { auction },
      { orderBy: { price: 'DESC' } }
    );

    const highestMaxBid = await DI.bidRepository.findOne(
      { auction, isMaximum: true },
      { orderBy: { maxLimit: 'DESC' } }
    );

    let effectiveBidPrice = bidPrice;

    // Checks if the new bid is a maximum bid or a regular bid
    if (isMaximum) {
      // CheckS if the new max bid is higher than the highest max bid
      if (highestMaxBid && bidPrice > (highestMaxBid.maxLimit ?? 0)) {
        effectiveBidPrice = (highestMaxBid.maxLimit ?? 0) + 1;
      } else {
        effectiveBidPrice = highestBid
          ? highestBid.price + 1
          : auction.startPrice + 1;
      }

      const maxBid = DI.bidRepository.create({
        bidder,
        auction,
        price: effectiveBidPrice,
        isMaximum: true,
        ...(isMaximum && { maxLimit: bidPrice }),
      });
      await DI.orm.em.persistAndFlush(maxBid);
      // newMaxBidId = maxBid.id;

      if (effectiveBidPrice > auction.startPrice) {
        auction.startPrice = effectiveBidPrice;
        await DI.orm.em.persistAndFlush(auction);
      }
    } else {
      if (highestBid && bidPrice <= highestBid.price) {
        return res.status(400).json({
          message: 'Your bid must be higher than the current highest bid.',
        });
      }

      const bid = DI.bidRepository.create({
        bidder,
        auction,
        price: bidPrice,
        isMaximum: false,
        ...(isMaximum && { maxLimit: bidPrice }),
      });
      await DI.orm.em.persistAndFlush(bid);

      if (!highestBid || bidPrice > auction.startPrice) {
        auction.startPrice = bidPrice;
        await DI.orm.em.persistAndFlush(auction);
      }
    }

    // Handles automatic bidding for users with maximum bids
    const maxBids = await DI.bidRepository.find({ auction, isMaximum: true });
    for (const maxBid of maxBids) {
      if (maxBid.bidder.id === bidderId) continue;
      if (maxBid.maxLimit && maxBid.maxLimit > auction.startPrice) {
        const autoBidPrice = auction.startPrice + 1;
        if (autoBidPrice <= maxBid.maxLimit) {
          const autoBid = DI.bidRepository.create({
            bidder: maxBid.bidder,
            auction,
            price: autoBidPrice,
            isMaximum: false,
            ...(isMaximum && { maxLimit: bidPrice }),
          });
          await DI.orm.em.persistAndFlush(autoBid);

          // Updates auction's start price
          auction.startPrice = autoBidPrice;
          await DI.orm.em.persistAndFlush(auction);
        }
      }
    }

    DI.io.emit('bidPlaced', {
      auctionId: auction.id,
      newPrice: auction.startPrice,
    });
    DI.io.emit('auctionsUpdated');

    res.json({ success: true, message: 'Bid placed successfully' });
  } catch (e) {
    const error = e as Error;
    console.error('Failed to process bid:', error.message, error.stack);
    return res.status(500).json({
      message: 'An error occurred while processing your bid.',
      error: error.message,
    });
  }
});
