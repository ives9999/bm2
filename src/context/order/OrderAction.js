import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const getReadAPI = async (accessToken, page=1, perpage=20, params=null) => {
    //console.info("params:" + JSON.stringify(params));
    let url = domain + "/order/getRead?page=" + page + "&perpage=" + perpage;
    if (params !== null) {
        const keys = Object.keys(params);
        keys.forEach((key) => {
            url += "&" + key + "=" + params[key];
        });
    }

    //console.info(url);
    const query = axiosPrivate(accessToken);
    let data = null;

    try {  
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const getOneAPI = async (accessToken, orderToken, scenario='read') => {
    //console.info("orderToken:" + orderToken);
    const url = "/order/getOne?param="+orderToken+'&scenario='+scenario;
    //console.info(url);
    const query = axiosPrivate(accessToken);
    let data = null;
    try {
        data = await query.get(url);
        // console.info(data);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = "/order/postUpdate"
    const query = axioxFormData(accessToken);
    let data = await query.post(url, formData);

    return data.data;
}

export const deleteOneAPI = async (accessToken, orderToken) => {
    const url = "/order/deleteOne"
    let data = null;
    try {
        const query = axiosPrivate(accessToken); 
        data = query.delete(url, {data: 
            {order_token: orderToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}

export const postOrderToNewebpayAPI = async (accessToken, params) => {
    const url = "/order/postOrderToNewebpay";
    //const data = await axios.get(url)
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = await query.post(url, params);
    } catch (e) {
        data = e.response;
    }
    //console.info(data);
    return data.data;
}

export const getCheckoutAPI = async () => {
    const url = "/order/getCheckout";
    let data = await axios.get(url);
    // console.info(data);

    return data.data;
}

export const postUpdateProcessAPI = async (accessToken, order_token, process) => {
    const url = "/order/postUpdateProcess";
    const params = {order_token: order_token, process: process};
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = await query.post(url, params);
    } catch (e) {
        data = e.response;
    }
    //console.info(data);
    return data.data;
}