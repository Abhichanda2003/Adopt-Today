import React, { Fragment, useEffect, useState } from "react";
import Layout from "../layout";
import axios from "axios";

/* --------- NO BLOG UI (UNCHANGED IDEA) --------- */
const NoBlogComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center my-32">
      <span>
        <svg
          className="w-32 h-32 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      <span className="text-center text-gray-700 text-4xl font-bold tracking-widest">
        NO Blogs Yet
      </span>
    </div>
  );
};

/* --------- BLOG LIST UI --------- */
const BlogList = ({ blogs, apiBaseUrl }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-4 rounded">
          <img
            src={blog?.image?.startsWith("/") ? `${apiBaseUrl}${blog.image}` : blog.image}
            alt="pet"
            className="w-full h-48 object-contain bg-gray-100 mb-3"
          />
          <h2 className="text-xl font-bold">{blog.title}</h2>
          <p className="text-gray-600 mt-2">{blog.description}</p>
          <span className="text-sm text-yellow-700 mt-2 block">
            {blog.petType}
          </span>
        </div>
      ))}
    </div>
  );
};

/* --------- MAIN BLOG PAGE --------- */
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API}/api/blogs`);
        setBlogs(res.data.blogs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API]);

  return (
    <Fragment>
      <Layout
        children={
          loading ? (
            <div className="text-center my-32">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <NoBlogComponent />
          ) : (
            <BlogList blogs={blogs} apiBaseUrl={API} />
          )
        }
      />
    </Fragment>
  );
};

export default Blog;
