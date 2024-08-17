import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API
//const headers = {'Content-Type': 'application/json',}

export const homeTeamAPI = async () => {
    const url = domain + "/home/team"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

// export const getListAPI = async (manager_token, page=1, perpage=20) => {
//     const url = domain + "/team/getList?manager_token="+manager_token+"&page="+page+"&perpage="+perpage
//     let data = await axios.get(url);
//     //console.info(data);
//     data = data.data;

//     // const response = await fetch(url)
//     // const data = await response.json()

//     for (var i = 0; i < data.data.rows.length; i++) {
//         const row = data.data.rows[i]
//         const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
//         if (row.images !== undefined && row.images !== null && row.images.length > 0) {
//             var isFeatured = false
//             for (var j = 0; j < row.images.length; j++) {
//                 const image = row.images[j]
//                 if (image.isFeatured) {
//                     row.featured = image.path
//                     isFeatured = true
//                     break
//                 }
//             }
//             if (!isFeatured) {
//                 row.featured = nofeatured    
//             }
//         } else {
//             row.featured = nofeatured
//         }
//         // const featured = data.data.rows[i].featured
//         // var src = (featured === null || featured === undefined) 
//         //     ?  nofeatured 
//         //     : process.env.REACT_APP_ASSETS_DOMAIN + process.env.REACT_APP_IMAGE_PREFIX + featured.path
//         data.data.rows[i] = row
//     }
//     return data
// }

export const getReadAPI = async (page=1, perpage=20, params=null) => {
    let url = "/team/getRead?page=" + page + "&perpage=" + perpage
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
    //console.info(data);
    return data
}

export const postUpdateAPI = async (accessToken, formData) => {
    const url = process.env.REACT_APP_API + "/team/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
    return data.data;
}


// export const postCreateAPI = async (formData) => {
//     const url = process.env.REACT_APP_API + "/team/postCreate"
    
//     const config = {
//         method: "POST",
//         headers: {
//             "Content-Type": "multipart/form-data"
//         },
//     }
//     var data = null
//     try {
//         data = await axios.post(url, formData, config)
//     } catch (e) {
//         data = e.response.data
//     }
//     return data
// }

// export const postUpdateAPI = async (formData) => {
//     const url = process.env.REACT_APP_API + "/team/postUpdate"
    
//     const config = {
//         method: "POST",
//         headers: {
//             "Content-Type": "multipart/form-data"
//         },
//     }
//     var data = null
//     try {
//         data = await axios.post(url, formData, config)
//     } catch (e) {
//         data = e.response.data
//     }
//     return data
// }

export const deleteOneAPI = async (accessToken, teamToken) => {
    const url = "/team/deleteOne"
    let data = null;
    try {
        const query = axiosPrivate(accessToken); 
        data = query.delete(url, {data: 
            {team_token: teamToken},
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}

export const getOneAPI = async (teamToken, scenario='read') => {
    const url = "/team/getOne?team_token="+teamToken+'&scenario='+scenario
    let data = await axios.get(url);
    // console.info(data);

    return data.data
}