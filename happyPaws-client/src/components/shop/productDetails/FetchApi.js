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
