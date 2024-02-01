import { Request, Response, Router } from 'express';
import { DI } from '../app';

const router = Router();

export const BidController = router;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { price, isMaximum, bidder } = req.body;
    const bidPrice = parseFloat(price);

    if (isNaN(bidPrice)) {
      return res.status(400).json({ message: 'Invalid bid price format.' });
    }

    const auction = await DI.auctionRepository.findOne({
      id: req.body.auction,
    });
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found.' });
    }

    // Determine the current highest bid or start price
    const currentMaxBid = Math.max(
      auction.startPrice,
      ...(await DI.bidRepository.find({ auction })).map((bid) => bid.price)
    );

    if (!isMaximum) {
      // For regular bids, ensure the bid is at least 1€ higher than the current highest bid/start price
      if (bidPrice <= currentMaxBid) {
        return res.status(400).json({
          message:
            'Your bid must be at least 1€ higher than the current highest bid/start price.',
        });
      }
    }

    // Prepare bid data, including maxLimit for maximum bids
    const bidData = {
      bidder: bidder,
      auction: req.body.auction,
      price: isMaximum ? Math.min(bidPrice, currentMaxBid + 1) : bidPrice, // For maximum bids, set price to be slightly higher than currentMaxBid, capped at bidPrice
      isMaximum,
      ...(isMaximum && { maxLimit: bidPrice }),
    };

    const bid = DI.bidRepository.create(bidData);
    await DI.orm.em.persistAndFlush(bid);

    // Update auction's current price only if the new bid exceeds the current highest bid
    if (bidData.price > currentMaxBid) {
      auction.startPrice = bidData.price;
      await DI.orm.em.persistAndFlush(auction);
    }

    DI.io.emit('bidPlaced', { auctionId: auction.id, newPrice: bidData.price });

    res.json({ success: true, message: 'Bid placed successfully', bid });
  } catch (e) {
    const error = e as Error; // Asserting `e` as an Error object
    console.error('Failed to process bid:', error.message, error.stack);
    return res.status(500).json({
      message: 'An error occurred while processing your bid.',
      error: error.message,
    });
  }
});
