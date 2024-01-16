import { Migration } from '@mikro-orm/migrations'

export class Migration20231005104524 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, constraint "users_pkey" primary key ("id"));',
    )
    this.addSql(
      'alter table "users" add constraint "users_name_unique" unique ("name");',
    )

    this.addSql(
      "create table \"auctions\" (\"id\" uuid not null default gen_random_uuid(), \"created_at\" timestamptz(0) not null, \"updated_at\" timestamptz(0) not null, \"seller_id\" uuid not null, \"title\" varchar(225) not null, \"description\" text not null, \"category\" text check (\"category\" in ('VEHICLE', 'REAL_ESTATE', 'BABY', 'ART', 'MUSIC', 'DEVICE', 'AGRICULTURE', 'ANIMALS', 'SPORT', 'FASHION', 'FURNITURE', 'OTHER')) not null, \"start_price\" integer not null, \"terminate_at\" timestamptz(0) not null, \"status\" text check (\"status\" in ('ON_GOING', 'ON_HOLD', 'FINISHED')) not null default 'ON_GOING', constraint \"auctions_pkey\" primary key (\"id\"));",
    )

    this.addSql(
      'create table "bids" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "bidder_id" uuid not null, "auction_id" uuid not null, "price" integer not null, "is_maximum" boolean not null default false, constraint "bids_pkey" primary key ("id"));',
    )

    this.addSql(
      'alter table "auctions" add constraint "auctions_seller_id_foreign" foreign key ("seller_id") references "users" ("id") on update cascade on delete cascade;',
    )

    this.addSql(
      'alter table "bids" add constraint "bids_bidder_id_foreign" foreign key ("bidder_id") references "users" ("id") on update cascade on delete cascade;',
    )
    this.addSql(
      'alter table "bids" add constraint "bids_auction_id_foreign" foreign key ("auction_id") references "auctions" ("id") on update cascade on delete cascade;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "auctions" drop constraint "auctions_seller_id_foreign";',
    )

    this.addSql('alter table "bids" drop constraint "bids_bidder_id_foreign";')

    this.addSql('alter table "bids" drop constraint "bids_auction_id_foreign";')

    this.addSql('drop table if exists "users" cascade;')

    this.addSql('drop table if exists "auctions" cascade;')

    this.addSql('drop table if exists "bids" cascade;')
  }
}
