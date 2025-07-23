type CollectionType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  stock: number;
  tags: [string];
  colorVariants: ColorVariationsType[],
  price: number;
  cost: number;
  sizes: [string];
  colors: [string];
  hidden: boolean;
  solde: boolean;
  newprice: number;
  createdAt: string;
  updatedAt: string;
};

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  shippingAddress: Object;
  _id: string;
  customerClerkId: string;
  products: [OrderItemType]
  shippingRate: string;
  totalAmount: number
  status: string
}

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}
type ColorVariationsType = {
  name: string,
  sizes: SizeVariationsType[],
}

type SizeVariationsType = {
  name: string,
  quantity: Number
}