import { BaseEntity } from './base-entity.interface';

export interface SearchModel extends BaseEntity {
  description: string;
  redirectId: string;
  search: string;
  searchType: string;
  status: number;
  filePath?: string;
  cloudinaryURL?: string;
  thumb?: string;
  fileType?: string;
}
