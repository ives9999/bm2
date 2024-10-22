import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

export const getReadAPI = async (page=1, perpage=20, params=null) => {
    //console.info("params:" + params);
    let url = "/product/getRead?page=" + page + "&perpage=" + perpage
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }
    //console.info(url);
    let data = null;
    try {
        data = await axios.get(url);
        data = data.data;
        if (data.data) {
            for (var i = 0; i < data.data.rows.length; i++) {
                let isFeatured = false;
                for (var j = 0; j < data.data.rows[i].images.length; j++) {
                    if (data.data.rows[i].images[j].isFeatured) {
                        data.data.rows[i].featured = data.data.rows[i].images[j].path
                        isFeatured = true;
                        break;
                    }
                }
                if (!isFeatured) {
                    const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
                    data.data.rows[i].featured = nofeatured;
                }
            }
        }
    } catch (e) {
        //console.info(e);
        data = e.response.data;
    }

    //console.info(data);
    return data
}

export const getOneAPI = async (productToken, scenario='read') => {
    const url = "/product/getOne?product_token="+productToken+'&scenario='+scenario
    let data = null;
    try {  
        data = await axios.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = "/product/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
    return data.data;
}

export const postUpdateSortOrderAPI = async (accessToken, params) => {
    const url = "/product/postUpdateSortOrder"
    const query = axioxFormData(accessToken);
    let data = await query.post(url, params);

    return data.data;
}


export const deleteOneAPI = async (accessToken, productToken) => {
    const url = "/product/deleteOne"
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

export const getPlusOneAPI = async (productToken) => {
    const url = "/product/getPlusOne?token="+productToken
    let data = null;
    try {
        data = await axios.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}
