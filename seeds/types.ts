import { AuctionStatus, ItemCategory } from "../database/types/types";

export type UserCsv = {
  id: string;
  name: string;
};

export type AuctionCsv = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  startPrice: number;
  terminate_in_s: number | "";
  status: AuctionStatus;
};

export type TimeInterval = {
  seconds?: number;
};
