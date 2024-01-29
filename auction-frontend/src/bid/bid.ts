import { User } from '../auth/User';
import { Auction } from '../buy/Auction';

export interface Bid {
  id: string;
  createdAt: string;
  updatedAt: string;
  bidder: User;
  auction: Auction;
  price: number;
  isMaximum: boolean;
}
