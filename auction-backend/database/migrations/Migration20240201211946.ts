import { Migration } from '@mikro-orm/migrations';

export class Migration20240201211946 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bids" add column "max_limit" integer null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bids" drop column "max_limit";');
  }

}
