import { User } from "firebase/auth";
import React, { Component, ReactFragment, ReactNode } from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../firebase/context/AuthContext";

type PrivateRoutePropsType = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: PrivateRoutePropsType) => {
  const user = useAuth();

  return user ? { ...children } : <Navigate to="/login" />;
};

export default PrivateRoute;
