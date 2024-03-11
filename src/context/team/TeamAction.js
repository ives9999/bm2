import axios, { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}

export const homeTeamAPI = async () => {
    const url = domain + "/home/team"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getListAPI = async (manager_token, page=1, perpage=20) => {
    const url = domain + "/team/getList?manager_token="+manager_token+"&page="+page+"&perpage="+perpage
    let data = await axios.get(url);
    //console.info(data);
    data = data.data;

    // const response = await fetch(url)
    // const data = await response.json()

    for (var i = 0; i < data.data.rows.length; i++) {
        const row = data.data.rows[i]
        const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
        if (row.images !== undefined && row.images !== null && row.images.length > 0) {
            var isFeatured = false
            for (var j = 0; j < row.images.length; j++) {
                const image = row.images[j]
                if (image.isFeatured) {
                    row.featured = image.path
                    isFeatured = true
                    break
                }
            }
            if (!isFeatured) {
                row.featured = nofeatured    
            }
        } else {
            row.featured = nofeatured
        }
        // const featured = data.data.rows[i].featured
        // var src = (featured === null || featured === undefined) 
        //     ?  nofeatured 
        //     : process.env.REACT_APP_ASSETS_DOMAIN + process.env.REACT_APP_IMAGE_PREFIX + featured.path
        data.data.rows[i] = row
    }
    return data
}

export const getReadAPI = async (page=1, perpage=20) => {
    const url = "/team";
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

export const deleteOneAPI = async (token) => {
    const url = process.env.REACT_APP_API + "/team/deleteOne"
    
    const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({token: token})
    })
    const data = await response.json()
    return data
}

export const getOneAPI = async (token, scenario='read') => {
    const url = "/team/getOne?token="+token+'&scenario='+scenario
    let data = await axios.get(url);

    // const response = await fetch(url)
    // const data = await response.json()

    //const nofeatured = (scenario === 'read') ? process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png" : ""
    // "featured": {
    //     "path": "/82/a5/82a5340990acc94a478de582c77a31fb.jpg",
    //     "upload_id": "4802"
    // },
    // const featured = data.data.featured
    // var src = (featured === null || featured === undefined || featured.path.length === 0) 
    //     ?  nofeatured 
    //     : process.env.REACT_APP_ASSETS_DOMAIN + process.env.REACT_APP_IMAGE_PREFIX + featured.path
    // data.data.featured.path = src

    // const images = data.data.images
    // if (images !== undefined && images !== null && images.length > 0) {
    //     images.map((image, idx) => {
    //         const image_url = process.env.REACT_APP_ASSETS_DOMAIN + process.env.REACT_APP_IMAGE_PREFIX + image.path
    //         images[idx]["path"] = image_url
    //         return image_url   
    //     })
    // }
    //console.info(images)

    return data.data
}