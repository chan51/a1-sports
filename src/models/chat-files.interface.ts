import { BaseEntity } from './base-entity.interface';
import { User } from './user.interface';

export interface ChatFiles extends BaseEntity {
  filePath: string;
  cloudinaryURL?: string;
  fileURI?: string;
  type: string;
  userId: User;
}
