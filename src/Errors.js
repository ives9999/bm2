
const EMAILINVALID = 1000;      // email不存在
const PASSWORDINVALID = 1001;   // password不符合
const MEMBERINVALID = 1002;     // 會員不存在
const EMAILEXIST = 1003;        // email已經註冊
const EMAILBLANK = 1004;        // email不能為空白
const PASSWORDBLANK = 1005;     // 密碼不能為空白

export function GetEmailBlankError() {

    const id = EMAILBLANK
    const msg = "email不能為空值"
    return {"id": id, "msg": msg}
}

export function GetEmailInvalidError({email}) {

    const id = EMAILINVALID
    const msg = email + " email不存在"
    return {"id": id, "msg": msg} 
}