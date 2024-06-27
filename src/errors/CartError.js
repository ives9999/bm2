export const PRODUCTEXIST = 4200;     // 商品已在購物車內
export const QUANTITYEMPTY = 4201;    // 沒有傳送商品數量
export const PRODUCTNOTEXIST = 4202;  // 商品不存在
export const ITEMNOTEXIST = 4203;     // 購物車項目不存在
export const ITEMTOKENBLANK = 4204;   // 購物車項目金鑰不能為空白

export function getProductExistError() {
    const id = PRODUCTEXIST
    const msg = "商品已在購物車內"
    return {"id": id, "msg": msg}
}

export function getQuantityEmptyError() {
    const id = QUANTITYEMPTY
    const msg = "沒有傳送商品數量"
    return {"id": id, "msg": msg}
}

export function getProductNotExistError() {
    const id = PRODUCTNOTEXIST
    const msg = "商品不存在"
    return {"id": id, "msg": msg}
}

export function getItemNotExistError() {
    const id = ITEMNOTEXIST
    const msg = "購物車項目不存在"
    return {"id": id, "msg": msg}
}

export function getItemTokenBlankError() {
    const id = ITEMTOKENBLANK
    const msg = "購物車項目金鑰不能為空白"
    return {"id": id, "msg": msg}
}
