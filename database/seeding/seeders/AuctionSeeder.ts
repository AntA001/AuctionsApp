import { EntityManager } from "@mikro-orm/core";
import { Auction, User } from "../../entities";
import { AuctionCsv } from "../types";
import { BaseSeeder } from "./BaseSeeder";
import { futureDate } from "../../datetime";
import { ItemCategory } from "../../types/types";

export class AuctionSeeder extends BaseSeeder {
  async execute(entityManager: EntityManager): Promise<void> {
    const auctionsCsv = await this.readCsv<AuctionCsv>();
    const auctions = (
      await Promise.all(
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
            const existingAuction = await entityManager.findOne(Auction, {
              id,
            });

            const seller = await entityManager.findOne(User, { id: user_id });

            if (!seller) {
              console.warn("cannot find seller ", user_id);
              return;
            }

            const validCategory =
              ItemCategory[category as keyof typeof ItemCategory] ??
              ItemCategory.OTHER;
            const validTerminatedAt =
              terminate_in_s === "" ? 0 : Number(terminate_in_s);

            if (existingAuction) {
              existingAuction.seller = entityManager.getReference(
                User,
                user_id
              );
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
      )
    ).filter((auction) => !!auction);

    await entityManager.persistAndFlush(auctions);
  }
}
