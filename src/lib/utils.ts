export const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = ("0" + (1 + date.getMonth())).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
}

export const DateToString = (date: string) =>
    date.split("T")[0]

export const StatusTime = (time: string) =>
    `${time.split(":")[0]}시 ${time.split(":")[1]}분` 

export const TimeNow = (time: Date) =>
    `${time.getHours()}:${time.getMinutes()}`

// 타입별 배지컬러
const badgeColor = {
    task: "red",
    todo: "blue",
    private: "yellow"
}
export const typeColor = (type:string | undefined) => {
    if (type == "task") {
        return badgeColor.task
    } else if (type == "todo") {
        return badgeColor.todo
    } else {
        return badgeColor.private
    }
}

// tast status
export const taskType = (status: string | undefined) => {
    if (status == "yet") {
        return "확인 전"
    } else if (status == "doing") {
        return "진행중"
    } else {
        return "완료"
    }
}