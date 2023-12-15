import toCookie from "../../api/toCookie"

const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}

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

export const logoutAPI = () => {
    toCookie('LOGOUT')
}

export const memberGetOneAPI = async (token) => {
    if (token !== null && token !== undefined && token.trim().length > 0) {
        const url = domain + "/member/getOne?token=" + token
        const response = await fetch(url)
        var data = await response.json()

        const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
        const avatar = data.data.avatar
        var src = (avatar === null) ?  noavatar : process.env.REACT_APP_ASSETS_DOMAIN + avatar
        data.data.avatar = src
    
        return data
    } else {
        return {}
    }
}

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

export const getValidateAPI = async (type, code, token) => {
    const url = domain + "/member/getValidate?type=" + type + "&code=" + code + "&token=" + token 
    const response = await fetch(url)
    const data = await response.json()
    return data
}

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

export const getForgetPasswordAPI = async (email) => {
    const url = domain + "/member/getForgetPassword?email=" + email 
    const response = await fetch(url)
    const data = await response.json()
    return data
}

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
        body: formData,
    }

    const response = await fetch(url, config)
    const data = await response.json()
    return data
}
