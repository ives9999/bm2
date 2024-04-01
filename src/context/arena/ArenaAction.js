import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API
//const headers = {'Content-Type': 'application/json',}

// 搜尋球館api
// k：關鍵字
export const filterKeywordAPI = async (k) => {
    const url = domain + "/arena/getFilterKeyword?k=" + k

    const response = await fetch(url)
    var data = await response.json()

    return data.data
}

export const getReadAPI = async (page=1, perpage=20, params=null) => {
    let url = "/arena/getRead?page=" + page + "&perpage=" + perpage
    if (params && Array.isArray(params)) {
        params.forEach((param) => {
            const keys = Object.keys(param);
            keys.forEach((key) => {
                url += "&" + key + "=" + param[key];
            });
        });
    }
    let data = null;
    try {
        data = await axios.get(url)
        data = data.data;
    } catch (e) {
        data = e.respons.data;
    }

    if (data.data) {
        for (var i = 0; i < data.data.rows.length; i++) {
            let isFeatured = false;
            if (data.data.rows[i].images) {
                for (var j = 0; j < data.data.rows[i].images.length; j++) {
                    if (data.data.rows[i].images[j].isFeatured) {
                        data.data.rows[i].featured = data.data.rows[i].images[j].path
                        isFeatured = true;
                        break;
                    }
                }
            }
            if (!isFeatured) {
                const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
                data.data.rows[i].featured = nofeatured;
            }
        }
    }
    //console.info(data);
    return data
}

// export const getList = async (manager_token) => {
//     const url = "/arena/getList?manager_token="+manager_token
//     const response = await fetch(url)
//     const data = await response.json()

//     for (var i = 0; i < data.data.rows.length; i++) {
//         const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
//         const featured = data.data.rows[i].featured
//         var src = (featured === null || featured === undefined) ?  nofeatured : process.env.REACT_APP_ASSETS_DOMAIN + featured
//         data.data.rows[i].featured = src
//     }
//     return data
// }

export const getOneAPI = async (arenaToken, scenario='read') => {
    const url = "/arena/getOne?arena_token="+arenaToken+'&scenario='+scenario
    let data = await axios.get(url);
    // console.info(data);

    return data.data
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = process.env.REACT_APP_API + "/arena/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
    return data.data;
}

export const deleteOneAPI = async (accessToken, arenaToken) => {
    const url = "/arena/deleteOne"
    let data = null;
    try {
        const query = axiosPrivate(accessToken); 
        data = query.delete(url, {data: 
            {arena_token: arenaToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}
