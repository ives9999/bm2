import {getOneAPI} from '../context/product/ProductAction/getOneAPI';

export default async function useProductOne(token, scenario) {
    let data = await getOneAPI(token, scenario);
    return data;
}

