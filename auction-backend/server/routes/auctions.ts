import { Request, Response, Router } from 'express'
import { DI } from '../app'
import { QueryOrder } from '@mikro-orm/core'

const router = Router()

router.get('/buyer/:id', async (req: Request, res: Response) => {
  const { page, limit } = req.query
  const [auctions] = await DI.auctionRepository.findAndCount(
    {
      $not: { seller: req.params.id },
    },
    {
      populate: ['seller'],
      orderBy: { terminateAt: QueryOrder.ASC },
      limit: Number(limit),
      offset: Number(page) * Number(limit),
    },
  )
  res.json(auctions)
})

router.get('/seller/:id', async (req: Request, res: Response) => {
  const auctions = await DI.auctionRepository.find({
    seller: req.params.id,
  })
  res.json(auctions)
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const auction = DI.auctionRepository.create(req.body)
    await DI.orm.em.persistAndFlush(auction)

    res.json(auction)
  } catch (e: any) {
    return res.status(400).json({ message: e.message })
  }
})

export const AuctionController = router
