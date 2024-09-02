import {addCartAPI} from "../context/cart/CartAction";

export default async function AddCart(accessToken, product_token, quantity = 1) {
    const data = await addCartAPI(accessToken, product_token, quantity);
    console.info(data);
    if (data.status === 200) {
        return data.data;
    } else {
        var message = "";
        for (let i = 0; i < data["message"].length; i++) {
            message += data["message"][i].message;
        }
        return message;
    }
}