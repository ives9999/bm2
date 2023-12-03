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
    window.location.reload()
}

export const memberGetOneAPI = async (token) => {
    const url = domain + "/member/getOne?token=" + token
    const response = await fetch(url)
    const data = await response.json()
    return data
}