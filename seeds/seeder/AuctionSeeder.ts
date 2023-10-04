import { EntityManager } from "@mikro-orm/core";
import { Auction, User } from "../../database/entities";
import { AuctionCsv } from "../types";
import { BaseSeeder } from "./BaseSeeder";
import { futureDate } from "../datetime";
import { ItemCategory } from "../../database/types/types";

export class AuctionSeeder extends BaseSeeder {
  async execute(entityManager: EntityManager): Promise<void> {
    const auctionsCsv = await this.readCsv<AuctionCsv>();
    console.log("auctions", auctionsCsv);

    const auctions = await Promise.all(
      auctionsCsv.map(
        async ({
          id,
          user_id,
          category,
          description,
          terminate_in_s,
          status,
          title,
          startPrice,
        }) => {
          const existingAuction = await entityManager.findOne(Auction, { id });

          const validCategory =
            ItemCategory[category as keyof typeof ItemCategory] ??
            ItemCategory.OTHER;
          const validTerminatedAt =
            terminate_in_s === "" ? 0 : Number(terminate_in_s);

          if (existingAuction) {
            existingAuction.seller = entityManager.getReference(User, user_id);
            existingAuction.category = validCategory;
            existingAuction.title = title;
            existingAuction.description = description;
            existingAuction.status = status;
            existingAuction.startPrice = startPrice;
            existingAuction.terminateAt = new Date(
              futureDate({ seconds: validTerminatedAt })
            );

            return existingAuction;
          }

          const newAuction = new Auction({
            id,
            title,
            category: validCategory,
            description,
            terminateAt: new Date(futureDate({ seconds: validTerminatedAt })),
            status,
            seller: entityManager.getReference(User, user_id),
            startPrice,
          });
          return newAuction;
        }
      )
    );

    await entityManager.persistAndFlush(auctions);
  }
}
