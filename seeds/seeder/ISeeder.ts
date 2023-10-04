import { EntityManager } from "@mikro-orm/core";

export interface ISeeder {
  execute: (entityManager: EntityManager) => void;
}
