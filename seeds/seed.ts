import { MikroORM } from "@mikro-orm/postgresql";
import "dotenv/config";

import mikroOrmConfig from "../database/mikro-orm.config";
import { UserSeeder } from "./seeder";

(async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const entityToSeed = process.argv[2];

    switch (entityToSeed) {
      default:
        new UserSeeder().execute(orm.em);
        break;
    }

    console.log(`successfully seeded ${entityToSeed}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
