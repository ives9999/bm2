import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

export const getReadAPI = async (page=1, perpage=20, params=null) => {
    let url = "/cat/getRead?page=" + page + "&perpage=" + perpage;
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }
    let data = null;
    try {
        data = await axios.get(url)
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
        data = e.respons.data;
    }
    //console.info(data);
    return data
}

export const getOneAPI = async (catToken, scenario='read') => {
    const url = "/cat/getOne?cat_token="+catToken+'&scenario='+scenario
    let data = await axios.get(url);
    // await axios.get(url)
    // .then((data) => {return data;});
    // .catch((e) => {return e.response;});

    return data.data
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = "/cat/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
    return data.data;
}

export const postUpdateSortOrderAPI = async (accessToken, params) => {
    const url = "/cat/postUpdateSortOrder"
    const query = axioxFormData(accessToken);
    let data = await query.post(url, params);

    return data.data;
}

export const deleteOneAPI = async (accessToken, catToken) => {
    const url = "/cat/deleteOne";
    const query = axiosPrivate(accessToken); 
    let data = query.delete(url, {data: 
        {cat_token: catToken},
    });
    
    // const response = await fetch(url, {
    //     method: 'DELETE',
    //     headers: headers,
    //     body: JSON.stringify({token: token})
    // })
    // const data = await response.json()
    return data
}
