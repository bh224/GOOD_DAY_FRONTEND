import { createBrowserRouter } from "react-router-dom";
import Main from "./routes/Main";
import Root from "./components/Root";
import NotFound from "./routes/NotFound";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound/>,
        children: [
            {
                path: "",
                element: <Main />,
            }
        ]
    }
])

export default router;