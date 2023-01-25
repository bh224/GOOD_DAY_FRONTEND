import { useQuery } from '@tanstack/react-query';
import { getDatePageList } from '../api';


export default function useDatePageList() {
    const { isLoading, data } = useQuery(['date-page'], getDatePageList)
    return {
        pageLoading: isLoading,
        pageList: data,
    }
}

