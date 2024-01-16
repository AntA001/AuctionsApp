import { BaseEntity } from '../entities/BaseEntity'

export type UUID = string

export type EntityInitData<
  EntityType extends BaseEntity,
  RequiredKeys extends keyof EntityType,
> = Pick<EntityType, RequiredKeys> & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

export enum ItemCategory {
  VEHICLE = 'VEHICLE',
  REAL_ESTATE = 'REAL_ESTATE',
  BABY = 'BABY',
  ART = 'ART',
  MUSIC = 'MUSIC',
  DEVICE = 'DEVICE',
  AGRICULTURE = 'AGRICULTURE',
  ANIMALS = 'ANIMALS',
  SPORT = 'SPORT',
  FASHION = 'FASHION',
  FURNITURE = 'FURNITURE',
  OTHER = 'OTHER',
}

export enum AuctionStatus {
  ON_GOING = 'ON_GOING',
  ON_HOLD = 'ON_HOLD',
  FINISHED = 'FINISHED',
}
