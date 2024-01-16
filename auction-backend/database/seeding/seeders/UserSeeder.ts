import { EntityManager } from '@mikro-orm/core'

import { UserCsv } from '../types'
import { UserEntity } from '../../entities'
import { BaseSeeder } from './BaseSeeder'

export class UserSeeder extends BaseSeeder {
  async execute(entityManager: EntityManager): Promise<void> {
    const usersCsv = await this.readCsv<UserCsv>()

    const users = await Promise.all(
      usersCsv.map(async ({ id, name }) => {
        const existingUser = await entityManager.findOne(UserEntity, { id })

        if (existingUser) {
          existingUser.name = name

          return existingUser
        }

        const newUser = new UserEntity({
          id,
          name,
        })
        return newUser
      }),
    )

    await entityManager.persistAndFlush(users)
  }
}
