import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const AddProductModal = () => {
  const { data, dispatch } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pImages: [],
    pStatus: "Active",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: "",
  });

  /* LOAD CATEGORIES */
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategory();
      if (res?.Categories) setCategories(res.Categories);
    };
    loadCategories();
  }, []);

  /* REFRESH PRODUCTS */
  const refreshProducts = async () => {
    const res = await getAllProduct();
    if (res?.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: res.Products,
      });
    }
  };

  /* SUBMIT PRODUCT */
  const submitProduct = async (e) => {
    e.preventDefault();

    console.log("Submitting product, images length:", formData.pImages.length);

    if (formData.pImages.length < 2) {
      alert("Please select at least 2 images");
      return;
    }

    const productData = {
      pName: formData.pName,
      pDescription: formData.pDescription,
      pImage: formData.pImages,
      pStatus: formData.pStatus,
      pCategory: formData.pCategory,
      pQuantity: formData.pQuantity || "1", // default to 1 if empty
      pPrice: formData.pPrice,
      pOffer: formData.pOffer || "0", // default to 0
    };

    console.log("Sending product data:", productData);

    try {
      const res = await createProduct(productData);

      console.log("Create product response:", res);

      if (res?.success) {
        alert("Pet added successfully");
        await refreshProducts();
        dispatch({ type: "addProductModalClose", payload: false });
        // Reset form
        setFormData({
          pName: "",
          pDescription: "",
          pImages: [],
          pStatus: "Active",
          pCategory: "",
          pQuantity: "",
          pPrice: "",
          pOffer: "",
        });
        // Clear file input
        document.querySelector('input[type="file"]').value = "";
      } else {
        alert("Failed to create pet");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <Fragment>
      {data.addProductModal && (
        <>
          {/* OVERLAY (click outside to close) */}
          <div
            onClick={() =>
              dispatch({ type: "addProductModalClose", payload: false })
            }
            className="fixed inset-0 bg-black opacity-50 z-30"
          />

          {/* MODAL */}
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="bg-white w-11/12 md:w-3/6 p-6 rounded shadow-lg relative z-50 pointer-events-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Add Pet</h2>

            {/* ❌ CLOSE BUTTON */}
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "addProductModalClose", payload: false })
              }
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={submitProduct} className="space-y-4">
            <input
              className="w-full border px-3 py-2"
              placeholder="Pet Name"
              value={formData.pName}
              onChange={(e) =>
                setFormData({ ...formData, pName: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="w-full border px-3 py-2"
              placeholder="Pet Age"
              value={formData.pPrice}
              onChange={(e) =>
                setFormData({ ...formData, pPrice: e.target.value })
              }
              required
            />

            <textarea
              className="w-full border px-3 py-2"
              placeholder="Pet Description"
              rows="3"
              value={formData.pDescription}
              onChange={(e) =>
                setFormData({ ...formData, pDescription: e.target.value })
              }
              required
            />

            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border px-3 py-2"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                console.log("Selected files:", files);
                setFormData({
                  ...formData,
                  pImages: files,
                });
              }}
              required
            />

            {formData.pImages.length > 0 && (
              <p className="text-sm text-green-600">
                {formData.pImages.length} image(s) selected
              </p>
            )}

            <p className="text-sm text-gray-500">
              Hold <b>CTRL</b> (Windows) or <b>CMD ⌘</b> (Mac) to select multiple images  
              <br />Minimum 2 images required
            </p>

            <select
              className="w-full border px-3 py-2"
              value={formData.pStatus}
              onChange={(e) =>
                setFormData({ ...formData, pStatus: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>

            <select
              className="w-full border px-3 py-2"
              value={formData.pCategory}
              onChange={(e) =>
                setFormData({ ...formData, pCategory: e.target.value })
              }
              required
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
              Create Pet
            </button>
          </form>
        </div>
      </div>
      </>
      )}
    </Fragment>
  );
};

export default AddProductModal;
