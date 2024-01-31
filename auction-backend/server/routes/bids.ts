import { Request, Response, Router } from 'express';
import { DI } from '../app';

const router = Router();

export const BidController = router;

router.post('/', async (req: Request, res: Response) => {
  try {
    const bid = DI.bidRepository.create(req.body);
    await DI.orm.em.persistAndFlush(bid);

    // Fetch the associated auction
    const auction = await DI.auctionRepository.findOne({ id: bid.auction.id });
    if (auction) {
      // Update the auction's price with the new bid price
      auction.startPrice = bid.price;
      await DI.orm.em.persistAndFlush(auction);
    }

    // Emit real-time updates
    DI.io.emit('bidPlaced', { auctionId: bid.auction.id, newPrice: bid.price });

    res.json(bid);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});
