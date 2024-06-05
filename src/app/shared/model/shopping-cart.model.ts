import { type ICustomerDetails } from '@/shared/model/customer-details.model';

import { type OrderStatus } from '@/shared/model/enumerations/order-status.model';
import { type PaymentMethod } from '@/shared/model/enumerations/payment-method.model';
export interface IShoppingCart {
  id?: number;
  placedDate?: Date;
  status?: keyof typeof OrderStatus;
  totalPrice?: number;
  paymentMethod?: keyof typeof PaymentMethod;
  paymentReference?: string | null;
  customerDetails?: ICustomerDetails;
}

export class ShoppingCart implements IShoppingCart {
  constructor(
    public id?: number,
    public placedDate?: Date,
    public status?: keyof typeof OrderStatus,
    public totalPrice?: number,
    public paymentMethod?: keyof typeof PaymentMethod,
    public paymentReference?: string | null,
    public customerDetails?: ICustomerDetails,
  ) {}
}
