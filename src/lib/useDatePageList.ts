import { useQuery } from '@tanstack/react-query';
import { getDatePageList } from '../api';
import useUser from './useUser';


export default function useDatePageList() {
    const { userLoading, user, isLoggedIn } = useUser();
    const { isLoading, data } = useQuery(['date-page'], getDatePageList, {retry:false, enabled: !isLoggedIn})
    return {
        pageLoading: isLoading,
        pageList: data,
    }
}

