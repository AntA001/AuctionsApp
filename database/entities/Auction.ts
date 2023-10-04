import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { AuctionStatus, EntityInitData, ItemCategory } from "../types/types";

@Entity()
export class Auction extends BaseEntity {
    constructor(init: EntityInitData<Auction, 'seller' | 'title' | 'description' | 'category' | 'startPrice' | 'terminateAt' | 'status' >) {
        super(init);
        this.seller = init.seller;
        this.title = init.title;
        this.description = init.description;
        this.category = init.category;
        this.startPrice = init.startPrice;
        this.terminateAt = init.terminateAt;
        this.status = init.status;
    }

    @ManyToOne({
        entity: () => User,
        name: 'seller_id',
        cascade: [],
        onDelete: 'cascade',
        onUpdateIntegrity: 'cascade',
        columnType: 'uuid',
      })
    seller: User;

    @Property({ columnType: 'varchar(225)' })
    title: string;

    @Property({ columnType: 'text' })
    description: string;

    @Enum({ items: () => ItemCategory })
    category: ItemCategory;

    @Property({ columnType: 'integer'})
    startPrice: number;

    @Property()
    terminateAt: Date;

    @Enum({items: () => AuctionStatus, default: AuctionStatus.ON_GOING })
    status: AuctionStatus;
}