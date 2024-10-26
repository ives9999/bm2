//import toCookie from "../../api/toCookie"
//import axios from "axios"
//import BMContext from "../BMContext";
//import { useContext } from "react";
import axios from '../../api/axios';
import { axiosPrivate } from '../../api/axios';
import { axioxFormData } from '../../api/axios';

const domain = process.env.REACT_APP_API;

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
    let data = null;
    try {  
        data = await axios.post(url, 
            JSON.stringify(formData), {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    // const data = await axios.post(url, 
    //     JSON.stringify(formData), {
    //         headers: {'Content-Type': 'application/json'},
    //     }
    // );
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
    //return data.data
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
export const getOneAPI = async (accessToken, member_token, scenario='read') => {
    const url = domain + "/member/getOne?member_token=" + member_token + "&scenario=" + scenario;
    const query = axiosPrivate(accessToken);

    let data = null;
    try {  
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const getReadAPI = async (accessToken, page=1, perpage=20, params=null) => {
    console.info(params);
    var url = "/member/getRead?page=" + page + "&perpage=" + perpage
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        })
    }
    let data = null;
    const query = axiosPrivate(accessToken);
    try {
        data = await query.get(url);
        data = data.data;
    } catch(e) {
        data = e.response.data;
    }
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

export const registerPosAPI = async (accessToken, formData) => {
    const url = "/member/postPosRegister"
    const query = axiosPrivate(accessToken);

    let data = null;
    try {
        data = await query.post(url, formData);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}


// 會員註冊api
// formData：會員註冊資料，物件資料{name: "ives"...}
export const moreDataAPI = async (accessToken, formData) => {
    const url = "/member/postMoreData"
    const query = axiosPrivate(accessToken);

    let data = null;
    try {  
        data = await query.post(url, formData);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(formData)
    // })
    // const data = await response.json()
    // return data
}

export const contactDataAPI = async (accessToken, params) => {
    const url = "/member/postContactData"
    const query = axiosPrivate(accessToken);

    let data = null;
    try {
        data = await query.post(url, params);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
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
export const getValidateAPI = async (type, code, token) => {
    const url = "/member/getValidate?type=" + type + "&code=" + code + "&token=" + token
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

export const postUpdateAPI = async (accessToken, formData) => {
    const url = "/member/postUpdate" 
    const query = axioxFormData(accessToken);      
    let data = await query.post(url, formData);   
    
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

// 取得會員資料
// 會員的token
export const getCartAPI = async (accessToken, scenario='read',page=1, perpage=20) => {
    const url = domain + "/member/getCart?page=" + page + "&perpage=" + perpage + "&scenario=" + scenario;
    const query = axiosPrivate(accessToken);

    let data = null;
    try {  
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

// 取得會員資料
// 會員的token
export const getCartsAPI = async (accessToken, member_token, page=1, perpage=20) => {
    const url = domain + "/member/getCarts?member_token=" + member_token + "&page=" + page + "&perpage=" + perpage;
    const query = axiosPrivate(accessToken);

    let data = null;
    try {
        data = await query.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

export const deleteCartAPI = async (accessToken, cartToken) => {
    const url = "/member/deleteCart"
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
    const url = domain + "/member/deleteItem";
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

// 搜尋球館api
// k：關鍵字
export const filterKeywordAPI = async (k) => {
    const url = domain + "/member/getFilterKeyword?k=" + k

    const data = await axios.get(url)

    return data.data
}

// 會員在門店註冊後，需用此功能來設定登入app的密碼
export const setPasswordForStore1 = async (mobile, password, rePassword) => {
    const url = domain + "/member/postSetPasswordForStore";
    let data = null;
    try {
        data = await axios.post(url, {
            mobile: mobile, 
            password: password, 
            rePassword: rePassword
        });
    } catch (e) {
        data = e.respons.data;
    }
    return data
}

// 會員在門店註冊後，需用此功能來驗證手機驗證碼
export const setPasswordForStore2 = async (code, mobile) => {
    const url = domain + "/member/postSendCodeForStore";
    let data = null;
    try {
        data = await axios.post(url, {
            code: code, 
            mobile: mobile, 
        });
    } catch (e) {
        data = e.response;
    }
    //console.info(data);
    return data
}

export const hasCart = async (token) => {
    // eslint-disable-next-line no-useless-concat
    const url = domain + "/member/getHasCart" + "?token=" + token;
    let data = null;
    try {
        data = await axios.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
}

