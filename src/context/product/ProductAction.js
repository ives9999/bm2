import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

export const getReadAPI = async (page=1, perpage=20) => {
    const url = "/product/getRead?page=" + page + "&perpage=" + perpage
    let data = await axios.get(url)
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
    console.info(data);
    return data
}

export const getOneAPI = async (productToken, scenario='read') => {
    const url = "/product/getOne?product_token="+productToken+'&scenario='+scenario
    let data = await axios.get(url);
    // await axios.get(url)
    // .then((data) => {return data;});
    // .catch((e) => {return e.response;});

    return data.data
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = process.env.REACT_APP_API + "/product/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
    return data.data;
}

export const deleteOneAPI = async (accessToken, productToken) => {
    const url = process.env.REACT_APP_API + "/product/deleteOne"
    let data = await axiosPrivate.delete(url);
    
    // const response = await fetch(url, {
    //     method: 'DELETE',
    //     headers: headers,
    //     body: JSON.stringify({token: token})
    // })
    // const data = await response.json()
    return data
}
