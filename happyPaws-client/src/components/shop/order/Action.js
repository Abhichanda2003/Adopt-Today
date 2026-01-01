import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    console.log("responseData", responseData);
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log("responseData token", responseData.clientToken);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
 
  history
) => {
  console.log(state, data);
  if (!state.email) {
    setState({ ...state, error: "Please provide your Email" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else if (!state.amount) {
    setState({ ...state, error: "Please Donate some money" });
  } else {  
    let nonce;
    console.log("instance:", state.instance);
    state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: false });
        nonce = data.nonce;
        let paymentData = {
          amountTotal: state.amount,
          paymentMethod: nonce,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res) {
              let orderData = {
                user: JSON.parse(localStorage.getItem("jwt")).user._id,
                amount: res.transaction.amount,
                transactionId: res.transaction.id,
                email: state.email,
                phone: state.phone,
              };
              try {
                let resposeData = await createOrder(orderData);
                if (resposeData.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ clientToken: "", instance: {} });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (resposeData.error) {
                  console.log(resposeData.error);
                }
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
        setState({ ...state, error: error.message }); 
      });
  }
};
