import axios from 'axios';

const domain = process.env.REACT_APP_API;

export default axios.create({
    baseURL: domain,
    headers: {'Content-Type': 'application/json'},
});

export const axiosPrivate = axios.create({
    baseURL: domain,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
});
