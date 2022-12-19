import axios from "axios";
import Cookie from "js-cookie"
import { QueryFunctionContext } from "@tanstack/react-query";
import { formatDate, TimeNow } from "./lib/utils";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true, //세션id 
})

export const getTasks = () => instance.get("tasks/").then((response) => response.data)
export const getTaskTome = () => instance.get("tasks/tome").then((response) => response.data)
export const allTasks = () => instance.get("tasks/all").then((response) => response.data)
export const dailyTask = (date:string) => instance.get(`tasks/all?created_at=${date}`).then((response) => response.data)

export const getUser = () => instance.get("users/me").then((response) => response.data)
//그룹불러오기
export const getWorkgroups = () => instance.get("users/workgroups").then((response) => response.data)

//authentication
export const logOut = () => instance.post("users/logout", null, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }
}).then((response)=>response.data)

export interface LoginVariables {
    username: string;
    password: string;
}

export interface LoginSuccess {
    ok: string;
}
export interface LoginError {
    msg: string;
}

export const logIn = ({username, password}:LoginVariables) => instance.post("users/login", { username, password }, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }
}).then((response) => response.data)

// username 중복확인
export interface CheckUsername {
    username: string;
}
export const checkUsername = ({ username }:CheckUsername) => instance.post("users/check_username", { username }, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }
}).then((response) => response.data)

export interface SignupVariables {
    email: string | null;
    nickname: string;
    password: string;
    username: string;
    group_code: string;
}

export const signUp = ({ email, nickname, password, username, group_code }: SignupVariables) => instance.post(
    "users/",
    {username, password, email, nickname, group_code},
    {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }
}).then((response)=>response.data)

export interface EditUserVariables {
    nickname: string;
    email: string;
}
// 유저정보 수정
export const updateUser = ({ nickname, email }: EditUserVariables) => instance.put(
    'users/me',
    { nickname, email },
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
        }
    }
).then((response)=>response.data)


//  간편로그인

export const kakaoLogin = (code: string) => instance.post(
    "users/kakao",
    { code },
    {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""    
    }}
).then((response) => response.data)

export const googleLogin = (code: string) => instance.post(
    "users/google",
    { code },
    {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""    
    }}
).then((response)=>response.data)

export interface NaverVarialbles {
    code: string;
    state: string;
}

export const naverLogin = (code:string) => instance.post(
    "users/naver",
    { code},
    {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""    
    }}
).then((response) => response.data)

export interface TaskVariables {
    type: string;
    tasker: string;
    content: string;
    limit_date: string;
    status: string;
    pk: string;
    group_pk: number;
}

export const uploadTask = (data:TaskVariables) => instance.post(
    "tasks/",
    data,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""   
    }}
).then((response) => response.data)

export interface EditTaskVariables {
    pk: string | undefined;
    type: string | undefined;
    status: string | undefined;
    tasker: string | undefined;
    content: string | undefined;
    limit_date: string | undefined;
    groupPk: number | undefined;
}

export const editTask = ({type, tasker, content, status, limit_date, pk, groupPk}:EditTaskVariables) => instance.put(
        `tasks/${pk}/`,
        {type, tasker, content, status, limit_date, pk, groupPk},
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || ""
            }
        }
    ).then((response) => response.data)

export const deleteTask = (pk:string | undefined) => {
    console.log("api>>>", pk)
    return instance.delete(
        `tasks/${pk}`,
        {
            headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
        }}
    ).then((response)=>response.data)
}

export const getTask = ({ queryKey }: QueryFunctionContext) => {
    const pk = queryKey[1]
    return instance.get(`tasks/${pk}`).then((response)=>response.data)
}

export const tasksCounts = () => instance.get("tasks/tasks-counts").then((response)=>response)

export const getComment = ({ queryKey }: QueryFunctionContext) => {
    const pk = queryKey[1]
    return instance.get(`tasks/${pk}/comments`).then((response)=>response.data)
}

export interface CommentVariables {
    pk: string | undefined;
    content: string;
}

export const postComment = ({ pk, content }: CommentVariables) => {
    return instance.post(
    `tasks/${pk}/comments/`,
    { pk, content },
    {
        headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }}
).then((response)=>response.data)
}



export interface deleteComVariables {
    task: string | undefined;
    pk: number;
}

export const deleteComment = ({ task, pk }:deleteComVariables) => instance.delete(
    `tasks/${task}/comments/${pk}`,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
        }
    }
).then((response) => response.data)

export const getToday = () => {
    const today = formatDate(new Date())
    return  instance.get(`users/today?today=${today}`).then((response)=>response.data)
}

export interface StartTodayVariables {
    state_code: string;
    start_time: string;
}

export const startToday = ({ state_code, start_time }:StartTodayVariables) => {
    return instance.post(
        'users/todays',
        { state_code, start_time },
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || ""
            }
        }
    ).then((response) => response.data)
}

export interface EndTodayVariables {
    state_code: string;
    end_time: string;
}

export const endToday = ({ state_code, end_time }:EndTodayVariables) => {
    return instance.put(
        'users/today',
        { state_code, end_time },
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || ""
            }
        }
    ).then((response) => response.data)
}

// 모든그룹불러오기
export const getAllGroups = () => instance.get("users/workgroups?filter=all").then((response)=>response.data)

export interface CreateGroupVariables {
    group_name: string;
    description: string;
}

export const createGroup = ({ group_name, description }:CreateGroupVariables) => instance.post(
    'users/workgroups',
    { group_name, description },
    {
        headers: {
             "X-CSRFToken": Cookie.get("csrftoken") || ""
        }
    }
).then((response) => response.data)

export const getGroup = ({ queryKey }: QueryFunctionContext) => {
    const pk = queryKey[1]
    return instance.get(`users/workgroups/${pk}`).then((response)=>response.data)
}

export interface JoinGroupVariables {
    pk: string | undefined;
    member_pk: string;
}

export const joinWorkgroup = ({ pk, member_pk }:JoinGroupVariables) => instance.post(
    `users/workgroups/${pk}`,
    { pk, member_pk },
    {
        headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || ""
    }}
).then((response) => response.data)

export interface EditGroupVariables {
    pk: string | undefined;
    group_name: string;
    description: string;
}

export const editWorkgroup = ({pk, group_name, description}:EditGroupVariables) => instance.put(
    `users/workgroups/${pk}`,
    {group_name, description},
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
    }}
).then((response) => response.data)

export const deleteWorkgroup = (pk: string | undefined) => instance.delete(
    `users/workgroups/${pk}`,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
    }}
).then((response) => response.data)

export const leaveWorkgroup = (pk: string | undefined) => instance.post(
    'users/me',
    { pk },
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || ""
        }
    }
).then((response)=>response.data)