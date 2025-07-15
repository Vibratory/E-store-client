"use client";

import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import { formatDZD } from "@/lib/actions/actions";
import useCart from "@/lib/hooks/useCart";


const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  return (

    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-heading3-bold">{productInfo.title}</p>
        <HeartFavorite product={productInfo} />
      </div>

      <div className="flex gap-2">
        <p className="text-base-medium text-grey-2">Category:</p>
        <p className="text-base-bold">{productInfo.category}</p>
      </div>


      <p className="text-heading3-bold"> {formatDZD(productInfo.price)} </p>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Description:</p>
        <p className="text-small-medium">{productInfo.description}</p>
      </div>

      {productInfo.colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Colors:</p>
          <div className="flex gap-2">
            {productInfo.colorVariants.map((colorVariants, index) => (
              <div>
                <p key={index}
                  className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${selectedColor === colorVariants.name && "bg-black text-white"}`}
                  onClick={() => setSelectedColor(colorVariants.name)}
                >
                  {colorVariants.name}
                </p>
              </div>
            ))}

          </div>
        </div>
      )}

      <p className="text-base-medium text-grey-2">Sizes:</p>

      {//drop down menu
      }
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="border border-black px-3 py-2 rounded"
      >
        <option value="">--Please choose an option--</option>

        {productInfo.colorVariants.find((color) => color.name === selectedColor)
          ?.sizes.map((size, index) => (
            <div>
              {size.quantity != 0 ? <option key={index} value={size.name}>
                {size.name}
              </option> 
              :
               <option  disabled key={index} value={size.name}>
               {size.name} Epuise
              </option> 
              
              }
              
            </div>

          ))}


      </select>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Quantity:</p>
        <div className="flex gap-4 items-center">
          <MinusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          />
        </div>
      </div>
      
      <button
      className={`outline text-base-bold py-3 rounded-lg transition 
    ${(!selectedColor || !selectedSize) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-black hover:text-white"}`}

        onClick={() => {
          if (!selectedColor || !selectedSize) return;
              cart.addItem({
                item: productInfo,
                quantity,
                color: selectedColor,
                size: selectedSize,
              }) 
          }
        }
        disabled={!selectedColor || !selectedSize}
      >

        <p>Add to cart</p> 

      </button>
    </div>
  );
};

export default ProductInfo;
