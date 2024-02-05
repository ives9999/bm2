export const TOKENINVALID = 100;       // 金鑰不存在
export const CONFIGINVALID = 101;      // 設定值不存在
export const SAVEFAIL = 102;           // 儲存檔案失敗
export const CREATEFOLDERFAIL = 103;   // 建立資料夾失敗
export const TOKENEMPTY = 104;         // 金鑰不能為空白
export const PERMISSIONDENIED = 105;   // 權限不足
export const MANAGERTOKENEMPTY = 106;  // 管理者金鑰不能為空白
export const MANAGERTOKENINVALID = 107;// 管理者金鑰不存在

export const INSERTFAIL = 900;    // 資料庫新增失敗
export const EMAILFAIL = 901;     //Email寄送失敗
export const SMSFAIL = 902;       //簡訊寄送失敗

/**
* Error if token is invalid
* @param  [type] $token [description]
* @return [type]        [description]
*/
export function getTokenInvalidError(val)
{
    const id = TOKENINVALID;
    const msg = val + " 金鑰不存在";
    return {"id": id, "msg": msg}
}

/**
* Error if config is invalid
* @param  [type] $config [description]
* @return [type]        [description]
*/
export function getConfigInvalidError(val)
{
    const id = CONFIGINVALID;
    const msg = val + " 設定值不存在";
    return {"id": id, "msg": msg}
}

/**
* Error if save file is fail
* @return [type]        [description]
*/
export function getSaveFailError()
{
    const id = SAVEFAIL;
    const msg = "檔案儲存失敗";
    return {"id": id, "msg": msg}
}

/**
* Error if create folder is fail
* @return [type]        [description]
*/
export function getCreateFolderFailError()
{
    const id = CREATEFOLDERFAIL;
    const msg = "建立資料夾失敗";
    return {"id": id, "msg": msg}
}

/**
* Error if token is empty
* @return [type]        [description]
*/
export function getTokenEmptyError(val)
{
    const id = TOKENEMPTY;
    const msg = "金鑰不能為空白";
    return {"id": id, "msg": msg}
}

/**
* Error if permission is denied
* @return [type]        [description]
*/
export function getPermissionDeniedError(val)
{
    const id = PERMISSIONDENIED;
    const msg = "權限不足";
    return {"id": id, "msg": msg}
}

/**
* Error if token is empty
* @return [type]        [description]
*/
export function getManagerTokenEmptyError(val)
{
    const id = MANAGERTOKENEMPTY;
    const msg = "管理者金鑰不能為空白";
    return {"id": id, "msg": msg}
}

/**
* Error if token is empty
* @return [type]        [description]
*/
export function getManagerTokenInvalidError(val)
{
    const id = MANAGERTOKENINVALID;
    const msg = "管理者金鑰不存在";
    return {"id": id, "msg": msg}
}

/**
* Error if store db is fail
* @return [type]        [description]
*/
export function getInsertFailError()
{
    const id = INSERTFAIL;
    const msg = "資料庫新增或修改紀錄失敗";
    return {"id": id, "msg": msg}
}

/**
 * Error if email is fail
 * @param  [type] $email [description]
 * @return [type]        [description]
 */
export function getEmailFailError(email, error)
{
    const id = EMAILFAIL;
    const msg = email+" Email寄送失敗，失敗原因 "+error;
    return {"id": id, "msg": msg}
}

/**
 * Error if sms is fail
 * @param  [type] $email [description]
 * @return [type]        [description]
 */
export function getSMSFailError(mobile, error)
{
    const id = SMSFAIL;
    const msg = mobile + " 簡訊寄送失敗，失敗原因 " + error;
    return {"id": id, "msg": msg}
}

/**
 * 將回傳的錯誤訊息陣列，解析成文字格式
 * @param  [array] $msgs [description]
 * @return [text]        [description]
 */
export function ParseMsgs(msgs) {
    var res = ""
    for (var i = 0; i < msgs.length; i++) {

        res = res + msgs[i].msg + "\n";
    }

    return res
}

