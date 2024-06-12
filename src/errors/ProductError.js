export const PRODUCTNAMEBLANK = 3000;     // 商品名稱不能為空白
export const PRODUCTNAMEEXIST = 3001;     // 商品名稱已存在
export const ORDERMINBLANK = 3002;        // 最少訂購量不能為空白
export const ORDERMAXBLANK = 3003;        // 最大訂購量不能為空白
export const UNITBLANK = 3004;            // 商品單位不能為空白
export const PRODUCTINVALID = 3005;       // 無此商品

export function GetProductNameBlankError() {

    const id = PRODUCTNAMEBLANK
    const msg = "商品名稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetProductNameExistError() {

    const id = PRODUCTNAMEEXIST
    const msg = "商品名稱已存在"
    return {"id": id, "msg": msg}
}

export function GetOrderMinBlankError() {

    const id = ORDERMINBLANK
    const msg = "最少訂購量不能為空白"
    return {"id": id, "msg": msg}
}

export function GetOrderMaxBlankError() {

    const id = ORDERMAXBLANK
    const msg = "最大訂購量不能為空白"
    return {"id": id, "msg": msg}
}

export function GetUnitBlankError() {

    const id = UNITBLANK
    const msg = "商品單位不能為空白"
    return {"id": id, "msg": msg}
}

export function getProductInvalidError() {

    const id = PRODUCTINVALID
    const msg = "無此商品"
    return {"id": id, "msg": msg}
}