import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")).token : false;

const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

const AllDonors = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/order/get-all-orders`, Headers());
      setDonations(res?.data?.Orders || []);
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Failed to load donor details"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (oId) => {
    const ok = window.confirm("Delete this donor record?");
    if (!ok) return;

    try {
      const res = await axios.post(
        `${apiURL}/api/order/delete-order`,
        { oId },
        Headers()
      );
      if (res?.data?.success) {
        fetchDonations();
      } else {
        alert(res?.data?.message || "Failed to delete donor record");
      }
    } catch (error) {
      console.log(error.response || error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Failed to delete donor record"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
      <div className="text-2xl font-semibold mb-4">Donors Details</div>
      <table className="table-auto border w-full my-2">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Transaction Id</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Donated at</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations && donations.length > 0 ? (
            donations.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-2 text-center">₹{order.amount}.00</td>
                <td className="p-2 text-center">{order.email || order?.user?.email || "-"}</td>
                <td className="p-2 text-center">{order.phone || "-"}</td>
                <td className="p-2 text-center">{order.transactionId}</td>
                <td className="p-2 text-center">
                  <span className="block text-green-600 rounded-full text-center text-xs px-2 font-semibold">
                    {order.status || "Received"}
                  </span>
                </td>
                <td className="p-2 text-center">
                  {order.createdAt ? moment(order.createdAt).format("lll") : "-"}
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => deleteDonation(order._id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-xl text-center font-semibold py-8">
                No donor records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-sm text-gray-600 mt-2">
        Total {donations && donations.length} donor records found
      </div>
    </div>
  );
};

export default AllDonors;
