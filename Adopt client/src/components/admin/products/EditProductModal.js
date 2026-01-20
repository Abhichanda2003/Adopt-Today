import React, { Fragment, useContext, useEffect, useState } from "react";
import { ProductContext } from "./index";
import { editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const EditProductModal = () => {
  const { data, dispatch } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);

  const [editformData, setEditformdata] = useState({
    pId: "",
    pName: "",
    pDescription: "",
    pImages: [],
    pEditImages: [],
    pStatus: "Active",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: "",
  });

  /* Fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategory();
      if (res?.Categories) setCategories(res.Categories);
    };
    fetchCategories();
  }, []);

  /* Load product data when modal opens */
  useEffect(() => {
    if (data.editProductModal?.modal) {
      setEditformdata({
        pId: data.editProductModal.pId || "",
        pName: data.editProductModal.pName || "",
        pDescription: data.editProductModal.pDescription || "",
        pImages: data.editProductModal.pImages || [],
        pEditImages: [],
        pStatus: data.editProductModal.pStatus || "Active",
        pCategory: data.editProductModal.pCategory?._id || "",
        pQuantity: data.editProductModal.pQuantity || "",
        pPrice: data.editProductModal.pPrice || "",
        pOffer: data.editProductModal.pOffer || "",
      });
    }
  }, [data.editProductModal]);

  /* Refresh products */
  const refreshProducts = async () => {
    const res = await getAllProduct();
    if (res?.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: res.Products,
      });
    }
  };

  /* SUBMIT FORM (🔥 FIXED WITH FORMDATA 🔥) */
  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("pId", editformData.pId);
    formData.append("pName", editformData.pName);
    formData.append("pDescription", editformData.pDescription);
    formData.append("pStatus", editformData.pStatus);
    formData.append("pCategory", editformData.pCategory);
    formData.append("pPrice", editformData.pPrice);
    formData.append("pQuantity", editformData.pQuantity || 1);
    formData.append("pOffer", editformData.pOffer || 0);

    if (editformData.pEditImages.length > 0) {
      editformData.pEditImages.forEach((file) => {
        formData.append("pImages", file);
      });
    }

    try {
      const res = await editProduct(formData);
      if (res?.success) {
        refreshProducts();
        dispatch({ type: "editProductModalClose", payload: false });
        alert("Pet updated successfully");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  if (!data.editProductModal?.modal) return null;

  return (
    <Fragment>
      {/* Overlay */}
      <div
        onClick={() =>
          dispatch({ type: "editProductModalClose", payload: false })
        }
        className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="bg-white w-11/12 md:w-3/6 p-6 rounded shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Pet Details</h2>
            <button
              onClick={() =>
                dispatch({ type: "editProductModalClose", payload: false })
              }
              className="bg-black text-white px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <input
              value={editformData.pName}
              onChange={(e) =>
                setEditformdata({ ...editformData, pName: e.target.value })
              }
              className="w-full border px-3 py-2"
              placeholder="Pet Name"
            />

            <input
              type="number"
              value={editformData.pPrice}
              onChange={(e) =>
                setEditformdata({ ...editformData, pPrice: e.target.value })
              }
              className="w-full border px-3 py-2"
              placeholder="Pet Age"
            />

            <textarea
              value={editformData.pDescription}
              onChange={(e) =>
                setEditformdata({
                  ...editformData,
                  pDescription: e.target.value,
                })
              }
              className="w-full border px-3 py-2"
              rows="3"
              placeholder="Description"
            />

            {/* Existing images */}
            {editformData.pImages.length > 0 && (
              <div className="flex gap-2">
                {editformData.pImages.map((img, i) => (
                  <img
                    key={i}
                    src={`${apiURL}/uploads/products/${img}`}
                    className="h-16 w-16 object-cover"
                    alt="pet"
                  />
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              onChange={(e) =>
                setEditformdata({
                  ...editformData,
                  pEditImages: [...e.target.files],
                })
              }
              className="w-full border px-3 py-2"
            />

            <select
              value={editformData.pStatus}
              onChange={(e) =>
                setEditformdata({ ...editformData, pStatus: e.target.value })
              }
              className="w-full border px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>

            <select
              value={editformData.pCategory}
              onChange={(e) =>
                setEditformdata({
                  ...editformData,
                  pCategory: e.target.value,
                })
              }
              className="w-full border px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.cName}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Update Pet
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProductModal;
