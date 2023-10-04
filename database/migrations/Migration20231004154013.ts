import { Migration } from "@mikro-orm/migrations";

export class Migration20231004154013 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "auction" alter column "description" type text using ("description"::text);'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "auction" alter column "description" type varchar(225) using ("description"::varchar(225));'
    );
  }
}
