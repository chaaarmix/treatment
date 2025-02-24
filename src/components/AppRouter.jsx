import { Routes, Route } from "react-router-dom";
import Enter from "../pages/Enter";
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Enter />} />
            <Route path="/register" element={<Register />} />
            <Route path="/firstAidKit" element={<FirstAidKit />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default AppRouter;
