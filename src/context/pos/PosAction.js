import { axiosPrivate } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const getAllMemberAPI = async (accessToken, startDate, endDate, isInsertPosID=false) => {
    let url = `${domain}/pos/getMembers?startDate=${startDate}&endDate=${endDate}&isInsertPosID=${isInsertPosID}`;
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

export const getSyncMemberAPI = async (accessToken, startDate, endDate) => {
    let url = `${domain}/pos/getSyncMembers?startDate=${startDate}&endDate=${endDate}`;
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
    var url = `${domain}/pos/getProducts?startDate=${startDate}&endDate=${endDate}`;
    if (cat_id > 0) {
        url += `&cat_id=${cat_id}`;
    }
    console.info(url);
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}

export const getAllGatewayMethodAPI = async (accessToken) => {
    var url = `${domain}/pos/getGatewayMethod`;
    console.info(url);
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}

export const getAllCashierAPI = async (accessToken) => {
    var url = `${domain}/pos/getCashier`;
    console.info(url);
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}
