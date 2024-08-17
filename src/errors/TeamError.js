export const TEAMINVALID = 2000;       // 球隊不存在
export const TEAMEMAILBLANK = 2001;    // 球隊email不能為空白
export const TEAMEMAILINVALID = 2002;  // 球隊email不存在
export const TEAMEMAILEXIST = 2003;    // 球隊email已經註冊
export const TEAMMOBILEBLANK = 2014;   // 球隊手機不能為空白
export const TEAMMOBILEINVALID = 2015; // 球隊手機不存在
export const TEAMMOBILEEXIST = 2016;   // 球隊手機已存在
export const ARENABLANK = 2017;        // 球隊所在球館不能為空白
export const LEADERBLANK = 2018;       // 球隊隊長名稱不能為空白

export const TEAMNAMEBLANK = 2008;     // 球隊名稱不能為空白
export const TEAMNAMEEXIST = 2010;     // 球隊名稱已存在


export function GetTeamInvalidError() {

    const id = TEAMINVALID
    const msg = "球隊不存在"
    return {"id": id, "msg": msg}
}

export function GetTeamEmailBlankError() {

    const id = TEAMEMAILBLANK
    const msg = "球隊email不能為空白"
    return {"id": id, "msg": msg}
}

export function GetTeamEmailInvalidError() {

    const id = TEAMEMAILINVALID
    const msg = "球隊email不存在"
    return {"id": id, "msg": msg}
}

export function GetTeamEmailExistError() {

    const id = TEAMEMAILEXIST
    const msg = "球隊email已經註冊"
    return {"id": id, "msg": msg}
}

export function GetTeamMobileBlankError() {

    const id = TEAMMOBILEBLANK
    const msg = "球隊手機不能為空白"
    return {"id": id, "msg": msg}
}

export function GetTeamMobileInvalidError() {

    const id = TEAMMOBILEINVALID
    const msg = "球隊手機不存在"
    return {"id": id, "msg": msg}
}

export function GetTeamMobileExistError() {

    const id = TEAMMOBILEEXIST
    const msg = "球隊手機已存在"
    return {"id": id, "msg": msg}
}

export function GetArenaBlankError() {

    const id = ARENABLANK
    const msg = "球隊所在球館不能為空白"
    return {"id": id, "msg": msg}
}

export function GetLeaderBlankError() {

    const id = LEADERBLANK
    const msg = "球隊隊長名稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetTeamNameBlankError() {

    const id = TEAMNAMEBLANK
    const msg = "球隊名稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetTeamNameExistError() {

    const id = TEAMNAMEEXIST
    const msg = "球隊名稱已存在"
    return {"id": id, "msg": msg}
}








