import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { AuctionEntity, BidEntity, UserEntity } from './entities';
import path from 'path';

export default {
  type: 'postgresql',
  entities: [UserEntity, AuctionEntity, BidEntity],
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
  allowGlobalContext: true,
} as Options;
