import { MikroORM } from "@mikro-orm/postgresql";
import "dotenv/config";

import mikroOrmConfig from "../database/mikro-orm.config";
import { AuctionSeeder, UserSeeder } from "./seeding/seeders";
import { BidSeeder } from "./seeding/seeders/BidSeeder";

(async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const entityToSeed = process.argv[2];

    console.log("entity to seed", entityToSeed);

    let seeder = new UserSeeder();

    switch (entityToSeed) {
      case "bid":
        seeder = new BidSeeder();
        break;
      case "auction":
        seeder = new AuctionSeeder();
        break;
      default:
        break;
    }

    await seeder.execute(orm.em);

    console.log(`successfully seeded ${entityToSeed}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
