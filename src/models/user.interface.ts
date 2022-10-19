import { BaseEntity } from './base-entity.interface';

export interface User extends BaseEntity {
  dob: string;
  email: string;
  name: string;
  firstName: string;
  gender: string;
  lastName: string;
  loginName: string;
  mobile: string;
  openedFirstTime: false;
  password: string;
  profile: string;
  cloudinaryURL: string;
  status: number;
  userType: string;
  expoPushToken?: string;
  applicationVersion?: string;
  coins?: number;
}
