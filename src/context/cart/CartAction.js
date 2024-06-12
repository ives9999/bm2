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