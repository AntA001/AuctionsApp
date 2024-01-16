import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'
import { EntityInitData } from '../types/types'
import { UserEntity } from './User'
import { AuctionEntity } from './Auction'

@Entity({ tableName: 'bids' })
export class BidEntity extends BaseEntity {
  constructor(
    init: EntityInitData<
      BidEntity,
      'bidder' | 'auction' | 'price' | 'isMaximum'
    >,
  ) {
    super(init)
    this.bidder = init.bidder
    this.auction = init.auction
    this.price = init.price
    this.isMaximum = init.isMaximum
  }

  @ManyToOne({
    entity: () => UserEntity,
    name: 'bidder_id',
    cascade: [],
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
    columnType: 'uuid',
  })
  bidder: UserEntity

  @ManyToOne({
    entity: () => AuctionEntity,
    name: 'auction_id',
    cascade: [],
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
    columnType: 'uuid',
  })
  auction: AuctionEntity

  @Property({ columnType: 'integer' })
  price: number

  @Property({ columnType: 'boolean', default: false })
  isMaximum: boolean
}
