const domain = process.env.REACT_APP_API
//const headers = {'Content-Type': 'application/json',}

// 搜尋球館api
// k：關鍵字
export const filterKeywordAPI = async (k) => {
    const url = domain + "/arena/getFilterKeyword?k=" + k

    const response = await fetch(url)
    var data = await response.json()

    return data.data
}

export const getList = async (manager_token) => {
    const url = domain + "/arena/getList?manager_token="+manager_token
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