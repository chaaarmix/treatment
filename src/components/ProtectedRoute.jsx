import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserProvider";

const ProtectedRoute = ({ element }) => {
    const { userData } = useContext(UserContext);

    return userData ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
