import axios, { axiosPrivate } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const addCartAPI = async (accessToken, product_token, quantity) => {
    const url = domain + "/cart/postUpdate";
    const query = axiosPrivate(accessToken);
    let data = null;
    try {  
        data = await query.post(url, {
            product_token: product_token, 
            quantity: quantity
        });
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const getReadAPI = async (accessToken, page=1, perpage=20, params=null) => {
    //console.info("params:" + params);
    let url = domain + "/cart/getRead?page=" + page + "&perpage=" + perpage
    if (params && Array.isArray(params)) {
        params.forEach((param) => {
            const keys = Object.keys(param);
            keys.forEach((key) => {
                url += "&" + key + "=" + param[key];
            });
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

export const getOneAPI = async (accessToken) => {
    const url = "/member/getCart";
    const query = axiosPrivate(accessToken);
    let data = null;
    try {  
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const deleteOneAPI = async (accessToken, cartToken) => {
    const url = "/cart/deleteOne"
    let data = null;
    try {
        const query = axiosPrivate(accessToken); 
        data = query.delete(url, {data: 
            {cart_token: cartToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}

export const deleteItemAPI = async (accessToken, itemToken) => {
    const url = "/cart/deleteItem"
    let data = null;
    try {
        const query = axiosPrivate(accessToken); 
        data = query.delete(url, {data: 
            {item_token: itemToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}

export const updateQuantityAPI = async (accessToken, item_token, quantity) => {
    const url = domain + "/cart/postUpdateQuantity";
    const query = axiosPrivate(accessToken);
    let data = null;
    try {  
        data = await query.post(url, {
            item_token: item_token, 
            quantity: quantity
        });
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}