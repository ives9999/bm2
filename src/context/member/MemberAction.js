import toCookie from "../../api/toCookie"
import axios from "axios"

const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}

// 會員登入api
// email：會員登入的email
// password：會員登入的密碼
export const loginAPI = async (email, password) => {
    const formData = {email: email, password: password}
    const url = domain + "/member/postLogin"

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    return data
}

// 會員登出api
export const logoutAPI = () => {
    toCookie('LOGOUT')
}

// 取得會員資料
// 會員的token
export const memberGetOneAPI = async (token) => {
    if (token !== null && token !== undefined && token.trim().length > 0) {
        const url = domain + "/member/getOne?token=" + token
        const response = await fetch(url)
        var data = await response.json()

        const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
        const avatar = data.data.avatar
        var src = (avatar === null) ?  noavatar : process.env.REACT_APP_ASSETS_DOMAIN + "/uploads" + avatar
        data.data.avatar = src
    
        return data
    } else {
        return {}
    }
}

// 會員註冊api
// formData：會員註冊資料，物件資料{name: "ives"...}
export const registerAPI = async (formData) => {
    const url = domain + "/member/postRegister"

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
export const getValidateCodeAPI = async (type, token) => {
    if (token !== null && token !== undefined && token.trim().length > 0) {
        const url = domain + "/member/getValidateCode?type=" + type + "&token=" + token 
        const response = await fetch(url)
        const data = await response.json()
        return data
    } else {
        return {}
    }
}

// 會員認證時使用
// type："email" or "mobile"
// code：會員所填的認證碼
// token：會員token
export const getValidateAPI = async (type, code, token) => {
    const url = domain + "/member/getValidate?type=" + type + "&code=" + code + "&token=" + token 
    const response = await fetch(url)
    const data = await response.json()
    return data
}

// 會員更換密碼
// formData：會員註冊資料，物件資料{oldPassword: "1234", newPassword: "12345", reNewPassword: "12345"}
export const putChangePasswordAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/member/putChangePassword"
    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    return data
}

// 會員忘記密碼，系統會寄出重新設定密碼的網址給會員
// email：會員註冊時的email
export const getForgetPasswordAPI = async (email) => {
    const url = domain + "/member/getForgetPassword?email=" + email 
    const response = await fetch(url)
    const data = await response.json()
    return data
}

// 設定密碼，忘記密碼時使用
// formData：會員密碼資料{password: "1234", repassword: "1234"}
export const putSetPasswordAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/member/putSetPassword"
    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    return data
}

// 更新會員頭像api
// token：會員token
// field：要傳到server圖片的名稱，這邊就是avatar，php用_FILE["avatar"]來接收
// selectedImage：要傳的圖檔，blob格式
// 不知道為什麼，使用fetch都無法成功
export const postAvatarAPI = async (token, field, selectedImage) => {
    const url = process.env.REACT_APP_API + "/member/postAvatar"
    const formData = new FormData()
    formData.append("token", token)
    formData.append("name", field)
    formData.append('avatar', selectedImage)
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }
    const data = await axios.post(url, formData, config)
    return data
}
