import React from "react";
import { Route } from "react-router-dom";

const CartProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      
        <Component {...props} />
      
    }
  />
);

export default CartProtectedRoute;
