"use client"

import useCart from "@/lib/hooks/useCart"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { MinusCircle, PlusCircle, Trash, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { formatDZD } from "@/lib/actions/actions"
import { availability } from "@/lib/actions/actions"
import CheckoutForm from "@/components/CheckoutForm"
import { tcheckoutschema } from "@/components/CheckoutForm"
import toast from "react-hot-toast"

interface CartItemWithFreshStock {
  item: any
  quantity: number
  color?: string
  size?: string
  currentStock?: number
  isLoading?: boolean
}


const Cart = () => {
  const [shipInfo, setShipInfo] = useState<tcheckoutschema>();

  const router = useRouter()
  const { user } = useUser()
  const cart = useCart()
  const [cartItemsWithFreshStock, setCartItemsWithFreshStock] = useState<CartItemWithFreshStock[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch fresh stock data for all cart items
  const fetchFreshStockData = async () => {
    setIsRefreshing(true)
    try {
      const updatedItems = await Promise.all(
        cart.cartItems.map(async (cartItem) => {
          try {
            // Fetch fresh product data from API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${cartItem.item._id}`)
            if (response.ok) {
              const freshProduct = await response.json()
              return {
                ...cartItem,
                currentStock: freshProduct.stock,
                isLoading: false,
              }
            }
          } catch (error) {
            console.error(`Error fetching stock for ${cartItem.item._id}:`, error)
          }

          // Fallback to original stock if fetch fails
          return {
            ...cartItem,
            currentStock: cartItem.item.stock,
            isLoading: false,
          }
        }),
      )

      setCartItemsWithFreshStock(updatedItems)
    } catch (error) {
      console.error("Error refreshing stock data:", error)
      // Fallback to original cart items
      setCartItemsWithFreshStock(
        cart.cartItems.map((item) => ({
          ...item,
          currentStock: item.item.stock,
          isLoading: false,
        })),
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh stock when component mounts or becomes visible
  useEffect(() => {
    if (cart.cartItems.length > 0) {
      fetchFreshStockData()
    } else {
      setCartItemsWithFreshStock([])
    }

    // Auto-refresh when user comes back to the tab/page
    const handleVisibilityChange = () => {
      if (!document.hidden && cart.cartItems.length > 0) {
        fetchFreshStockData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, []) // Only run on mount

  // Sync cart items with fresh stock data whenever cart changes
  useEffect(() => {
    if (cart.cartItems.length === 0) {
      setCartItemsWithFreshStock([])
      return
    }

    // Update quantities in cartItemsWithFreshStock to match current cart
    setCartItemsWithFreshStock((prevItems) => {
      return cart.cartItems.map((cartItem) => {
        const existingItem = prevItems.find((item) => item.item._id === cartItem.item._id)
        return {
          ...cartItem,
          currentStock: existingItem?.currentStock ?? cartItem.item.stock,
          isLoading: existingItem?.isLoading ?? false,
        }
      })
    })
  }, [cart.cartItems])

  const total = cartItemsWithFreshStock.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0)
  const totalRounded = Number.parseFloat(total.toFixed(2))

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  }

  const getdata = (data: tcheckoutschema) => { //data from child form
    setShipInfo(data);
    { data ? toast("clicked") : toast("not yet clicked") };

  }

  // checkout handling takes u to form fill in info and then send whats app message with all data to owner who calls and confirms order then ships it
  const handleCheckout = async () => {
    try {
      // Check if any items are out of stock before checkout
      const outOfStockItems = cartItemsWithFreshStock.filter(
        (cartItem) => !availability(cartItem.currentStock || 0) || cartItem.quantity > (cartItem.currentStock || 0),
      )

      if (outOfStockItems.length > 0) {
        alert("Some items in your cart are out of stock or exceed available quantity. Please update your cart.")
        return
      }

      //send info to api
      console.log("API URL", `${process.env.NEXT_PUBLIC_API_URL}/checkout`)

      console.log("Sending checkout data:", {
        cartItems: cart.cartItems,
        customer,
        shipInfo,
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        body: JSON.stringify({ cartItems: cart.cartItems, customer, shipInfo }),
        headers: {
          "Content-Type": "application/json",
        }
      })

      //result from backend
      const data = await res.json()
      // window.location.href = data.url
      console.log(data)

      // in case of error
    } catch (err) {
      console.log("[checkout_POST] from front end", err)
    }
  }

  //checks stock befor adding item quantity in cart
  const handleQuantityIncrease = (itemId: string) => {
    const cartItem = cartItemsWithFreshStock.find((item) => item.item._id === itemId)
    const currentStock = cartItem?.currentStock ?? cartItem?.item.stock ?? 0

    if (cartItem && cartItem.quantity < currentStock) {
      cart.increaseQuantity(itemId)
    } else {
      alert("Cannot add more items. Stock limit reached.")
    }
  }

    const handleQuantityDecrease = (itemId: string) => {
    const cartItem = cartItemsWithFreshStock.find((item) => item.item._id === itemId)

    if (cartItem && cartItem.quantity > 0) {
      cart.decreaseQuantity(itemId)
    } else {
      alert("Can't go below 0 please click delete button if u want to remove item.")
    }
  }

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <div className="flex items-center justify-between">
          <p className="text-heading3-bold">Shopping Cart</p>
          <button
            onClick={fetchFreshStockData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Stock
          </button>
        </div>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cartItemsWithFreshStock.map((cartItem) => {
              const currentStock = cartItem.currentStock ?? cartItem.item.stock
              const isInStock = availability(currentStock)
              const exceedsStock = cartItem.quantity > currentStock

              return (
                <div
                  key={cartItem.item._id}
                  className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
                >
                  <div className="flex items-center">
                    <Image
                      src={cartItem.item.media[0] || "/placeholder.svg"}
                      width={100}
                      height={100}
                      className="rounded-lg w-32 h-32 object-cover"
                      alt="product"
                    />
                    <div className="flex flex-col gap-3 ml-4">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${isInStock ? "text-green-600" : "text-red-600"}`}>
                          {isInStock ? `In Stock: ${currentStock}` : "Out of Stock"}
                        </p>
                        {cartItem.isLoading && <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />}
                      </div>

                      <p className="text-body-bold">{cartItem.item.title}</p>
                      {cartItem.color && <p className="text-small-medium">{cartItem.color}</p>}
                      {cartItem.size && <p className="text-small-medium">{cartItem.size}</p>}

                      <p className="text-small-medium">{formatDZD(cartItem.item.price)}</p>

                      {exceedsStock && (
                        <p className="text-red-600 text-xs">Quantity exceeds available stock ({currentStock})</p>
                      )}
                    </div>
                  </div>

                  {isInStock && !exceedsStock ? (
                    <div className="flex gap-4 items-center">
                      <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => handleQuantityDecrease(cartItem.item._id)}
                      />

                      <p className="text-body-bold">{cartItem.quantity}</p>

                      <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => handleQuantityIncrease(cartItem.item._id)}
                      />
                    </div>

                  ) : (

                    <div className="flex gap-4 items-center">
                     
                        <MinusCircle
                          className="text-gray-400 cursor-not-allowed" />

                      

                        <MinusCircle
                          className="hover:text-red-1 cursor-pointer"
                          onClick={() => handleQuantityDecrease(cartItem.item._id)} />

                      

                      <p className="text-body-bold">{cartItem.quantity}</p>
                      <PlusCircle className="text-gray-400 cursor-not-allowed" />
                    </div>
                  )}

                  <Trash
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.removeItem(cartItem.item._id)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary <span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"})`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>{formatDZD(totalRounded)}</span>
        </div>

        {/* Show warning if any items are problematic */}
        {cartItemsWithFreshStock.some(
          (item) => !availability(item.currentStock || 0) || item.quantity > (item.currentStock || 0),
        ) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">
                ⚠️ Some items are out of stock or exceed available quantity. Please update your cart before checkout.
              </p>
            </div>
          )}

        <CheckoutForm getdata={getdata} />

        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCheckout}
          disabled={cartItemsWithFreshStock.some(
            (item) => !availability(item.currentStock || 0) || item.quantity > (item.currentStock || 0),
          )}
        >
          Proceed to Checkout
        </button>
        <p> here is info{JSON.stringify(shipInfo)}</p>

      </div>
    </div>
  )
}

export default Cart
