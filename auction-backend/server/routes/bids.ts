import { Request, Response, Router } from 'express';
import { DI } from '../app';

const router = Router();

export const BidController = router;

router.post('/', async (req: Request, res: Response) => {
  try {
    const bidPrice = parseFloat(req.body.price);

    if (isNaN(bidPrice)) {
      return res.status(400).json({ message: 'Invalid bid price format.' });
    }

    // Fetches the associated auction using the ID provided in the request body
    const auction = await DI.auctionRepository.findOne({
      id: req.body.auction,
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found.' });
    }

    // Checks if the bid is at least 1€ higher
    const currentAuctionPrice = auction.startPrice;
    if (bidPrice <= currentAuctionPrice) {
      return res.status(400).json({
        message:
          'Your bid must be at least 1€ higher than the current auction price.',
      });
    }

    const bid = DI.bidRepository.create({
      ...req.body,
      price: bidPrice.toString(), //converts back to string
    });
    await DI.orm.em.persistAndFlush(bid);

    auction.startPrice = bidPrice;
    await DI.orm.em.persistAndFlush(auction);

    // Emits real-time updates
    DI.io.emit('bidPlaced', { auctionId: auction.id, newPrice: bidPrice });

    res.json(bid);
  } catch (e: any) {
    console.error('Failed to process bid:', e);
    return res
      .status(500)
      .json({ message: 'An error occurred while processing your bid.' });
  }
});
