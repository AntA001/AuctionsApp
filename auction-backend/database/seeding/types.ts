import { AuctionStatus } from '../types/types'

export type UserCsv = {
  id: string
  name: string
}

export type AuctionCsv = {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  startPrice: number
  terminate_in_s: number | ''
  status: AuctionStatus
}

export type BidCsv = {
  user_id: string
  auction_id: string
  created_at: number
  price: number
  is_maximum: string
}

export type TimeInterval = {
  seconds?: number
}
