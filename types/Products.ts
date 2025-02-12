export interface Products {
  id: number;
  gpi: string;
  upc: string;
  ndc: string;
  name: string;
  description: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  img: string;
  isActived: boolean;
  isDeleted: boolean;
  store_id: number;
  price: number;
  amount: number;
  priority: boolean;
  amountToNotify: number;
  isDiscounted: boolean;
  discountPercentage: number;
  totalPriceWithDiscount: number;
}
