import { useQuery } from '@tanstack/react-query';
import { getGroupPageList } from '../api';


export default function useGroupPageList() {
    const { isLoading, data } = useQuery(['group-page'], getGroupPageList)
    return {
        groupPageLoading: isLoading,
        groupPageList: data,
    }
}