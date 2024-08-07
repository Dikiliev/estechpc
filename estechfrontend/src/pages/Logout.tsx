import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { logout } from "@api/auth";

const Logout = () => {
    useEffect(() => {
        logout();
    }, []);
    return <Navigate to="/login" />;
};

export default Logout;
