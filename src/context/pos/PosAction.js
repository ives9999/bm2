import { axiosPrivate } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const getAllMemberAPI = async (accessToken, startDate, endDate) => {
    let url = `${domain}/pos/getMembers?startDate=${startDate}&endDate=${endDate}`;
    //let url = `${domain}/pos/getMembers`;
    //console.info(url);
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}

export const getAllCatAPI = async (accessToken) => {
    let url = `${domain}/pos/getCats`;
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}

export const getAllProductAPI = async (accessToken, cat_id, startDate, endDate) => {
    let url = `${domain}/pos/getProducts`;
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}
