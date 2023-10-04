import { EntityManager } from "@mikro-orm/core";
import { UserCsv } from "../types";

const fs = require("fs");
const csv = require("csv-parser");

export abstract class BaseSeeder {
  protected execute(entityManager: EntityManager) {}

  readCsv<T extends UserCsv>(): Promise<T[]> {
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
