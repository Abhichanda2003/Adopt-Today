import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";

import { getSingleProduct, sendMail } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
//import nodemailer from 'nodemailer';

import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const ProductDetailsSection = (props) => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext); // Layout Context

  const sProduct = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0); // Slide change state

  const [quantitiy, setQuantitiy] = useState(1); // Increse and decrese quantity state
  const [, setAlertq] = useState(false); // Alert when quantity greater than stock

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  ); // Wishlist State Control

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send email using serverless function
    const petName = sProduct.pName;

    let response = await sendMail({
      email,
      phone,
      id,
      petName,
    });

    if (response.status == 200) {
      console.log("Email sent successfully!");
      // history.push("/contact-us");
      setEmailSent(true);

      // Handle success case, e.g., show a success message to the user
    } else {
      console.log("Failed to send email");
      // Handle failure case, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        if (responseData.Product) {
          layoutDispatch({
            type: "singleProductDetail",
            payload: responseData.Product,
          }); // Dispatch in layout context
          setPimages(responseData.Product.photos);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() }); // This function change cart in cart state
        }
        if (responseData.error) {
          console.log(responseData.error);
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
    fetchCartProduct(); // Updating cart total
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products }); // Layout context Cartproduct fetch and dispatch
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (data.loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  } else if (!sProduct) {
    return <div>No product</div>;
  }
  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory._id,
          product: sProduct.pName,
          category: sProduct.pCategory.cName,
        }}
      />
      <section className="m-4 md:mx-12 md:my-6">
        <div className="grid grid-cols-2 md:grid-cols-12">
          <div className="hidden md:block md:col-span-1 md:flex md:flex-col md:space-y-4 md:mr-2">
            <img
              onClick={(e) =>
                slideImage("increase", 0, count, setCount, pImages)
              }
              className={`${
                count === 0 ? "" : "opacity-25"
              } cursor-pointer w-20 h-20 object-cover object-center`}
              src={sProduct.photos[0].secure_url}
              alt="pic"
            />
            <img
              onClick={(e) =>
                slideImage("increase", 1, count, setCount, pImages)
              }
              className={`${
                count === 1 ? "" : "opacity-25"
              } cursor-pointer w-20 h-20 object-cover object-center`}
              src={sProduct.photos[1].secure_url}
              alt="pic"
            />
          </div>
          <div className="col-span-2 md:col-span-7">
            <div className="relative">
              <img
                style={{ width: "500px", height: "500px" }}
                src={sProduct.photos[count].secure_url}
                alt="Pic"
              />
              <div className="absolute inset-0 flex justify-between items-center mb-4">
                <svg
                  onClick={(e) =>
                    slideImage("increase", null, count, setCount, pImages)
                  }
                  className="flex justify-center  w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <svg
                  onClick={(e) =>
                    slideImage("increase", null, count, setCount, pImages)
                  }
                  className="flex justify-center  w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-span-2 mt-8 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
            <div className="flex flex-col leading-8">
              <div className="text-2xl tracking-wider">{sProduct.pName}</div>
              <div className="flex justify-between items-center">
                <span className="text-xl tracking-wider text-yellow-700">
                  Age {sProduct.pPrice}
                </span>
                <span>
                  <svg
                    onClick={(e) => isWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      isWish(sProduct._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    onClick={(e) => unWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      !isWish(sProduct._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="my-4 md:my-6 text-gray-600">
              {sProduct.pDescription}
            </div>
            <Fragment>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col py-2">
                  <label htmlFor="address" className="pb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    className="border px-4 py-2"
                  />
                </div>
                <div className="flex flex-col py-2 mb-2">
                  <label htmlFor="phone" className="pb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="phone"
                    className="border px-4 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                  style={{ background: "#303031" }}
                >
                  I wanna Adobt
                </button>
                {emailSent && (
                  <p style={{ margin: "10px" }}>
                    Email has been Received and we will Contact You Soon
                  </p>
                )}
              </form>
            </Fragment>
            {/* Incart and out of stock button End */}
          </div>
        </div>
      </section>
      {/* Product Details Section two */}
      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;
