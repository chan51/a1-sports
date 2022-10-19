import { BaseEntity } from './base-entity.interface';

export interface Feed extends BaseEntity {
  description: string;
  filePath: string;
  cloudinaryId?: string;
  cloudinaryURL?: string;
  fileType: string;
  likes: number;
  location: string;
  people: string;
  thumb?: string;
  feedLikes?: any;
  cuisineType?: string;
  preferableTime?: any[];
}
