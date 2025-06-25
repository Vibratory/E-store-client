"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { formatDZD } from "@/lib/actions/actions";


interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}




//card that shows on front page and everything other than product andd cart page

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {

  //checks if item is out of stock and greys out the picture and puts out-of-stock overlay
  if (product.stock == 0) {
    return (
      <Link
        href={`/products/${product._id}`}
        className="w-[220px] flex flex-col gap-2"
      >
        <div className="relative">
          <Image
            src={product.media[0]}
            alt="product"
            width={250}
            height={300}
            className="grayscale h-[250px] rounded-lg object-cover"
          />
          <Image
          alt="out-of-stock"
          src='/out-of-stock.png'
          className="absolute top-0 pointer-events-none"
          width={50}
         height={50}
            />
        </div>

        <div>
          <p className="text-base-bold">{product.title}</p>
          <p className="text-small-medium text-grey-2">{product.category}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-body-bold">{formatDZD(product.price)}</p>
          <p className="text-red-500 text-small-bold">Out of stock </p>
          <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
        </div>
      </Link>
    );

  } else {

    return (
      <Link
        href={`/products/${product._id}`}
        className="w-[220px] flex flex-col gap-2"
      >

        <Image
          src={product.media[0]}
          alt="product"
          width={250}
          height={300}
          className="h-[250px] rounded-lg object-cover"
        />
        <div>
          <p className="text-base-bold">{product.title}</p>
          <p className="text-small-medium text-grey-2">{product.category}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-body-bold">{formatDZD(product.price)}</p>
          
          {product.stock < 3 ? <p className="text-green-500 text-small-bold">Only {product.stock} left</p> :<p></p>}
          
          <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
        </div>
      </Link>
    );
  };
}

export default ProductCard;
