import Enter from '../pages/Enter';
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";
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
        path: '/error',
        element: <Error/>,
    }
];