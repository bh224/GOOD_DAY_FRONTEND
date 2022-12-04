export interface TasksList {
    pk: string;
    author: number;
    tasker: number | null;
    type: string;
    content: string;
    status: string;
}

export interface WorkGroup {
    pk: number;
    code: string;
    name: string;
    member: GroupMembers[]
}

export interface GroupMembers {
    pk: number;
    username: string;
    nickname: string;
}