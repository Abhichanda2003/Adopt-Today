import React, { Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const history = useHistory();

  const activeClass = (path) =>
    location.pathname === path
      ? "border-r-4 border-gray-800 bg-gray-100"
      : "";

  const menuClass =
    "hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6";

  return (
    <Fragment>
      <div
        style={{ boxShadow: "1px 1px 8px 0.2px #aaaaaa" }}
        id="sidebar"
        className="hidden md:block sticky top-0 left-0 h-screen md:w-3/12 lg:w-2/12 sidebarShadow bg-white text-gray-600"
      >
        {/* Dashboard */}
        <div
          onClick={() => history.push("/admin/dashboard")}
          className={`${activeClass("/admin/dashboard")} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Dashboard</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Categories */}
        <div
          onClick={() => history.push("/admin/dashboard/categories")}
          className={`${activeClass(
            "/admin/dashboard/categories"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Categories</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Pet */}
        <div
          onClick={() => history.push("/admin/dashboard/products")}
          className={`${activeClass(
            "/admin/dashboard/products"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Pet</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Donation Received */}
        <div
          onClick={() => history.push("/admin/dashboard/orders")}
          className={`${activeClass(
            "/admin/dashboard/orders"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Donation Received</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Blogs */}
        <div
          onClick={() => history.push("/admin/dashboard/blogs")}
          className={`${activeClass(
            "/admin/dashboard/blogs"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-4H5m14 8H5m2 4h10"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Blogs</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Adopter Requests */}
        <div
          onClick={() => history.push("/admin/dashboard/adopters")}
          className={`${activeClass(
            "/admin/dashboard/adopters"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Adopter Requests</span>
        </div>

        {/* Donors Details */}
        <div
          onClick={() => history.push("/admin/dashboard/donors")}
          className={`${activeClass(
            "/admin/dashboard/donors"
          )} ${menuClass}`}
        >
          <span>
            <svg
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10V6m0 12v-2m8-4a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Donors Details</span>
        </div>

        <hr className="border-b border-gray-200" />
      </div>
    </Fragment>
  );
};

export default AdminSidebar;
