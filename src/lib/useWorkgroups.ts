import { useQuery } from '@tanstack/react-query'
import { WorkGroup } from "../types";
import { getWorkgroups } from "../api";

export default function useWorkgroups(page: string) {
    const { isLoading, data } = useQuery<WorkGroup[]>(['workgroups', page], getWorkgroups, {retry:false})
    return {
        isGroupLoading: isLoading,
        groupData: data,
    }
}