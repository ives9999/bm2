export const ARENAINVALID = 5000;       // 球館不存在
export const ARENATELBLANK = 5001;      // 球館電話不能為空白
export const ARENACITYBLANK = 5003;     // 球館縣市不能為空白
export const ARENAAREABLANK = 5004;     // 球館區域不能為空白
export const ARENAROADBLANK = 5005;     // 球館路名不能為空白

export const ARENANAMEBLANK = 5008;     // 球隊名稱不能為空白

export function GetArenaInvalidError() {
    const id = ARENAINVALID
    const msg = "球館不存在"
    return {"id": id, "msg": msg}
}

export function GetArenaTelBlankError() {
    const id = ARENATELBLANK
    const msg = "球館電話不能為空白"
    return {"id": id, "msg": msg}
}

export function GetArenaCityBlankError() {
    const id = ARENACITYBLANK
    const msg = "球館縣市不能為空白"
    return {"id": id, "msg": msg}
}

export function GetArenaAreaBlankError() {
    const id = ARENAAREABLANK
    const msg = "球館區域不能為空白"
    return {"id": id, "msg": msg}
}

export function GetArenaRoadBlankError() {
    const id = ARENAROADBLANK
    const msg = "球館路名不能為空白"
    return {"id": id, "msg": msg}
}

export function GetArenaNameBlankError() {
    const id = ARENANAMEBLANK
    const msg = "球館名稱不能為空白"
    return {"id": id, "msg": msg}
}
