import { ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { EntityInitData } from "./types/types";
import { UserEntity } from "./User";
import { AuctionEntity } from "./Auction";


export class BidEntity extends BaseEntity {
    constructor(init: EntityInitData<BidEntity, 'bidder' | 'auction' | 'price' | 'maxPrice'>) {
        super(init);
        this.bidder= init.bidder;
        this.auction= init.auction;
        this.price= init.price;
        this.maxPrice= init.maxPrice;
    }

    @ManyToOne({
        entity: () => UserEntity,
        name: 'bidder_id',
        cascade: [],
        onDelete: 'cascade',
        onUpdateIntegrity: 'cascade',
        columnType: 'uuid',
    })
    bidder: UserEntity;

    @ManyToOne({
        entity: () => AuctionEntity,
        name: 'auction_id',
        cascade: [],
        onDelete: 'cascade',
        onUpdateIntegrity: 'cascade',
        columnType: 'uuid',
    })
    auction: AuctionEntity;

    @Property({ columnType: 'integer' })
    price: number;

    @Property({ columnType: 'integer' })
    maxPrice: number;
}