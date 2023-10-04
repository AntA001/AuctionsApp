import { EntityManager } from "@mikro-orm/core";
import { ISeeder } from "./ISeeder";
import { UserCsv } from "../types";
import { User } from "../../database/entities";

const fs = require("fs");
const csv = require("csv-parser");

export class UserSeeder implements ISeeder {
  execute(entityManager: EntityManager) {
    const usersCsv = [] as UserCsv[];

    fs.createReadStream(process.argv[3])
      .pipe(csv())
      .on("data", (data: UserCsv) => usersCsv.push(data))
      .on("end", async () => {
        const users = await Promise.all(
          usersCsv.map(async ({ id, name }) => {
            const existingUser = await entityManager.findOne(User, { id });

            if (existingUser) {
              existingUser.name = name;

              return existingUser;
            }

            const newUser = new User({
              id,
              name,
            });
            return newUser;
          })
        );

        await entityManager.persistAndFlush(users);
      });
  }
}
