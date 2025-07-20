"use client";

import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import { formatDZD } from "@/lib/actions/actions";
import useCart from "@/lib/hooks/useCart";
import { ShoppingCart } from "lucide-react";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  return (

    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">

        <div className="flex gap-8">
          <p className="text-base-bold">{productInfo.category}                   </p>
          <HeartFavorite product={productInfo} />
        </div>
      </div>

      <p className="text-[#242d3f] text-heading3-bold font-open-sans "> {productInfo.title}</p>


      <div className="flex flex-col gap-2">
        <p className="text-small-medium">{productInfo.description}</p>
      </div>

      <p className="text-heading3-bold"> {formatDZD(productInfo.price)} </p>

      {productInfo.colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
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


      {//drop down menu
      }
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="border border-black px-3 py-2 rounded bg-[#fdf3e8]"
      >
        <option value="">Sélectionnez une taille</option>

        {productInfo.colorVariants.find((color) => color.name === selectedColor)
          ?.sizes.map((size, index) => (
            <div>
              {size.quantity != 0 ? <option key={index} value={size.name}>
                {size.name}
              </option>
                :
                <option disabled key={index} value={size.name}>
                  {size.name} Epuisé
                </option>

              }

            </div>

          ))}


      </select>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Quantité:</p>
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
        className={`outline text-base-bold py-1 rounded-lg transition text-justify w-40
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

        <ShoppingCart className="p-0 m-0" />
        <p>
          Ajouter au panier</p>

      </button>
    </div>
  );
};

export default ProductInfo;
