import { Request, Response, Router } from 'express'
import { DI } from '../app'

const router = Router()

export const BidController = router

router.post('/', async (req: Request, res: Response) => {
  try {
    const bid = DI.bidRepository.create(req.body)
    await DI.orm.em.persistAndFlush(bid)

    res.json(bid)
  } catch (e: any) {
    return res.status(400).json({ message: e.message })
  }
})
