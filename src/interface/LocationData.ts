
export interface ICustomerData {
  Location: string;
  Name: string;
  OtherPhone: string;
  Phone: string;
  area: string;
  payment: string;
}

export interface IOrder {
  customerData: ICustomerData;
  gust: string;
  status: 'panding' | string;
}
