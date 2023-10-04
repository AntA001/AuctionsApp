import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { EntityInitData } from "../types/types";
import { User } from "./User";
import { Auction } from "./Auction";

@Entity()
export class Bid extends BaseEntity {
    constructor(init: EntityInitData<Bid, 'bidder' | 'auction' | 'price' | 'isMaximum'>) {
        super(init);
        this.bidder= init.bidder;
        this.auction= init.auction;
        this.price= init.price;
        this.isMaximum= init.isMaximum;
    }

    @ManyToOne({
        entity: () => User,
        name: 'bidder_id',
        cascade: [],
        onDelete: 'cascade',
        onUpdateIntegrity: 'cascade',
        columnType: 'uuid',
    })
    bidder: User;

    @ManyToOne({
        entity: () => Auction,
        name: 'auction_id',
        cascade: [],
        onDelete: 'cascade',
        onUpdateIntegrity: 'cascade',
        columnType: 'uuid',
    })
    auction: Auction;

    @Property({ columnType: 'integer' })
    price: number;

    @Property({ columnType: 'boolean', default: false })
    isMaximum: boolean;
    
}