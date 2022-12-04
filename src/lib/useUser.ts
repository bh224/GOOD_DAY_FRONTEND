import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';


export default function useUser() {
    const { isLoading, data, isError } = useQuery(['user'], getUser, {retry:false})
    return {
        userLoading: isLoading,
        user: data,
        isLoggedIn: !isError,
    }
}