import Enter from '../pages/Enter';
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
import Error from "../pages/Error";
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
        path: '/error',
        element: <Error/>,
    }
];