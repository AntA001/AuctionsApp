import { Entity, Property, Unique } from '@mikro-orm/core'
import { EntityInitData } from '../types/types'
import { BaseEntity } from './BaseEntity'

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  constructor(init: EntityInitData<UserEntity, 'name'>) {
    super(init)
    this.name = init.name
  }

  @Unique()
  @Property({ columnType: 'varchar(255)' })
  name: string
}
