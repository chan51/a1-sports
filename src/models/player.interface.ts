import { BaseEntity } from './base-entity.interface';

export interface Player extends BaseEntity {
  name: string;
  type: string[];
  team: string;
  value: number;
  isDeleted?: boolean;
  isEnable?: boolean;
}
