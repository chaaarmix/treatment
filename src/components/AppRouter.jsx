import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./UserProvider";
import Enter from "../pages/Enter";
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";

const AppRouter = () => {
    const { userData } = useContext(UserContext);

    return (
        <Routes>
            <Route path="/" element={!userData ? <Enter /> : <Navigate to="/firstAidKit" />} />
            <Route path="/register" element={!userData ? <Register /> : <Navigate to="/firstAidKit" />} />
            <Route path="/firstAidKit" element={userData ? <FirstAidKit /> : <Navigate to="/" />} />
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default AppRouter;
