import {useEffect} from 'react';
import { axios } from '../api/axios';

function useAxiosPublic() {

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                console.info(error);
                // const prevRequest = error?.config;
                // if (error?.response?.status === 403 && !prevRequest?.sent) {
                //     prevRequest.sent = true;
                //     const newAccessToken = await refresh();
                //     prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                //     return axiosPrivate(prevRequest);
                // }
                // return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        }
    }, [])
    return useAxiosPublic;
}

export default useAxiosPublic
