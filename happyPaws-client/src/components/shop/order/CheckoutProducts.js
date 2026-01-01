import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

import DropIn from "braintree-web-drop-in-react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
   
  const [state, setState] = useState({
    email: "",
    phone: "",
    error: false,
    success: false,
    amount: "",
    clientToken: null,
    instance: {},
  });

  useEffect(() => {
   fetchData(cartListProduct, dispatch);
   fetchbrainTree(getBrainTreeToken, setState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        Please wait untill finish
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Donate Us</div>
        {/* Product List */}
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          
          <div className="w-full order-first md:order-last md:w-1/2">
          <div className="w-full order-first md:order-last md:w-1/2">
              <Fragment>
              <div
                  onBlur={(e) => setState({ ...state, error: false })}
                  className="p-4 md:p-8"
                >
                  {state.error ? (
                    <div className="bg-red-200 py-2 px-4 rounded">
                      {state.error}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col py-2">
                    <label htmlFor="Email" className="pb-2">
                      Email
                    </label>
                    <input
                      value={state.email}
                      onChange={(e) =>
                        setState({
                          ...state,
                          email: e.target.value,
                          error: false,
                        })
                      }
                      type="text"
                      id="email"
                      className="border px-4 py-2"
                      placeholder="Email..."
                    />
                  </div>
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="phone" className="pb-2">
                      Phone
                    </label>
                    <input
                      value={state.phone}
                      onChange={(e) =>
                        setState({
                          ...state,
                          phone: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="phone"
                      className="border px-4 py-2"
                      placeholder="+91"
                    />
                  </div>
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="phone" className="pb-2">
                      Amount in Rs.
                    </label>
                    <input
                      value={state.amount}
                      onChange={(e) =>
                        setState({
                          ...state,
                          amount: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="amount"
                      className="border px-4 py-2"
                      placeholder="100"
                    />
                  </div>
                  <DropIn
                    options={{
                      authorization: state.clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => (state.instance = instance)}
                  />
                  <div
                    onClick={(e) =>
                      pay(
                        data,
                        dispatch,
                        state,
                        setState,
                        getPaymentProcess,
                        history
                      )
                    }
                    className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                    style={{ background: "#303031" }}
                  >
                    Pay now
                  </div>
                </div>
              </Fragment>


          </div>
        </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = () => {

  return (
 <div></div>

  );
};

export default CheckoutProducts;

