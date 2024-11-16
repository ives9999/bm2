import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

export const getReadAPI = async (accessToken, page=1, perpage=20, params=null) => {
    //console.info("params:" + params);
    let url = "/supplier/getRead?page=" + page + "&perpage=" + perpage
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }
    //console.info(url);
    let data = null;
    try {
        const query = axioxFormData(accessToken);
        data = await query.get(url);
        data = data.data;
    } catch (e) {
        //console.info(e);
        data = e.response.data;
    }

    //console.info(data);
    return data
}

export const getOneAPI = async (accessToken, supplierToken, scenario='read') => {
    const url = "/supplier/getOne?product_token="+supplierToken+'&scenario='+scenario
    let data = null;
    try {
        const query = axioxFormData(accessToken);
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = "/supplier/postUpdate";
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = await query.post(url, formData);
    } catch (e) {
        //console.info(e);
        data = e.response;
    }

    return data.data;
}

export const postUpdateSortOrderAPI = async (accessToken, params) => {
    const url = "/supplier/postUpdateSortOrder"
    const query = axioxFormData(accessToken);
    let data = await query.post(url, params);

    return data.data;
}


export const deleteOneAPI = async (accessToken, productToken) => {
    const url = "/supplies/deleteOne"
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.delete(url, {data:
                {product_token: productToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}
