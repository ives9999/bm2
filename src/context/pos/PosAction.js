import { axiosPrivate } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const getAllMemberAPI = async (accessToken, startDate, endDate, isInsertPosID=false) => {
    let url = `${domain}/pos/getMembers?startDate=${startDate}&endDate=${endDate}&isInsertPosID=${isInsertPosID}`;
    //let url = `${domain}/pos1/getMembers`;
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
    //let url = `${domain}/pos1/getMembers`;
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

export const getAllProductAPI = async (accessToken, cat_id, startDate, endDate, isDate = true) => {
    var url = `${domain}/pos/getProducts`;
    if (isDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    if (cat_id > 0) {
        url += (isDate) ? `&` : `?`;
        url += `cat_id=${cat_id}`;
    }
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

export const getAllGatewayMethodAPI = async (accessToken) => {
    var url = `${domain}/pos/getGatewayMethod`;
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

export const getAllCashierAPI = async (accessToken) => {
    var url = `${domain}/pos/getCashier`;
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

export const getAllOrderAPI = async (accessToken, startDate, endDate) => {
    var url = `${domain}/pos/getOrders?startDate=${startDate}&endDate=${endDate}`;
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

export const getOrderByNumberAPI = async (accessToken, uid) => {
    var url = `${domain}/pos/getOrderByNumber?uid=${uid}`;
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

export const getSaleHomeAPI = async (accessToken, page, perpage) => {
    var url = `${domain}/pos/getSaleHome?page=`+page+`&perpage=`+perpage;
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
