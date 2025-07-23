"use client";

import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { Price } from "./Price";
import Link from "next/link";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();


  const LinkGet = (title : string) => { // to be chnged later id same as title
    switch (title) {
      case "Garçons":
        return "/collections/6857033cb509029e40ff3557";
      case "Filles":
        return "/collections/687a974f68702fe15ce75380";
      case "Chaussures":
        return "/collections/687a87e868702fe15ce73f24";
      case "Bébé":
        return "/collections/6867d8bece179ecb327d858a";
      default:
        return "/";
    }
  };

  return (

    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-8">

          {productInfo.collections.map((collection : CollectionType) => {

            const collectionlink = LinkGet(collection.title);
            /*make tthese loinks clickable */

            return (
              <div>
                <Link href="/" className="hover:opacity-50"> Acceuill {">"}</Link>

                <Link href={collectionlink} key={collection._id} className="hover:opacity-50" > {collection.title} {">"}
                </Link>
                <Link href="/" key={collection._id} className="hover:opacity-50" > {productInfo.category} {">"}
                </Link>
              </div>
            )

          })}
          <div className="right-0"><HeartFavorite product={productInfo} /></div>
        </div>
      </div>

      <p className="text-[#242d3f] text-heading3-bold font-open-sans "> {productInfo.title}</p>


      <div className="flex flex-col gap-2">
        <p className="text-small-medium">{productInfo.description}</p>
      </div>

      <p className="text-heading3-bold"><Price
        price={productInfo.price}
        solde={productInfo.solde}
        newprice={productInfo.newprice}
      /></p>

      {productInfo.colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {productInfo.colorVariants.map((colorVariants, index) => (
              <div key={index}>
                <p
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
        className="  px-3 py-2 rounded bg-[#fdf3e8]"
      >
        <option value="">Sélectionnez une taille</option>

        {productInfo.colorVariants.find((color) => color.name === selectedColor)
          ?.sizes.map((size, index) =>
            size.quantity !== 0 ? (
              <option key={index} value={size.name}>
                {size.name}
              </option>
            ) : (
              <option key={index} value={size.name} disabled>
                {size.name} Épuisé
              </option>
            )
          )}


      </select>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Quantité:</p>
        <div className="flex gap-4 items-center">
          <MinusCircle
            className="hover:text-green-600 cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className="hover:text-green-600 cursor-pointer"
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
