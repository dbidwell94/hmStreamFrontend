import React, { useEffect } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { iState } from "../../constants/State";
import { sendSystemMessage } from "../../actions";
import { messageSeverity } from "../../constants/Types";

interface PrivateRouteProps extends RouteProps {
  redirectTo: string;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const token = useSelector((state: iState) => state.authentication);

  const { redirectTo, ...routeProps } = props;

  function checkAuth() {
    if(token.token && token.userId) {
      return true;
    }
    return false;
  }

  return (
    <>
      {checkAuth() ? (
        <Route {...routeProps} />
      ) : (
        <Redirect to={redirectTo} />
      )}
    </>
  );
}
