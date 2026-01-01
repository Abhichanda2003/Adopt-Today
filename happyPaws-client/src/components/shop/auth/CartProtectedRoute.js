import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate } from "./fetchApi";

const CartProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      
        <Component {...props} />
      
    }
  />
);

export default CartProtectedRoute;
