import { MikroORM } from "@mikro-orm/postgresql";
import "dotenv/config";

import mikroOrmConfig from "../database/mikro-orm.config";
import { AuctionSeeder, UserSeeder } from "./seeder";

(async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const entityToSeed = process.argv[2];

    let seeder = new UserSeeder();

    switch (entityToSeed) {
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
