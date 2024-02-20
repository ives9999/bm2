import axios from 'axios';

const domain = process.env.REACT_APP_API;

export default axios.create({
    baseURL: domain,
    headers: {'Content-Type': 'application/json'},
});

export const axiosPrivate = (accessToken) => {
    const instance = axios.create({
        baseURL: domain,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        withCredentials: true,
    });
    return instance;
}
