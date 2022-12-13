import { useQuery } from '@tanstack/react-query'
import { WorkGroup } from "../types";
import { getWorkgroups } from "../api";

export default function useWorkgroups() {
    const { isLoading, data } = useQuery<WorkGroup[]>(['workgroups'], getWorkgroups, {retry:false})
    return {
        isGroupLoading: isLoading,
        groupData: data,
    }
}