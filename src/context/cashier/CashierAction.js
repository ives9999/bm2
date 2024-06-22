import axios from '../../api/axios';
import { axiosPrivate } from '../../api/axios';
const domain = process.env.REACT_APP_API;
// 搜尋球館api
// k：關鍵字
export const filterKeywordAPI = async (k) => {
    const url = domain + "/cashier/getFilterKeyword?k=" + k

    const data = await axios.get(url)

    return data.data
}
