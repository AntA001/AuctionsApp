import { Request, Response, Router } from 'express'
import { DI } from '../app'

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id || ''
    const user = await DI.userRepository.findOne(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (e: any) {
    return res.status(400).json({ message: e.message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const match = await DI.userRepository.findOne({ name: req.body.name })
    if (match) {
      res.json(match)
    } else {
      const user = DI.userRepository.create(req.body)
      await DI.orm.em.persistAndFlush(user)

      res.json(user)
    }
  } catch (e: any) {
    return res.status(400).json({ message: e.message })
  }
})

export const UserController = router
