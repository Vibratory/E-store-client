"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { formatDZD } from "@/lib/actions/actions";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const [inStock, setInStock] = useState(true);

  //check if any item has a a variant in stock if it has none then aits out of stock
  useEffect(() => {

    const stockarooni = product.colorVariants.some((color: ColorVariationsType) =>
      color.sizes.some((size: SizeVariationsType) =>
        size.quantity !== 0)
    );

    if (stockarooni) {
      setInStock(true)

    } else {
      setInStock(false)
    }
  },[product])




//const isOutOfStock = product.stock == 0;

// constants for frame styling
const frameSize = 260;
const borderWidth = 5;
const borderColor = "#f8a691"; //6880bc //ffc476 //f8a691 //b6d6cb
const frameBorderRadius = "5rem";
const imageBorderRadius = "5rem";

return (
  <Link
    href={`/products/${product._id}`}
    className="w-[250px] flex flex-col gap-2 "
  >
    {inStock ? (
      <div className=" relative ">
        {/* DIV Frame above image (acts as a container for custom border elements) */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            top: "10px",
            left: "4px",
            width: `${frameSize}px`,
            height: `${frameSize}px`,
          }}
        >
          {/*  Bottom and Right Border */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: "100%", // Will be overridden by border-right for the horizontal part
              height: "100%", // Will be overridden by border-bottom for the vertical part
              borderBottom: `${borderWidth}px solid ${borderColor}`,
              borderRight: `${borderWidth}px solid ${borderColor}`,
              borderBottomRightRadius: frameBorderRadius,
            }}
          ></div>

          {/* Half Top Border (left half invisible) */}
          <div
            className="absolute top-0 left-0"
            style={{
              width: "100%",
              height: `${borderWidth}px`,
              background: `linear-gradient(to left, ${borderColor} 50%, transparent 10%)`,
            }}
          ></div>

          {/* Half Left Border (top half invisible) */}
          <div
            className="absolute top-0 left-0"
            style={{
              width: `${borderWidth}px`,
              height: "100%",
              background: `linear-gradient(to top, ${borderColor} 80%, transparent 50%)`,
            }}
          ></div>

          {/* Top-left cut corner */}
        </div>

        {/* Product Image Container (now handles the rounded corner for the image) */}
        <div
          className="relative z-10 w-full h-[250px] overflow-hidden"
          style={{ borderBottomRightRadius: imageBorderRadius }}
        >
          <Image
            src={product.media[0]}
            alt="product"
            // Removed direct rounded-br-5xl from Image component
            fill // Use 'fill' to make image cover parent, 'object-cover' will work with it
            className="object-cover"
          />
        </div>

        <div className="w-64 rounded-xl  shadow-sm p-4 bg-white bg-opacity-20 relative "> 
          {/*card*/}

          {/* Product Info */}
          <div className="mt-2">
            <p className="text-base-bold font-open-sans">
              {product.title}
              </p>
            <p className="text-small-medium text-grey-2 font-open-sans">
              {product.category} 
            </p>
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className="text-body-bold font-open-sans">{formatDZD(product.price)}</p>
            <HeartFavorite
              product={product}
              updateSignedInUser={updateSignedInUser}
            />
          </div>
        </div>
      </div>
    ) : (
      // Out of Stock section
      <>
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
            src="/Epuise.png"
            className="absolute top-3 left-3 pointer-events-none"
            width={150}
            height={200}
          />
        </div>
        <div className="w-64 rounded-xl  shadow-sm p-4 bg-white bg-opacity-20 relative "> 

        <div>
          <p className="text-base-bold">{product.title}</p>
          <p className="text-small-medium text-grey-2">
            {product.category}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-body-bold">{formatDZD(product.price)}</p>
          <p className="text-red-500 text-small-bold">Epuisé</p>
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        </div>
        </div>
      </>
    )}
  </Link>
);
};

export default ProductCard;