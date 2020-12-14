import React from "react";
import { Redirect, Route } from "react-router-dom";

type iPrivateRouteProps = {
  fallback: string;
  to: string;
};

export default function PrivateRoute(props: iPrivateRouteProps) {}
