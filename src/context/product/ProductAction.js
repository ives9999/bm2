import toCookie from "../../api/toCookie"
import axios from "axios"

const domain = process.env.REACT_APP_API
const headers = {'Content-Type': 'application/json',}

export const getReadAPI = async (token, page=1, perpage=20) => {
    const url = domain + "/product/getRead?token=" + token + "&page=" + page + "&perpage=" + perpage
    const response = await fetch(url)
    var data = await response.json()
    for (var i = 0; i < data.data.rows.length; i++) {
        for (var j = 0; j < data.data.rows[i].images.length; j++) {
            if (data.data.rows[i].images[j].isFeatured) {
                data.data.rows[i].featured = data.data.rows[i].images[j].path
            }
        }
    }
    return data
}
