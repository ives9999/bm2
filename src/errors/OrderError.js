export const CARTNOTEXIST = 4300;     // 購物車不存在
export const GATEWAYMETHODEMPTY = 4302;     // 沒有選擇付款方式
export const SHIPPINGMETHODEMPTY = 4303;    // 沒有選擇到貨方式
export const ORDERNAMEEMPTY = 4304;   // 收貨者不能為空白
export const ORDERTELEMPTY = 4305;    // 訂購者電話不能為空白
export const ORDEREMAILEMPTY = 4306;  // 訂購者Email不能為空白
export const ORDERCITYEMPTY = 4307;   // 請選擇訂購者縣市
export const ORDERAREAEMPTY = 4308;   // 請選擇訂購者區域
export const ORDERROADEMPTY = 4309;   // 訂購者路名，街道不能為空白
export const INVOICETYPEEMPTY = 4310;   // 沒有選擇發票類型
export const INVOICEEMAILEMPTY = 4311   // 發票寄送email不能為空白
export const INVOICECOMPANYEMPTY = 4312;   // 沒有填寫發票抬頭
export const INVOICETAXEMPTY = 4313;   // 沒有填寫發票統編


export function getCartNotExistError()
{
    const id = CARTNOTEXIST;
    const msg = "購物車不存在";
    return {"id": id, "msg": msg}
}

/**
 * Error if gateway is empty
 * @return {msg: string, id: number}        [description]
 */
export function getGatewayMethodEmptyError()
{
    const id = GATEWAYMETHODEMPTY;
    const msg = "沒有選擇付款方式";
    return {"id": id, "msg": msg}
}

/**
 * Error if shipping is empty
 * @return [type]        [description]
 */
export function getShippingMethodEmptyError()
{
    const id = SHIPPINGMETHODEMPTY;
    const msg = "沒有選擇到貨方式";
    return {"id": id, "msg": msg}
}

/**
 * Error if order name is empty
 * @return [type]        [description]
 */
export function getOrderNameEmptyError()
{
    const id = ORDERNAMEEMPTY;
    const msg = "收貨者不能為空白";
    return {"id": id, "msg": msg}
}

/**
 * Error if order tel is empty
 * @return [type]        [description]
 */
export function getOrderTelEmptyError()
{
    const id = ORDERTELEMPTY;
    const msg = "訂購者電話不能為空白";
    return {"id": id, "msg": msg}
}

/**
 * Error if order email is empty
 * @return [type]        [description]
 */
export function getOrderEmailEmptyError()
{
    const id = ORDEREMAILEMPTY;
    const msg = "訂購者Email不能為空白";
    return {"id": id, "msg": msg}
}

/**
 * Error if order city is empty
 * @return [type]        [description]
 */
export function getOrderCityEmptyError()
{
    const id = ORDERCITYEMPTY;
    const msg = "請選擇訂購者縣市";
    return {"id": id, "msg": msg}
}

/**
 * Error if order area is empty
 * @return [type]        [description]
 */
export function getOrderAreaEmptyError()
{
    const id = ORDERAREAEMPTY;
    const msg = "請選擇訂購者區域";
    return {"id": id, "msg": msg}
}

/**
 * Error if order road is empty
 * @return [type]        [description]
 */
export function getOrderRoadEmptyError()
{
    const id = ORDERROADEMPTY;
    const msg = "訂購者路名，街道不能為空白";
    return {"id": id, "msg": msg}
}

/**
 * Error if invoice type is empty
 * @return [type]        [description]
 */
export function getInvoiceTypeEmptyError()
{
    const id = INVOICETYPEEMPTY;
    const msg = "沒有選擇發票類型";
    return {"id": id, "msg": msg};
}

/**
 * Error if invoice email is empty
 * @return [type]        [description]
 */
export function getInvoiceEmailEmptyError()
{
    const id = INVOICEEMAILEMPTY;
    const msg = "發票寄送email不能為空白";
    return {"id": id, "msg": msg};
}

/**
 * Error if invoice company is empty
 * @return [type]        [description]
 */
export function getInvoiceCompanyEmptyError()
{
    const id = INVOICECOMPANYEMPTY;
    const msg = "沒有填寫發票抬頭";
    return {"id": id, "msg": msg}
}

/**
 * Error if invoice tax is empty
 * @return [type]        [description]
 */
export function getInvoiceTaxEmptyError()
{
    const id = INVOICETAXEMPTY;
    const msg = "沒有填寫發票統編";
    return {"id": id, "msg": msg}
}