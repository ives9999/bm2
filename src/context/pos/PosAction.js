import { axiosPrivate } from '../../api/axios';

const domain = process.env.REACT_APP_API;

export const getAllMemberAPI = async (accessToken, startDate, endDate) => {
    let url = `${domain}/pos/getMembers?startDate=${startDate}&endDate=${endDate}`;
    //console.info(url);
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}
