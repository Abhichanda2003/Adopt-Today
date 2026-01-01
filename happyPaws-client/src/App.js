import React, { Fragment, useReducer } from "react";
import Routes from "./components";
import { LayoutContext, layoutState, layoutReducer } from "./components/shop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [data, dispatch] = useReducer(layoutReducer, layoutState);
  return (
    <Fragment>
      <LayoutContext.Provider value={{ data, dispatch }}>
        <Routes />
      </LayoutContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Fragment>
  );
}

export default App;
