import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")).token : false;

const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

export const getBrainTreeToken = async () => {
  let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
  console.log("in getBrainTreeToken");

  try {
    let res = await axios.post(`${apiURL}/api/braintree/get-token`, {
      uId: uId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Failed to load payment gateway token",
    };
  }
};

export const getPaymentProcess = async (paymentData) => {
  console.log("in getPaymenyProcess");

  try {
    let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Payment request failed",
    };
  }
};

export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/order/create-order`,
      orderData,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Failed to save donation order",
    };
  }
};
