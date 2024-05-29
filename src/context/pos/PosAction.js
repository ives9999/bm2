import { axiosPrivate } from '../../api/axios';

export const getAllMemberAPI = async (accessToken) => {
    let url = "/pos/getMembers";
    let data = null;
    try {
        const query = axiosPrivate(accessToken);
        data = query.get(url);
    } catch (e) {
        data = e.respons.data;
    }
    return data;
}
