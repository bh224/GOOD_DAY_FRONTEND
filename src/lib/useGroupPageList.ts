import { useQuery } from '@tanstack/react-query';
import { getGroupPageList } from '../api';
import useUser from "../lib/useUser";


export default function useGroupPageList() {
    const { userLoading, user, isLoggedIn } = useUser();
    const { isLoading, data } = useQuery(['group-page'], getGroupPageList, {retry:false, enabled:!isLoggedIn})
    return {
        groupPageLoading: isLoading,
        groupPageList: data,
    }
}