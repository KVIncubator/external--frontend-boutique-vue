import { type IUser } from '@/shared/model/user.model';

import { type Gender } from '@/shared/model/enumerations/gender.model';
export interface ICustomerDetails {
  id?: number;
  gender?: keyof typeof Gender;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  country?: string;
  user?: IUser;
}

export class CustomerDetails implements ICustomerDetails {
  constructor(
    public id?: number,
    public gender?: keyof typeof Gender,
    public phone?: string,
    public addressLine1?: string,
    public addressLine2?: string | null,
    public city?: string,
    public country?: string,
    public user?: IUser,
  ) {}
}
