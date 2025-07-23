import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import Image from "next/image";
import React from "react";
import { SortedFiltered } from "@/components/FilterSortProducts";

const CollectionDetails = async ({
  params,
}: {
  params: { collectionId: string };
}) => {

  const collectionDetails = await getCollectionDetails(params.collectionId);

  return (
    <div className="px-10 py-5 flex flex-col items-center gap-8">
      <Image
        src={collectionDetails.image}
        width={1500}
        height={1000}
        alt="collection"
        className="w-full h-[400px] object-cover rounded-xl"
      />
      
      <p className="text-heading3-bold  text-[#242d3f] "> {collectionDetails.title}</p>
       <div className="flex flex-wrap gap-16 justify-center">

        {/*sort by and filter */}
        <SortedFiltered
          products={collectionDetails.products} />
          <p> products {JSON.stringify(collectionDetails.products)}</p>

        {/** {collectionDetails.products.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}*/}
      </div>
    </div>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

