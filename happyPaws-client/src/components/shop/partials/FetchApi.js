import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const cartListProduct = async () => {
  let carts = JSON.parse(localStorage.getItem("cart"));
  let productArray = [];
  if (carts) {
    for (const cart of carts) {
      productArray.push(cart.id);
    }
  }
  try {
    console.log(productArray)
    let res = await axios.post(`${apiURL}/api/product/cart-product`, {
      productArray,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
