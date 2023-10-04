
const MEMBERINVALID = 1000    // 會員不存在

const EMAILBLANK = 1001        // email不能為空白
const EMAILINVALID = 1002      // email不存在
const EMAILEXIST = 1003        // email已經註冊

const PASSWORDBLANK = 1004     // 密碼不能為空白
const PASSWORDINVALID = 1005   // 密碼不符合
const REPASSWORDBLANK = 1006   // 確認密碼不能為空白
const PASSWORDNOTMATCH = 1007  // 密碼不相符

const NAMEBLANK = 1008         // 姓名不能為空白
const NAMEINVALID = 1009       // 姓名不存在
const NAMEEXIST = 1010         // 姓名已存在
const NICKNAMEBLANK = 1011     // 暱稱不能為空白
const NICKNAMEINVALID = 1012   // 暱稱不存在
const NICKNAMEEXIST = 1013     // 暱稱已存在

const MOBILEBLANK = 1014       // 手機不能為空白
const MOBILEINVALID = 1015     // 手機不存在
const MOBILEEXIST = 1016       // 手機已存在

const CITYBLANK = 1017         // 請選擇縣市
const AREABLANK = 1018         // 請選擇區域
const ROADBLANK = 1019         // 路名、街道不能為空白

export function GetEmailBlankError() {

    const id = EMAILBLANK
    const msg = "email不能為空白"
    return {"id": id, "msg": msg}
}

export function GetEmailInvalidError({email}) {

    const id = EMAILINVALID
    const msg = email + " email不存在"
    return {"id": id, "msg": msg} 
}

export function GetMailExistError({email}) {

    const id = EMAILEXIST
    const msg = email + " email不存在"
    return {"id": id, "msg": msg} 
}

export function GetPasswordInvalidError() {

    const id = PASSWORDINVALID
    const msg = "密碼不符合"
    return {"id": id, "msg": msg}
}

export function GetPasswordBlankError() {

    const id = PASSWORDBLANK
    const msg = "密碼不能為空白"
    return {"id": id, "msg": msg}
}

export function GetRePasswordBlankError() {

    const id = REPASSWORDBLANK
    const msg = "確認密碼不能為空白"
    return {"id": id, "msg": msg}
}

export function GetPasswordNotMatchError() {

    const id = PASSWORDNOTMATCH
    const msg = "密碼不相符"
    return {"id": id, "msg": msg}
}

export function GetNicknameBlankError() {

    const id = NICKNAMEBLANK
    const msg = "暱稱不能為空白"
    return {"id": id, "msg": msg}
}

export function GetNicknameInvalidError() {

    const id = NICKNAMEINVALID
    const msg = "暱稱不存在"
    return {"id": id, "msg": msg}
}

export function GetNicknameExistError() {

    const id = NICKNAMEEXIST
    const msg = "暱稱已存在"
    return {"id": id, "msg": msg}
}

export function GetMemberInvalidError() {

    const id = MEMBERINVALID
    const msg = "會員不存在"
    return {"id": id, "msg": msg}
}

export function GetNameBlankError() {

    const id = NAMEBLANK
    const msg = "姓名不能為空白"
    return {"id": id, "msg": msg}
}

export function GetNameInvalidError() {

    const id = NAMEINVALID
    const msg = "姓名不存在"
    return {"id": id, "msg": msg}
}

export function GetNameExistError() {

    const id = NAMEEXIST
    const msg = "姓名已存在"
    return {"id": id, "msg": msg}
}

export function GetMobileBlankError() {

    const id = MOBILEBLANK
    const msg = "手機不能為空白"
    return {"id": id, "msg": msg}
}

export function GetMobileInvalidError() {

    const id = MOBILEINVALID
    const msg = "手機不存在"
    return {"id": id, "msg": msg}
}

export function GetMobileExistError() {

    const id = MOBILEEXIST
    const msg = "手機已存在"
    return {"id": id, "msg": msg}
}

export function GetCityBlankError() {

    const id = CITYBLANK
    const msg = "請選擇縣市"
    return {"id": id, "msg": msg}
}

export function GetAreaBlankError() {

    const id = AREABLANK
    const msg = "請選擇區域"
    return {"id": id, "msg": msg}
}

export function GetROADBlankError() {

    const id = ROADBLANK
    const msg = "路名、接到不能為空白"
    return {"id": id, "msg": msg}
}