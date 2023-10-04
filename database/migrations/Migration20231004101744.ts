import { Migration } from '@mikro-orm/migrations';

export class Migration20231004101744 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');

    this.addSql('create table "auction" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "seller_id" uuid not null, "title" varchar(225) not null, "description" varchar(225) not null, "category" text check ("category" in (\'VEHICLE\', \'REAL_ESTATE\', \'BABY\', \'ART\', \'MUSIC\', \'DEVICE\', \'AGRICULTURE\', \'ANIMALS\', \'SPORT\', \'FASHION\', \'FURNITURE\', \'OTHER\')) not null, "start_price" integer not null, "terminate_at" timestamptz(0) not null, "status" text check ("status" in (\'ON_GOING\', \'ON_HOLD\', \'FINISHED\')) not null default \'ON_GOING\', constraint "auction_pkey" primary key ("id"));');

    this.addSql('create table "bid" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "bidder_id" uuid not null, "auction_id" uuid not null, "price" integer not null, "is_maximum" boolean not null default false, constraint "bid_pkey" primary key ("id"));');

    this.addSql('alter table "auction" add constraint "auction_seller_id_foreign" foreign key ("seller_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "bid" add constraint "bid_bidder_id_foreign" foreign key ("bidder_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "bid" add constraint "bid_auction_id_foreign" foreign key ("auction_id") references "auction" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auction" drop constraint "auction_seller_id_foreign";');

    this.addSql('alter table "bid" drop constraint "bid_bidder_id_foreign";');

    this.addSql('alter table "bid" drop constraint "bid_auction_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "auction" cascade;');

    this.addSql('drop table if exists "bid" cascade;');
  }

}
