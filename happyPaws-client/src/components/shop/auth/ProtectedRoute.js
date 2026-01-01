import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate, isAdmin } from "./fetchApi";

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
    
        <Component {...props} />
    
    }
  />
);

export default ProtectedRoute;
