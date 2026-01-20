import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

import DropIn from "braintree-web-drop-in-react";

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
    instance: null,
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="text-3xl font-semibold">Donate</div>
            <div className="text-gray-600 mt-1">
              Your donation helps us care for more animals.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded p-6">
              <div className="text-lg font-semibold">Why donate?</div>
              <div className="text-gray-600 mt-2 leading-relaxed">
                Donations support food, vaccinations, rescue efforts, and shelter
                supplies for pets in need.
              </div>
              <div className="mt-6 border rounded p-4 bg-gray-50">
                <div className="text-sm font-semibold">Quick tips</div>
                <div className="text-sm text-gray-600 mt-2">
                  Use a valid email and phone number. After the gateway loads,
                  choose a payment method and click Pay now.
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded p-6">
              <div className="text-lg font-semibold mb-4">Donation details</div>

              <div onBlur={() => setState({ ...state, error: false })}>
                {state.error ? (
                  <div className="bg-red-100 text-red-700 py-2 px-4 rounded mb-4">
                    {state.error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium mb-2">
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
                      type="email"
                      id="email"
                      className="border rounded px-4 py-2"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-sm font-medium mb-2">
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
                      type="tel"
                      id="phone"
                      className="border rounded px-4 py-2"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="amount" className="text-sm font-medium mb-2 block">
                    Amount (INR)
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
                    className="border rounded px-4 py-2 w-full"
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className="mt-5">
                  {state.clientToken ? (
                    <div className="border rounded p-3">
                      <DropIn
                        options={{
                          authorization: state.clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) =>
                          setState((prev) => ({ ...prev, instance }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-900 px-4 py-3 rounded">
                      Payment gateway not ready. Please wait...
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    pay(
                      data,
                      dispatch,
                      state,
                      setState,
                      getPaymentProcess,
                      history
                    )
                  }
                  type="button"
                  className="w-full mt-5 px-4 py-3 rounded bg-black text-white font-semibold"
                >
                  Pay now
                </button>
              </div>
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

