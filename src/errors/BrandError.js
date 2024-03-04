export const BRANDNAMEBLANK = 4000;     // 品牌名稱不能為空白
export const BRANDNAMEEXIST = 4001;     // 品牌名稱已存在
export const ALIASBLANK = 4002;         // 品牌英文或別名不能為空白
export const ALIASEXIST = 4003;         // 品牌英文或別名已存在

export function GetBrandNameBlankError() {

    const id = BRANDNAMEBLANK
    const msg = "品牌名稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetBrandNameExistError() {

    const id = BRANDNAMEEXIST
    const msg = "品牌名稱已存在"
    return {"id": id, "msg": msg}
}

export function GetAliasBlankError() {

    const id = ALIASBLANK
    const msg = "品牌英文或別名不能為空白"
    return {"id": id, "msg": msg}
}

export function GetAliasExistError() {

    const id = ALIASEXIST
    const msg = "品牌英文或別名已存在"
    return {"id": id, "msg": msg}
}
