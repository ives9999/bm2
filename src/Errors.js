
const EMAILINVALID = 1000      // email不存在
const PASSWORDINVALID = 1001   // 密碼不符合
const MEMBERINVALID = 1002     // 會員不存在
const EMAILEXIST = 1003        // email已經註冊
const EMAILBLANK = 1004        // email不能為空白
const PASSWORDBLANK = 1005     // 密碼不能為空白
const NICKNAMEBLANK = 1006     // 暱稱不能為空白
const NICKNAMEINVALID = 1007   // 暱稱不存在
const NICKNAMEEXIST = 1008     // 暱稱已存在
const REPASSWORDBLANK = 1009   // 確認密碼不能為空白
const PASSWORDNOTMATCH = 1010  // 密碼不相符
const NAMEBLANK = 1011         // 姓名不能為空白
const NAMEINVALID = 1012       // 姓名不存在
const NAMEEXIST = 1013         // 姓名已存在

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