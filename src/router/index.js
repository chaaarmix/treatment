import Enter from '../pages/Enter';
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";
import Calendar from "../pages/Calendar";
import Notifications from "../pages/Notifications";
import UserAccount from "../pages/UserAccount";
export const routes = [
    {
        path: '/',
        element: <Enter/>,
    },
    {
        path:'/firstAidKit',
        element: <FirstAidKit/>,
    },
    {
        path:'/register',
        element: <Register/>,
    },
    {
        path: '/forgotPassword',
        element: <ForgotPassword/>,
    },
    {
        path: '/calendar',
        element: <Calendar/>,
    },
    {
        path: '/notifications',
        element: <Notifications/>,
    },
    {
        path: '/userAccount',
        element: <UserAccount/>,
    },
    {
        path: '/error',
        element: <Error/>,
    }
];