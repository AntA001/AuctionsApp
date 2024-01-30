import { Request, Response, Router } from 'express';
import { DI } from '../app';
import { QueryOrder } from '@mikro-orm/core';
import { AuctionStatus } from '../../database/types/types';

const router = Router();

router.get('/buyer/:id', async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  //Also fetch totalCount of rows
  const [auctions, totalCount] = await DI.auctionRepository.findAndCount(
    {
      $and: [
        { seller: { $ne: req.params.id } },
        { status: { $ne: AuctionStatus.FINISHED } },
      ],
    },
    {
      populate: ['seller'],
      orderBy: { terminateAt: QueryOrder.ASC },
      limit: Number(limit),
      offset: Number(page) * Number(limit),
    }
  );
  res.json({ auctions, totalCount });
});

router.get('/seller/:id', async (req: Request, res: Response) => {
  const auctions = await DI.auctionRepository.find({
    seller: req.params.id,
  });
  res.json(auctions);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const auction = DI.auctionRepository.create(req.body);
    await DI.orm.em.persistAndFlush(auction);

    res.json(auction);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const AuctionController = router;
