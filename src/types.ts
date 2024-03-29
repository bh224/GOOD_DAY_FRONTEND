export interface TasksList {
    pk: string;
    author: number;
    tasker: number | null;
    type: string;
    content: string;
    status: string;
    limit_date: string;
    group: WorkGroup;
    counts: number;
}

export interface WorkGroup {
    pk: number;
    group_code: string;
    group_name: string;
    description: string;
    members: GroupMembers[];
    is_member: boolean;
    member: GroupMembers;
}

export interface AllWorkGroupList {
    pk: number;
    group_code: string;
    group_name: string;
    description: string;
    is_member: boolean;
    member_cnt: number;
}

export interface GroupMembers {
    pk: number;
    username: string;
    nickname: string;
}

export interface TaskDetails {
    pk: number;
    author: GroupMembers;
    tasker: GroupMembers;
    content: string;
    type: string;
    limit_date: string;
    status: string;
    group: WorkGroup;
}

export interface CommentDetails {
    pk: number;
    author: GroupMembers;
    content: string;
    created_at: string;
    task: string | undefined;
}

export interface GroupMembersStatus {
    pk: number;
    state_code: string;
    start_time: string;
    end_time: string;
    created_at: string;
    user: GroupMembers;
}