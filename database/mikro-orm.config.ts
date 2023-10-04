import { Options, UnderscoreNamingStrategy } from "@mikro-orm/core";
import { User, Bid, Auction }  from './entities';
import path from 'path';


export default {
    type: 'postgresql',
    entities: [User, Auction, Bid],
    dbName: process.env.DB_NAME,
    port: 5432,
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    namingStrategy: UnderscoreNamingStrategy,
    debug: true,
    forceUtcTimezone: true,
    pool: {},
    migrations: {
        tableName: 'db_migrations',
        path: path.join(__dirname, 'migrations'),
        transactional: true,
        disableForeignKeys: true,
    },
  } as Options;