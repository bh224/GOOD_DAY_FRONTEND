import { createBrowserRouter } from "react-router-dom";
import Main from "./routes/Main";
import Root from "./components/Root";
import NotFound from "./routes/NotFound";
import KakaoLogin from "./routes/KakaoLogin";
import GoogleLogin from "./routes/GoogleLogin";
import NaverLogin from "./routes/NaverLogin";
import TaskDetail from "./routes/TaskDetail";
import MyPage from "./routes/MyPage";
import GroupDetail from "./routes/GroupDetail";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound/>,
        children: [
            {
                path: "",
                element: <Main />,
            },
            {
                path: "mypage",
                element: <MyPage />
            },
            {
                path: "task/:pk",
                element: <TaskDetail />
            },
            {
                path: "group/:pk",
                element: <GroupDetail />
            },
            {
                path: "simplelogin",
                children: [
                    {
                        path: "kakao",
                        element: <KakaoLogin />
                    },
                    {
                        path: "google",
                        element: <GoogleLogin />
                    },
                    {
                        path: "naver",
                        element: <NaverLogin />
                    },
                ]
            }
 ] }
])

export default router;