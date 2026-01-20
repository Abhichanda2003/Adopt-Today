import React, { useState } from "react";
import axios from "axios";
import { isAuthenticate } from "../../shop/auth/fetchApi";

const AddBlog = () => {
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: null,
    petType: "",
  });

  const { token } = isAuthenticate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setBlog({ ...blog, image: e.target.files[0] });
    } else {
      setBlog({ ...blog, [e.target.name]: e.target.value });
    }
  };

  const submitBlog = async (e) => {
    e.preventDefault();

    if (!blog.title || !blog.description || !blog.image || !blog.petType) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("description", blog.description);
    formData.append("image", blog.image);
    formData.append("petType", blog.petType);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/add-blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog added successfully");
      setBlog({ title: "", description: "", image: null, petType: "" });
      // Clear file input
      document.querySelector('input[name="image"]').value = "";
    } catch (error) {
      console.log(error);
      alert("Error adding blog");
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Add Blog</h2>

      <form onSubmit={submitBlog} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={blog.title}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />

        <textarea
          name="description"
          placeholder="Blog Description"
          value={blog.description}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          rows="4"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />

        {blog.image && (
          <p className="text-sm text-green-600">
            Selected image: {blog.image.name}
          </p>
        )}

        <input
          type="text"
          name="petType"
          placeholder="Pet Type (Dog / Cat)"
          value={blog.petType}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />

        <button
          type="submit"
          className="px-6 py-2 bg-black text-white"
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
