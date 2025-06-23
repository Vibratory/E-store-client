import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(3),
  number: z.string().min(10, "10 digits minimum").max(10, "10 digits max"),
  email: z.string().email(),
  state: z.string(),
  city: z.string(),
  zip: z.string().min(5, "5 digits minimum").max(5, "5 digits max"),

}) /*.refine((data) => data.zip === data.zip, {
    message: "Passwords don't match",
    path: ["zip"], // path of error
  });*/


export type tcheckoutschema = z.infer<typeof checkoutSchema>;

type CheckoutFormProps = {
  getdata: (data: tcheckoutschema) => void;
};

const CheckoutForm = ({ getdata }: CheckoutFormProps) => {

  const {
    register,

    handleSubmit,

    reset,

    formState: { errors, isSubmitting }

  } = useForm<tcheckoutschema>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: tcheckoutschema) => {
    getdata(data); // send to parent
    //reset();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          {...register("name")}
          placeholder="Name"
          className="">
        </input>
        {errors.name && (
          <p className="text-red-600"> {`${errors.name.message}`}</p>
        )}

        <input
          {...register("number")}
          type="number"
          placeholder="number"
          className="top-10">
        </input>

        {errors.number && (
          <p className="text-red-600"> {`${errors.number.message}`}</p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="">
        </input>

        {errors.email && (
          <p className="text-red-600"> {`${errors.email.message}`}</p>
        )}

        <input
          {...register("state")}
          placeholder="State"
          className="">
        </input>

        <input
          {...register("city")}
          placeholder="City"
          className="">
        </input>

        <input
          {...register("zip",)}
          type="number"
          placeholder="Zip"
          className="">
        </input>

        {errors.zip && (
          <p className="text-red-600"> {`${errors.zip.message}`}</p>
        )}


        <button disabled={isSubmitting}
        
          type="submit"
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>

      </form>


    </div>

  );


};
export default CheckoutForm;