import { getCollections } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">

      <p className="text-[#fdf3e8] text-heading1-bold  font-tsukimi-rounded  md:mr-[62%] bg-[#67bac0] p-4 rounded-br-[40px] pt-1 pb-5">
        Categories
        </p>

      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No categories found</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-6 ">
          {collections.map((collection: CollectionType) => (
            <Link
             href={`/collections/${collection._id}`}
             key={collection._id}
              className="w-[200px] md:w-[250px] lg:w-[280px]"
              >
              <Image
                src={collection.image}
                alt={collection.title}
                width={280}
                height={160}
                className="w-full rounded-lg cursor-pointer hover:shadow-bottom-only-hover  object-cover transition-transform duration-300 ease-out 
         hover:-translate-y-2"

              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
