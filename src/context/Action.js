import axios, { axiosPrivate } from '../api/axios';
import { axioxFormData } from '../api/axios';

export const getReadAPI = async (type, page=1, perpage=20, params=null, accessToken=null) => {
    //console.info("params:" + params);
    let url = `/${type}/getRead?page=${page}&perpage=${perpage}`;
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }

    let data = null;
    try {
        const query = accessToken ? axioxFormData(accessToken) : axios;
        data = await query.get(url);
        data = data.data;
    } catch (e) {
        //console.info(e);
        data = e.response.data;
    }

    //console.info(data);
    return data
}