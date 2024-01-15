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

export const postUpdateAPI = async (formData) => {
    const url = process.env.REACT_APP_API + "/team/postUpdate"
    
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

    return data
}