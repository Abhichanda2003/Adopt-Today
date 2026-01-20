import React, { useEffect, useState } from "react";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).token
    : false;

const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

const AllAdopters = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/adoption-requests`, Headers());
      setRequests(res?.data?.requests || []);
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Failed to load adopter requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    const ok = window.confirm("Delete this adopter request?");
    if (!ok) return;

    try {
      const res = await axios.delete(
        `${apiURL}/api/adoption-requests/${id}`,
        Headers()
      );
      if (res?.data?.success) {
        fetchRequests();
      } else {
        alert(res?.data?.message || "Failed to delete request");
      }
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Failed to delete request"
      );
    }
  };

  return (
    <div className="m-4 md:m-8 bg-white shadow rounded p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Adopter Requests</h2>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10">No adopter requests found</div>
      ) : (
        <div className="overflow-auto">
          <table className="table-auto border w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Pet Name</th>
                <th className="px-4 py-2 border">Product ID</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td className="p-2 border">{r.email}</td>
                  <td className="p-2 border">{r.phone}</td>
                  <td className="p-2 border">{r.petName}</td>
                  <td className="p-2 border">{r.productId}</td>
                  <td className="p-2 border">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      className="px-3 py-1 border"
                      onClick={() => deleteRequest(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-gray-600 mt-2">
            Total {requests.length} request(s)
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdopters;
