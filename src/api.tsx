import axios from "axios";
import Cookie from "js-cookie"

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true, //세션id 
})

export const getTasks = () => instance.get("tasks/").then((response) => response.data)

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