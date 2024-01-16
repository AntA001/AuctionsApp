import { MikroORM } from '@mikro-orm/postgresql'
import 'dotenv/config'

import mikroOrmConfig from '../mikro-orm.config'
import { AuctionSeeder, UserSeeder } from './seeders'
import { BidSeeder } from './seeders/BidSeeder'
;(async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig)

    const entityToSeed = process.argv[2]

    console.log('entity to seed', entityToSeed)

    let seeder = new UserSeeder()

    switch (entityToSeed) {
      case 'users':
        break
      case 'bids':
        seeder = new BidSeeder()
        break
      case 'auctions':
        seeder = new AuctionSeeder()
        break
      default:
        throw new Error(
          "Wrong entity to seed name, must be 'users', 'bids', 'auctions'",
        )
        break
    }

    await seeder.execute(orm.em)

    console.log(`successfully seeded ${entityToSeed}`)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
