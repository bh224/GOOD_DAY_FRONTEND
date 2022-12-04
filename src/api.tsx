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
