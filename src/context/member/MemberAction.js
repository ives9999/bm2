//import toCookie from "../../api/toCookie"
//import axios from "axios"
//import BMContext from "../BMContext";
//import { useContext } from "react";
import axios from '../../api/axios';
import { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API;
const headers = {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ' + accessToken,
};

// 會員登入api
// email：會員登入的email
// password：會員登入的密碼
export const loginAPI = async (email, password) => {
    const formData = {email: email, password: password}
    const url = domain + "/member/postLogin"

    // const axiosPrivate = axios.create({
    //     baseURL: domain + "/member/postLogin",
    //     headers: {'Content-Type': 'application/json'},
    // })

    const data = await axios.post(url, 
        JSON.stringify(formData), {
            headers: {'Content-Type': 'application/json'},
        }
    );
    //console.info(data.data);

    //const response = await fetch(url, {
        //credentials: 'same-origin',
        //credentials: "include",
        //method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(formData)
    // })

    //console.log(response.headers.getSetCookie());
    // for(let entry of response.headers.entries()) {
    //     console.log('header', entry);
    // }
    // const data = await response.json()
    // console.info(data)
    return data.data
}

// 會員登出api
export const logoutAPI = (setAuth) => {
    localStorage.clear();
    setAuth({});

    // localStorage.removeItem('accessToken')
    // localStorage.removeItem('refreshToken')
    //toCookie('LOGOUT')
}

// 取得會員資料
// 會員的token
export const getOneAPI = async (accessToken) => {
    //if (token !== null && token !== undefined && token.trim().length > 0) {
        const url = domain + "/member/getOne";
        const query = axiosPrivate(accessToken);

        let data = null;
        try {  
            data = await query.get(url);
            return data.data;
        } catch (e) {
            return e.response.data;
        }
        //.then(response => {
            // const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
            // const avatar = data.data.avatar
            // var src = (avatar === null || avatar === undefined || avatar.length === 0) 
            //     ?  noavatar 
            //     : process.env.REACT_APP_ASSETS_DOMAIN + process.env.REACT_APP_IMAGE_PREFIX + avatar
            // data.data.avatar = src
            //data = response.data
        //})
        //return data.data
        //const response = await fetch(url)
        // var data = await response.json()    
    //} else {
         //return {}
    //}
}

export const getReadAPI = async (token, page=1, perpage=20) => {
    const url = domain + "/member/getRead?token=" + token + "&page=" + page + "&perpage=" + perpage
    const response = await fetch(url)
    var data = await response.json()
    return data
}

// 會員註冊api
// formData：會員註冊資料，物件資料{name: "ives"...}
export const registerAPI = async (formData) => {
    const url = domain + "/member/postRegister"
    //console.info(formData);
    try {
        const data = await axios.post(url, JSON.stringify(formData));
        //console.info(data);
        return data.data
    } catch (e) {
        //console.info(error.response.data);
        return e.response.data;
    }
    // let data = await axios.post(url, JSON.stringify(formData));
    //console.info(data);

    // await axios.post(url, JSON.stringify(formData), headers)
    // .then((res) => console.log(res.data))
    // .catch((err) => console.error(err));

    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(formData)
    // })
    // const data = await response.json();
    //return {};
}

// 會員註冊api
// formData：會員註冊資料，物件資料{name: "ives"...}
export const moreDataAPI = async (formData) => {
    const url = domain + "/member/postMoreData"

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    return data
}

// 取得會員認證碼，會員重新取得認證碼時使用
// type："email" or "mobile"
// token：會員token
export const getValidateCodeAPI = async (accessToken, type, token) => {
    if (token !== null && token !== undefined && token.trim().length > 0) {
        const url = "/member/getValidateCode?type=" + type + "&token=" + token;
        const query = axiosPrivate(accessToken);

        let data = null;
        try {  
            data = await query.get(url);
            return data.data;
        } catch (e) {
            return e.response.data;
        }
    
        // const response = await fetch(url)
        // const data = await response.json()
        // return data
    } else {
        return {}
    }
}

// 會員認證時使用
// type："email" or "mobile"
// code：會員所填的認證碼
// token：會員token
export const getValidateAPI = async (accessToken, type, code, token) => {
    const url = "/member/getValidate?type=" + type + "&code=" + code + "&token=" + token
    const query = axiosPrivate(accessToken);

    let data = null;
    try {  
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    // const response = await fetch(url)
    // const data = await response.json()
    // return data
}

// 會員更換密碼
// formData：會員註冊資料，物件資料{oldPassword: "1234", newPassword: "12345", reNewPassword: "12345"}
export const putChangePasswordAPI = async (accessToken, formData) => {
    const url = "/member/putChangePassword"

    let data = null;
    try {  
        const query = axiosPrivate(accessToken);      
        data = await query.put(url, formData);   
        return data.data;
    } catch (e) {
        return e.response.data;
    }

    // const response = await fetch(url, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + accessToken,
    //     },
    //     body: JSON.stringify(formData)
    // })
    // const data = await response.json()
    //return data
}

// 會員忘記密碼，系統會寄出重新設定密碼的網址給會員
// email：會員註冊時的email
export const getForgetPasswordAPI = async (email) => {
    const url = "/member/getForgetPassword?email=" + email 
    let data = null;
    try {
        data = await axios.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    // const response = await fetch(url)
    // const data = await response.json()
    // return data
}

// 設定密碼，忘記密碼時使用
// formData：會員密碼資料{password: "1234", repassword: "1234"}
export const putSetPasswordAPI = async (formData) => {
    const url = "/member/putSetPassword"
    let data = null;
    try {  
        data = await axios.put(url, formData);   
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    // const response = await fetch(url, {
    //     method: 'PUT',
    //     headers: headers,
    //     body: JSON.stringify(formData)
    // })
    // const data = await response.json()
    // return data
}

// 更新會員頭像api
// formData：其中的值如下：
// token：會員token
// field：要傳到server圖片的名稱，這邊就是avatar，php用_FILE["avatar"]來接收
// selectedImage：要傳的圖檔，blob格式
// 不知道為什麼，使用fetch都無法成功
export const postAvatarAPI = async (accessToken, formData) => {
    const url = process.env.REACT_APP_API + "/member/postAvatar"

    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   

    
    // const config = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "multipart/form-data"
    //     },
    // }
    // const data = await axios.post(url, formData, config)
    return data
}

export const getAccessTokenAPI = async (refreshToken) => {

    const url = "/member/getAccessToken?refresh_token=" + refreshToken;
    const data = await axios.get(url)
    //console.info(data);

    // const url = domain + "/member/getAccessToken?refresh_token=" + refreshToken;
    // const instance1 = axios.create({
    //     baseURL: domain,
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     withCredentials: true,
    // });
    // let data = await instance1.get(url);
    return data.data;
}
