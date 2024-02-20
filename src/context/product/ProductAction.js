//import toCookie from "../../api/toCookie"
// import axios from "axios"
import axios from '../../api/axios';
import { axiosPrivate } from '../../api/axios';


const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}
const token = localStorage.getItem('accessToken')

const instance = axios.create({
    baseURL: domain,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
    withCredentials: true,
});

export const getReadAPI = async (page=1, perpage=20) => {
    const url = "/product/getRead?page=" + page + "&perpage=" + perpage
    let data = await axios.get(url)
    data = data.data;

    // const response = await fetch(url, {credentials: "same-origin",})
    // var data = await response.json()
    if (data.data) {
        for (var i = 0; i < data.data.rows.length; i++) {
            for (var j = 0; j < data.data.rows[i].images.length; j++) {
                if (data.data.rows[i].images[j].isFeatured) {
                    data.data.rows[i].featured = data.data.rows[i].images[j].path
                }
            }
        }
    }
    return data
}

export const getOneAPI = async (productToken, scenario='read') => {
    const url = domain + "/product/getOne?product_token="+productToken+'&scenario='+scenario
    let data = await axios.get(url);
    //console.info(data.data)
    // const response = await fetch(url)
    // const data = await response.json()

    return data.data
}

export const postCreateAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/product/postCreate"
    
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }
    var data = null
    try {
        data = await axios.post(url, formData, config)
    } catch (e) {
        data = e.response.data
    }
    return data
}

export const postUpdateAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/product/postUpdate"

    // const data = await axios.post(url, 
    //     JSON.stringify(formData), {
    //         headers: {'Content-Type': 'application/json'},
    //         //withCredentials: true,
    //     }
    // );
    
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': 'Bearer ' + token,
        },
        'Access-Control-Allow-Credentials': true,
        //withCredentials: true,
    }
    var data = null
    try {
        data = await axios.post(url, formData, config)
    } catch (e) {
        data = e.response.data
    }
    return data
}

export const deleteOneAPI = async (token) => {
    const url = process.env.REACT_APP_API + "/product/deleteOne"
    
    const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({token: token})
    })
    const data = await response.json()
    return data
}
