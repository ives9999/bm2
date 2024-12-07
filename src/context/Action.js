import axios, { axiosPrivate } from '../api/axios';
import { axioxFormData } from '../api/axios';

export const getReadAPI = async (type, page=1, perpage=20, params=null, accessToken=null) => {
    console.info(params);
    let url = `/${type}/getRead?page=${page}&perpage=${perpage}`;
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }

    let data = null;
    try {
        const query = accessToken ? axiosPrivate(accessToken) : axios;
        data = await query.get(url);
        data = data.data;
    } catch (e) {
        //console.info(e);
        data = e.response.data;
    }

    //console.info(data);
    return data
}

export const deleteOneAPI = async (type, token, accessToken=null ) => {
    const url = `/${type}/deleteOne`;
    let data = null;
    try {
        const query = accessToken ? axiosPrivate(accessToken) : axios;
        data = await query.delete(url, {data:
                {token: token},
        });
    } catch (e) {
        data = e.response.data;
    }
    return data;
}

export const postUpdateSortOrderAPI = async (type, params, accessToken=null) => {
    const url = `/${type}/postUpdateSortOrder`;
    let data = null;
    try {
        const query = accessToken ? axiosPrivate(accessToken) : axios;
        //const query = axioxFormData(accessToken);
        data = await query.post(url, params);
    } catch (e) {
        data = e.response.data;
    }

    return data;
}

export const postSaleAPI = async (accessToken, params) => {
    const url = "/pos/postSale"
    const query = axiosPrivate(accessToken);
    let data = await query.post(url, params);

    return data.data;
}

export const postBuyAPI = async (accessToken, params) => {
    const url = "/pos/postBuy"
    const query = axiosPrivate(accessToken);
    let data = await query.post(url, params);

    return data.data;
}
