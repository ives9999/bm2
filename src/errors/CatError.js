export const CATNAMEBLANK = 4000;       // 分類名稱不能為空白
export const CATNAMEEXIST = 4001;       // 分類名稱已存在
export const ALIASBLANK = 4002;         // 分類英文或別名不能為空白
export const ALIASEXIST = 4003;         // 分類英文或別名已存在

export function GetCatNameBlankError() {

    const id = CATNAMEBLANK
    const msg = "分類名稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetCatNameExistError() {

    const id = CATNAMEEXIST
    const msg = "分類名稱已存在"
    return {"id": id, "msg": msg}
}

export function GetAliasBlankError() {

    const id = ALIASBLANK
    const msg = "分類英文或別名不能為空白"
    return {"id": id, "msg": msg}
}

export function GetAliasExistError() {

    const id = ALIASEXIST
    const msg = "分類英文或別名已存在"
    return {"id": id, "msg": msg}
}
