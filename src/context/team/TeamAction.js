import axios from "axios"

const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}

export const homeTeamAPI = async () => {
    const url = domain + "/home/team"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getListAPI = async (manager_token) => {
    const url = domain + "/team/getList?manager_token="+manager_token
    const response = await fetch(url)
    const data = await response.json()

    for (var i = 0; i < data.data.rows.length; i++) {
        const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
        const featured = data.data.rows[i].featured
        var src = (featured === null || featured === undefined) ?  nofeatured : process.env.REACT_APP_ASSETS_DOMAIN + featured
        data.data.rows[i].featured = src
    }
    return data
}

export const postCreateAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/team/postCreate"
    
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

export const putUpdateAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/team/putUpdate"
    
    const config = {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data"
        },
    }
    var data = null
    try {
        data = await axios.put(url, formData, config)
    } catch (e) {
        data = e.response.data
    }
    return data
}

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
    const url = domain + "/team/getOne?token="+token+'&scenario='+scenario
    const response = await fetch(url)
    const data = await response.json()

    const nofeatured = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/nophoto.png"
    const featured = data.data.featured
    if (scenario === 'read') {
        var src = (featured === null || featured === undefined || featured.length === 0) ?  nofeatured : process.env.REACT_APP_ASSETS_DOMAIN + featured
        data.data.featured = src
    }
    return data
}