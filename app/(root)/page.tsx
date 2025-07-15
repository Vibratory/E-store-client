import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Image src="/banner1.avif" alt="banner" width={2000} height={1000} className="object-contain md:object-cover" />
      <Collections />

      {// <New Collections/>
      }
 
 {// <Sale carousel/>
      }


      <ProductList />
    </>
  );
}

export const dynamic = "force-dynamic";

