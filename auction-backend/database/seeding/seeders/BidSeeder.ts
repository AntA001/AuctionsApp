import { EntityManager } from '@mikro-orm/core'
import { BidCsv } from '../types'
import { BaseSeeder } from './BaseSeeder'
import { AuctionEntity, BidEntity, UserEntity } from '../../entities'
import { pastDate } from '../utils'

export class BidSeeder extends BaseSeeder {
  async execute(entityManager: EntityManager): Promise<void> {
    const bidsCsv = await this.readCsv<BidCsv>()
    const bids = (
      await Promise.all(
        bidsCsv.map(
          async ({ user_id, auction_id, created_at, is_maximum, price }) => {
            const bidder = await entityManager.findOne(UserEntity, {
              id: user_id,
            })
            const auction = await entityManager.findOne(AuctionEntity, {
              id: auction_id,
            })

            if (!bidder) {
              console.warn('cannot find bidder ', bidder)
              return null
            }

            if (!auction) {
              console.warn('cannot find auction ', auction)
              return null
            }

            const createdAt = pastDate({ seconds: Number(created_at) })
            const isMaximum = is_maximum === 'TRUE'

            const existingBid = await entityManager.findOne(BidEntity, {
              bidder,
              auction,
              isMaximum,
            })

            if (existingBid) {
              existingBid.isMaximum = isMaximum
              existingBid.price = price
              existingBid.createdAt = createdAt
              existingBid.updatedAt = createdAt
              return existingBid
            }

            return new BidEntity({
              bidder,
              auction,
              createdAt,
              updatedAt: createdAt,
              isMaximum,
              price,
            })
          },
        ),
      )
    ).filter((bid) => !!bid)

    await entityManager.persistAndFlush(bids)
  }
}
