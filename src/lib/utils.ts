export const formatDate = (date: Date) => 
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

export const DateToString = (date: string) =>
    date.split("T")[0]

export const StatusTime = (time: string) =>
    `${time.split(":")[0]}시 ${time.split(":")[1]}분` 

export const TimeNow = (time: Date) =>
    `${time.getHours()}:${time.getMinutes()}`