import { useQuery } from '@tanstack/react-query';
import { getDatePageList } from '../api';
import useUser from './useUser';


export default function useDatePageList() {
    const { isLoading, data } = useQuery(['date-page'], getDatePageList, { retry: false })
    return {
        pageLoading: isLoading,
        pageList: data,
    }
}

