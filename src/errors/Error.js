
export const INSERTFAIL = 900;    // 資料庫新增失敗
    
export const EMAILFAIL = 901;     //Email寄送失敗
export const SMSFAIL = 902;       //簡訊寄送失敗

/**
     * Error if insert db is fail
     * @param  [type] $email [description]
     * @return [type]        [description]
     */
export function getInsertFAILError()
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

