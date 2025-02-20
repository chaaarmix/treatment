import Enter from '../pages/Enter';
import FirstAidKit from "../pages/FirstAidKit";
import Register from "../pages/Register";
export const routes = [
    {
        path: '/',
        element: <Enter/>,
    },
    {
        path:'/FirstAidKit',
        element: <FirstAidKit/>,
    },
    {
        path:'/Register',
        element: <Register/>,
    }
];