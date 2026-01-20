import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { isAuthenticate } from "../../shop/auth/fetchApi";

const AllBlogs = () => {
  const history = useHistory();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPetType, setEditPetType] = useState("");

  const API = process.env.REACT_APP_API_URL;
  const { token } = isAuthenticate();

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/api/blogs`);
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.log(error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (blog) => {
    setEditId(blog._id);
    setEditTitle(blog.title || "");
    setEditDescription(blog.description || "");
    setEditPetType(blog.petType || "");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId("");
    setEditTitle("");
    setEditDescription("");
    setEditPetType("");
  };

  const updateBlog = async () => {
    try {
      const res = await axios.put(
        `${API}/api/blog/${editId}`,
        {
          title: editTitle,
          description: editDescription,
          petType: editPetType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        closeEdit();
        fetchBlogs();
      } else {
        alert(res?.data?.message || "Error updating blog");
      }
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Error updating blog"
      );
    }
  };

  const deleteBlog = async (id) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    try {
      const res = await axios.delete(`${API}/api/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        fetchBlogs();
      } else {
        alert(res?.data?.message || "Error deleting blog");
      }
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Error deleting blog"
      );
    }
  };

  return (
    <div className="m-4 md:m-8 bg-white shadow rounded p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <button
          onClick={() => history.push("/admin/dashboard/blogs/add")}
          className="px-4 py-2 bg-black text-white"
        >
          Add Blog
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10">No blogs found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="border rounded p-4">
              <img
                src={
                  blog?.image?.startsWith("/")
                    ? `${API}${blog.image}`
                    : blog.image
                }
                alt="blog"
                className="w-full h-40 object-cover mb-3"
              />
              <div className="font-semibold">{blog.title}</div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                {blog.description}
              </div>
              <div className="text-xs text-yellow-700 mt-2">{blog.petType}</div>

              <div className="flex items-center justify-end mt-4 space-x-2">
                <button
                  onClick={() => openEdit(blog)}
                  className="px-3 py-1 border"
                  type="button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="px-3 py-1 border"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Blog</h3>
              <button onClick={closeEdit} type="button" className="px-3 py-1 border">
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  className="w-full border px-3 py-2"
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">Pet Type</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2"
                  value={editPetType}
                  onChange={(e) => setEditPetType(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button onClick={closeEdit} type="button" className="px-4 py-2 border">
                  Cancel
                </button>
                <button onClick={updateBlog} type="button" className="px-4 py-2 bg-black text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AllBlogs;
