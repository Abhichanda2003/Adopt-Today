import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getSingleProduct = async (pId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/single-product`, {
      pId: pId,
    });
    return res.data;
    
  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/product/all-product`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMatchExplanation = async ({ userProfile, pet }) => {
  try {
    let res = await axios.post(`${apiURL}/api/matchmaker/explain`, {
      userProfile,
      pet,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Failed to generate AI explanation",
    };
  }
};

export const sendMail = async ({email,phone,id, petName}) => {
  try {
    console.log("inside send mail");
    console.log({email,phone,id,petName})
    let res = await axios.post(`${apiURL}/api/Send-email/handler`,{email,phone,id, petName});
    //sconsole.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postAddReview = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/add-review`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postDeleteReview = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/delete-review`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
