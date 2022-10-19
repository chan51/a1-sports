import { BaseEntity } from './base-entity.interface';

export interface EventModel extends BaseEntity {
  eventName: string;
  eventCode: string;
  eventBanner: string;
  bannerFileType: string;
  startDate: string;
  endDate: string;
  prize: string;
  description: string;
  options: string;
  coupon: string;
  couponDisc: string;
  rules: any[];
  leaderBoard?: LeaderBoard[];
  showLeaderBoard?: boolean;
}

export interface LeaderBoard {
  feedId: string;
  leaderId: string;
  leaderProfile: string;
  leaderName: string;
  leaderLikes: number;
}
