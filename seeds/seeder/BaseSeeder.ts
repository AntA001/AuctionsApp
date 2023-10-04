import { EntityManager } from "@mikro-orm/core";
import { AuctionCsv, UserCsv } from "../types";

const fs = require("fs");
const csv = require("csv-parser");

export abstract class BaseSeeder {
  protected execute(entityManager: EntityManager) {}

  readCsv<T extends UserCsv | AuctionCsv>(): Promise<T[]> {
    return new Promise((resolve) => {
      const rows = [] as T[];

      fs.createReadStream(process.argv[3])
        .pipe(csv())
        .on("data", (data: T) => rows.push(data))
        .on("end", () => {
          resolve(rows);
        });
    });
  }
}
