"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

type SortedFilteredProps = {
  products: ProductType[];
};

export const SortedFiltered = ({ products }: SortedFilteredProps) => {
  const [sortBy, setSortBy] = useState("default");
  const [filterByColor, setFilterByColor] = useState("all");
  const [filterBySize, setFilterBySize] = useState("all");

  const filteredProducts = products
    .filter((product: ProductType) => {
      if (filterByColor !== "all") {
        return product.colorVariants.some((c) => c.name === filterByColor);
      }
      return true;
    })
    .filter((product: ProductType) => {
      if (filterBySize !== "all") {
        return product.colorVariants.some((c) =>
          c.sizes.some((s) => s.name === filterBySize)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.newprice ?? a.price) - (b.newprice ?? b.price);
      } else if (sortBy === "price-desc") {
        return (b.newprice ?? b.price) - (a.newprice ?? a.price);
      } else if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

  const uniqueColors = Array.from(
    new Set(products.flatMap((p) => p.colorVariants.map((c) => c.name)))
  );

  const uniqueSizes = Array.from(
    new Set(
      products.flatMap((p) =>
        p.colorVariants.flatMap((c) => c.sizes.map((s) => s.name))
      )
    )
  );

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded bg-[#fdf3e8]"
        >
          <option value="default">Trier par</option>
          <option value="price-asc">Prix Croissant</option>
          <option value="price-desc">Prix Décroissant</option>
          <option value="newest">Nouveautés</option>
        </select>

        <select
          value={filterByColor}
          onChange={(e) => setFilterByColor(e.target.value)}
          className="px-3 py-2 rounded bg-[#fdf3e8]"
        >
          <option value="all">Toutes les couleurs</option>
          {uniqueColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <select
          value={filterBySize}
          onChange={(e) => setFilterBySize(e.target.value)}
          className="px-3 py-2 rounded bg-[#fdf3e8]"
        >
          <option value="all">Toutes les tailles</option>
          {uniqueSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
