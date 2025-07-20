"use client";

import useCart from "@/lib/hooks/useCart";

import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="sticky top-0 z-10 py-2 px-10 flex gap-2 justify-between items-center max-sm:px-2 bg-[#77c0bf]">
      <Link href="/">
        <Image src="/logo1.png" alt="logo" width={130} height={100} />
      </Link>

      <div className="flex gap-4 text-base-bold max-lg:hidden">
        <Link
          href="/"
          className={`hover:text-[#29465b] text-white ${pathname === "/" && "text-red-1"
            }`}
        >
          Home
        </Link>
        <Link
          href={user ? "/wishlist" : "/sign-in"}
          className={`hover:text-[#29465b] text-white ${pathname === "/wishlist" && "text-red-1"
            }`}
        >
          Wishlist
        </Link>
        <Link
          href={user ? "/orders" : "/sign-in"}
          className={`hover:text-[#29465b] text-white ${pathname === "/orders" && "text-red-1"
            }`}
        >
          Orders
        </Link>
      </div>

      {//search bar
      }
      <div className=" bg-white flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
        <input
          className="outline-none max-sm:max-w-[120px] "
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={query === ""}
          onClick={() => router.push(`/search/${query}`)}
        >
          <Search className="cursor-pointer h-4 w-4 hover:text-red-" />
        </button>
      </div>


      <div className="relative flex gap-3 items-center">
        <Link
          href="/cart"
          className="flex items-center gap-3  rounded-lg px-2 py-1 hover:bg-[#29465b] hover:text-white"
        >
          <ShoppingCart className="text-white" />

          {/*<CartIcon count={cart.cartItems.length}/>*/}

          <p className="text-white text-base-bold ">({cart.cartItems.length})</p>
        </Link>

        <Menu
          className="cursor-pointer lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-[#77c0bf] text-base-bold lg:hidden">
            <Link href="/" className="text-white hover:text-[#29465b]">
              Home
            </Link>
            <Link
              href={user ? "/wishlist" : "/sign-in"}
              className="text-white hover:text-[#29465b]"
            >
              Wishlist
            </Link>
            <Link
              href={user ? "/orders" : "/sign-in"}
              className="text-white hover:text-[#29465b]"            >
              Orders
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-[#29465b] hover:text-white"
            >
              <ShoppingCart className="text-white" />
              <p className="text-white text-base-bold ">Panier ({cart.cartItems.length})</p>
            </Link>
          </div>
        )}

        {user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <CircleUserRound />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
