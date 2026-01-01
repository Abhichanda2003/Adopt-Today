import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordersList = () => {
    let newList = [];
    if (data.totalOrders.Orders !== undefined) {
      data.totalOrders.Orders.forEach(function (elem) {
        if (moment(elem.createdAt).format("LL") === moment().format("LL")) {
          newList = [...newList, elem];
        }
      });
    }
    return newList;
  };

  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <div className="text-2xl font-semibold mb-6 text-center">
          Today's Donations{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}
        </div>
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Ordered at</th>
            </tr>
          </thead>
          <tbody>
            {data.totalOrders.Orders !== undefined ? (
              ordersList().map((item, key) => {
                return <TodayOrderTable order={item} key={key} />;
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-xl text-center font-semibold py-8"
                >
                  No Donations found today
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Total{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}{" "}
          Donation found
        </div>
        <div className="flex justify-center">
          <span
            onClick={(e) => history.push("/admin/dashboard/orders")}
            style={{ background: "#303031" }}
            className="cursor-pointer px-4 py-2 text-white rounded-full"
          >
            View All
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  return (
    <Fragment>
      <tr>
        <td className="w-48 hover:bg-gray-200 p-2 flex flex-col space-y-1">

              <div className="flex space-x-2">
                <span>{order.user.email}</span>
              </div>
        </td>
        <td className="p-2 text-left">
          {console.log(order)}
        <div className="w-12 h-12 object-cover">
                <span>{order.phone}</span>
              </div>
        </td>
        <td className="p-2 text-center">
       
          {order.status === "Received" && (
            <span className="block text-green-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
       
        </td>
        <td className="p-2 text-center">{order.amount}</td>
        <td className="p-2 text-center">
          {moment(order.createdAt).format("lll")}
        </td>
      </tr>
    </Fragment>
  );
};

const TodaySell = (props) => {
  return (
    <div className="m-4">
      <SellTable />
    </div>
  );
};

export default TodaySell;
