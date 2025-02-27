import Enter from '../pages/Enter';
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";
import Calendar from "../pages/Calendar";
import Notifications from "../pages/Notifications";
import UserAccount from "../pages/UserAccount";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = [
    {
        path: '/',
        element: <Enter />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/forgotPassword',
        element: <ForgotPassword />,
    },
    {
        path: '/error',
        element: <Error />,
    },

    {
        path: '/firstAidKit',
        element: <ProtectedRoute element={<FirstAidKit />} />,
    },
    {
        path: '/calendar',
        element: <ProtectedRoute element={<Calendar />} />,
    },
    {
        path: '/notifications',
        element: <ProtectedRoute element={<Notifications />} />,
    },
    {
        path: '/userAccount',
        element: <ProtectedRoute element={<UserAccount />} />,
    },
];
