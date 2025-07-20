"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDZD } from "@/lib/actions/actions"; // assuming this is safe for client use
import toast from "react-hot-toast";
import Link from "next/link";

const Orders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (status: string, orderId: string) => { // pass order id here
    if (status === "New Order") {

      try {
        setLoading(true)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId })
        }
        );

        if (res.ok) {
          toast.success("Order canceled ");
        } else {
          const text = await res.text();
          console.error("Server responded with:", text);
          throw new Error(`Failed with status ${res.status}`);
        }

      } catch (err) {

        console.error("Cancel error:", err);
        toast.error("Cancel failed");

      } finally {

        setLoading(false)

      }


    } else if (status === "Confirmed") {
      toast.error("You can't cancel confirmed orders");

    } else {
      toast.error("Order already canceled");

    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {orders.length === 0 && (
        <p>You have no orders yet.</p>
      )}

      <div className="flex flex-col gap-10">
        {orders.map((order: OrderType) => (
          <div key={order._id} className="flex flex-col gap-8 p-4 hover:bg-grey-1">
            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
              <p className="text-base-bold">Order ID: {order._id}</p>
              <p className="text-base-bold">
                Total Amount: {formatDZD(order.totalAmount)}
              </p>
              <p className="text-base-bold">
                Status:
                {order.status === "Canceled" ? (
                  <span className="text-red-600 text-base-medium">  {order.status}</span>
                ) : (
                  <span className="text-green-600 text-base-medium">  {order.status}</span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType, index: number) => (
                <Link
                  href={`/products/${orderItem.product._id}`}>
                  <div key={index} className="flex gap-4 hover:bg-[#29465b]">
                    <Image
                      src={orderItem.product.media[0]}
                      alt={orderItem.product.title}
                      width={100}
                      height={100}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-small-medium">
                        Title: <span className="text-small-bold">{orderItem.product.title}</span>
                      </p>
                      {orderItem.color && (
                        <p className="text-small-medium">
                          Color: <span className="text-small-bold">{orderItem.color}</span>
                        </p>
                      )}
                      {orderItem.size && (
                        <p className="text-small-medium">
                          Size: <span className="text-small-bold">{orderItem.size}</span>
                        </p>
                      )}
                      <p className="text-small-medium">
                        Unit price:{" "}
                        <span className="text-small-bold">{formatDZD(orderItem.product.price)}</span>
                      </p>
                      <p className="text-small-medium">
                        Quantity: <span className="text-small-bold">{orderItem.quantity}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              <button
                disabled={loading}
                className="bg-red-600 text-white rounded-lg w-full sm:w-48 h-10 "
                onClick={() => handleCancel(order.status, order._id)}
              >
                Cancel order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
