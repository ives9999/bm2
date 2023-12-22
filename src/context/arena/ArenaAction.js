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