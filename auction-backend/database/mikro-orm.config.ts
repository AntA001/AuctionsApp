import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { AuctionEntity, BidEntity, UserEntity } from './entities';
import path from 'path';

export default {
  type: 'postgresql',
  entities: [UserEntity, AuctionEntity, BidEntity],
  dbName: 'auction-db',
  port: 5432,
  host: 'localhost',
  user: 'postgres',
  password: 'password',
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
