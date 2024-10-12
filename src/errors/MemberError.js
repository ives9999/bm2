
export const MEMBERINVALID = 1000    // 會員不存在

export const EMAILBLANK = 1001        // email不能為空白
export const EMAILINVALID = 1002      // email不存在
export const EMAILEXIST = 1003        // email已經註冊

export const PASSWORDBLANK = 1004     // 密碼不能為空白
export const PASSWORDERROR = 1005     // 密碼錯誤
export const REPASSWORDBLANK = 1006   // 確認密碼不能為空白
export const PASSWORDNOTMATCH = 1007  // 密碼不相符

export const NAMEBLANK = 1008         // 姓名不能為空白
export const NAMEINVALID = 1009       // 姓名不存在
export const NAMEEXIST = 1010         // 姓名已存在
export const NICKNAMEBLANK = 1011     // 暱稱不能為空白
export const NICKNAMEINVALID = 1012   // 暱稱不存在
export const NICKNAMEEXIST = 1013     // 暱稱已存在

export const MOBILEBLANK = 1014       // 手機不能為空白
export const MOBILEINVALID = 1015     // 手機不存在
export const MOBILEEXIST = 1016       // 手機已存在

export const CITYBLANK = 1017         // 請選擇縣市
export const AREABLANK = 1018         // 請選擇區域
export const ROADBLANK = 1019         // 路名、街道不能為空白

export const PRIVACYBLANK = 1020      // 請同意隱私權

export const EMAILFORMATERROR = 1021;  // Email格式不對
export const MOBILEFORMATERROR = 1022; // 手機格式不對

export const CODEBLANK = 1023;        // 沒有傳送認證碼
export const CODEERROR = 1024;        // 認證碼錯誤

export const OLDPASSWORDBLANK = 1025     // 舊密碼不能為空白
export const NEWPASSWORDBLANK = 1026     // 新密碼不能為空白
export const RENEWPASSWORDBLANK = 1027   // 確認新密碼不能為空白
export const NEWPASSWORDNOTMATCH = 1028  // 新密碼不相符
export const OLDPASSWORDNOTMATCH = 1029; // 舊密碼不相符
export const NEWPASSWORDMATCHOLDPASSWORD = 1030; // 新密碼不能與舊密碼相同
export const NEEDEMAILVALIDATE = 1031; // 須先通過email認證
export const NEEDMOBILEVALIDATE = 1032; // 須先通過email認證
export const MEMBERSTOP = 1033; // 帳戶已經被停用

export const REFRESHTOKENINVALID = 1040;       // refresh token 不存在

export const DOBBLANK = 1041         // 生日不能為空白
export const SEXBLANK = 1042         // 性別不能為空白

export function GetEmailBlankError() {

    const id = EMAILBLANK
    const msg = "email不能為空白"
    return {"id": id, "msg": msg}
}

export function GetEmailInvalidError(email) {

    const id = EMAILINVALID
    const msg = email + " email不存在"
    return {"id": id, "msg": msg} 
}

export function GetEmailExistError(email) {

    const id = EMAILEXIST
    const msg = email + " email已存在"
    return {"id": id, "msg": msg} 
}

export function getPasswordErrorError() {

    const id = PASSWORDERROR
    const msg = "密碼錯誤"
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

export function GetNicknameExistError(val) {

    const id = NICKNAMEEXIST
    const msg = val + "暱稱已存在"
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

export function GetNameExistError(val) {

    const id = NAMEEXIST
    const msg = val + "姓名已存在"
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

export function GetMobileExistError(val) {

    const id = MOBILEEXIST
    const msg = val + "手機已存在"
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

export function GetRoadBlankError() {

    const id = ROADBLANK
    const msg = "路名、街道不能為空白"
    return {"id": id, "msg": msg}
}

export function GetPrivacyBlankError() {

    const id = PRIVACYBLANK
    const msg = "請同意隱私權"
    return {"id": id, "msg": msg}
}

/**
 * Error if email format is error
 * @return [type]        [description]
 */
export function GetEmailFormatError(val)
{
    const id = EMAILFORMATERROR;
    const msg = val + " 格式錯誤";
    return {"id": id, "msg": msg}
}

/**
 * Error if mobile format is error
 * @return [type]        [description]
 */
export function GetMobileFormatError(val)
{
    const id = MOBILEFORMATERROR;
    const msg = val + " 格式錯誤";
    return {"id": id, "msg": msg}
}

/**
 * Error if code is blank
 * @return [type]        [description]
 */
export function GetCodeBlankError()
{
    const id = CODEBLANK;
    const msg = "認證碼不能為空白";
    return {"id": id, "msg": msg}
}

/**
 * Error if code
 * @return [type]        [description]
 */
export function GetCodeErrorError(code)
{
    const id = CODEERROR;
    const msg = code + " 認證碼錯誤";
    return {"id": id, "msg": msg}
}

export function GetOldPasswordBlankError() {

    const id = OLDPASSWORDBLANK
    const msg = "舊密碼不能為空白"
    return {"id": id, "msg": msg}
}

export function GetNewPasswordBlankError() {

    const id = NEWPASSWORDBLANK
    const msg = "新密碼不能為空白"
    return {"id": id, "msg": msg}
}

export function GetReNewPasswordBlankError() {

    const id = RENEWPASSWORDBLANK
    const msg = "確認新密碼不能為空白"
    return {"id": id, "msg": msg}
}

export function GetNewPasswordNotMatchError() {

    const id = NEWPASSWORDNOTMATCH
    const msg = "新密碼不相符"
    return {"id": id, "msg": msg}
}

export function GetOldPasswordNotMatchError() {

    const id = OLDPASSWORDNOTMATCH
    const msg = "舊密碼不相符"
    return {"id": id, "msg": msg}
}

export function GetNewPasswordMatchOldPasswordError() {

    const id = NEWPASSWORDMATCHOLDPASSWORD
    const msg = "新密碼不能與舊密碼相同"
    return {"id": id, "msg": msg}
}

export function GetNeedEmailValidateError() {

    const id = NEEDEMAILVALIDATE
    const msg = "須先通過email認證"
    return {"id": id, "msg": msg}
}

export function GetNeedMobileValidateError() {

    const id = NEEDMOBILEVALIDATE
    const msg = "須先通過手機認證"
    return {"id": id, "msg": msg}
}

export function GetMemberStopError() {

    const id = MEMBERSTOP
    const msg = "此帳戶已經被停用"
    return {"id": id, "msg": msg}
}

export function GetRefreshTokenInvalidError() {

    const id = REFRESHTOKENINVALID
    const msg = "refresh token 不存在"
    return {"id": id, "msg": msg} 
}

export function GetDobBlankError() {

    const id = DOBBLANK
    const msg = "生日不能為空白"
    return {"id": id, "msg": msg}
}

export function GetSexBlankError() {

    const id = SEXBLANK
    const msg = "性別不能為空白"
    return {"id": id, "msg": msg}
}
