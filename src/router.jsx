
import {createBrowserRouter} from "react-router"
import Register from "./components/auth/Register";
const router =createBrowserRouter([
    {
        path:'/register',
        element:<Register/>
    }
]);
export default router