import { React, useState, useEffect } from "react";
import { dump } from "../../functions"
import Cookies from "universal-cookie";
import axios from "axios";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'
import Alert from "../../component/Alert";
import Success from "../../component/Success";
import { ParseMsgs } from "../../errors/Error";
import Password from "../../component/form/Password";
import { Logout } from "../../component/Logout";
import { 
    OLDPASSWORDBLANK,
    NEWPASSWORDBLANK,
    RENEWPASSWORDBLANK,
    NEWPASSWORDNOTMATCH,
    OLDPASSWORDNOTMATCH,
    GetOldPasswordBlankError, 
    GetNewPasswordBlankError,
    GetReNewPasswordBlankError,
    GetNewPasswordNotMatchError,
    GetOldPasswordNotMatchError,
 } from "../../errors/MemberError"


const ChangePassword = () => {
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '更換密碼', href: '/member/changePassword', current: true },
    ]

    const [one, setOne] = useState({
        "oldPassword": "",
        "newPassword": "",
        "reNewPassword": "",
    })

    const cookies = new Cookies();
    const token = cookies.get("token")

    useEffect(() => {
        if (token !== undefined && token !== "null") {
            const url = process.env.REACT_APP_API + "/member/getOne?token=" + token

            const config = {
                method: "GET",
                Headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios.get(url, {}, config)
            .then(response => {
                if (response.data.success) {
                    setOne(response.data.row)
                } else {
                    setIsOpenAlert(true)
                    const msgs = response.data.msgs
                    setAlertText(ParseMsgs(msgs))
                }
            })
        }
    }, [token])
    
    //設定密碼與初值
    const [oldPassword, setOldPassword] = useState(one["password"])

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isOldPasswordEmpty, setIsOldPasswordEmpty] = useState(false)

    //當密碼值改變時，偵測最新的值
    const handleOldPassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsOldPasswordEmpty(false)
        }
        setOldPassword(event.target.value)
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const clearOldPassword = (event) => {
        event.preventDefault()
        setOldPassword("")
        setIsOldPasswordEmpty(false)
    }
    //設定錯誤訊息
    const [oldPasswordErrorMsg, setOldPasswordErrorMsg] = useState("")

    //設定密碼與初值
    const [newPassword, setNewPassword] = useState(one["oldPassword"])

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isNewPasswordEmpty, setIsNewPasswordEmpty] = useState(false)

    //當密碼值改變時，偵測最新的值
    const handleNewPassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsNewPasswordEmpty(false)
        }
        setNewPassword(event.target.value)
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const clearNewPassword = (event) => {
        event.preventDefault()
        setNewPassword("")
        setIsNewPasswordEmpty(false)
    }
    //設定錯誤訊息
    const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState("")

    //設定密碼與初值
    const [reNewPassword, setReNewPassword] = useState(one["reNewPassword"])

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isReNewPasswordEmpty, setIsReNewPasswordEmpty] = useState(false)    

    //當密碼值改變時，偵測最新的值
    const handleReNewPassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsReNewPasswordEmpty(false)
        }
        setReNewPassword(event.target.value)
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const clearReNewPassword = (event) => {
        event.preventDefault()
        setReNewPassword("")
        setIsReNewPasswordEmpty(false)
    }

    //設定錯誤訊息
    const [reNewPasswordErrorMsg, setReNewPasswordErrorMsg] = useState("")

    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault()

        var isPass = true
        var params = {}

        // 偵測舊密碼沒有填的錯誤
        if (oldPassword !== undefined && oldPassword.length > 0) {
            params["oldPassword"] = oldPassword
        } else {
            setIsOldPasswordEmpty(true)
            setOldPasswordErrorMsg(GetOldPasswordBlankError().msg)
            isPass = false
        }

        // 偵測新密碼沒有填的錯誤
        if (newPassword !== undefined && newPassword.length > 0) {
            params["newPassword"] = newPassword
        } else {
            setIsNewPasswordEmpty(true)
            setNewPasswordErrorMsg(GetNewPasswordBlankError().msg)
            isPass = false
        }

        // 偵測確認新密碼沒有填的錯誤
        if (reNewPassword !== undefined && reNewPassword.length > 0) {
            params["reNewPassword"] = reNewPassword
        } else {
            setIsReNewPasswordEmpty(true)
            setReNewPasswordErrorMsg(GetReNewPasswordBlankError().msg)
            isPass = false
        }
        // 偵測密碼與確認密碼不一致的錯誤
        if (newPassword !== reNewPassword) {
            setIsNewPasswordEmpty(true)
            setNewPasswordErrorMsg(GetNewPasswordNotMatchError().msg)
            isPass = false
        }

        if (isPass) {
            const params = []
            const url = process.env.REACT_APP_API + "/member/postChangePassword"
            const config = {
                method: "POST",
                Headers: {
                    "Content-Type": "application/json"
                }
            }
            axios.post(url, params, config)
                .then(function(response) {
                    if (response.data.success) {
                        setIsOpenSuccess(true)
                        setSuccessText("已經成功更新完密碼，請用新密碼來登入")
                    } else {
                        // 回傳的錯誤訊息與代號
                        const msgs = response.data["msgs"]
                        //console.info(msgs)
                        var id = 0
                        var msg = ""
                        for (let i = 0; i < msgs.length; i++) {
                            //console.info(msgs[i])
                            id = msgs[i].id
                            msg = msgs[i].msg

                            // 舊密碼不相符
                            if (id === OLDPASSWORDBLANK || id === OLDPASSWORDNOTMATCH) {
                                setOldPasswordErrorMsg(msg)
                                setIsOldPasswordEmpty(true)
                            }

                            // 新密碼空白或新密碼與新密碼確認不一致
                            if (id === NEWPASSWORDBLANK || id === NEWPASSWORDNOTMATCH) {
                                setNewPasswordErrorMsg(msg)
                                setIsNewPasswordEmpty(true)
                            }
                        }

                        //接收伺服器回傳的錯誤
                        //目前伺服器的錯誤有3種
                        //1.新增或修改資料庫時發生錯誤
                        //2.寄送email認證碼時發生錯誤
                        //3.發送簡訊認證碼時發生錯誤
                        var msgs1 = ""
                        for (let i = 0; i < msgs.length; i++) {
                            id = msgs[i].id
                            msg = msgs[i].msg

                            // //1.新增或修改資料庫時發生錯誤
                            // if (id === INSERTFAIL) {
                            //     setAlertText(msg)
                            //     setIsOpenAlert(true)
                            // }

                            // //如果寄送email或簡訊認證碼時若發生錯誤，會放置在同一個錯誤中回傳
                            // if (id === EMAILFAIL || id === SMSFAIL) {
                            //     msgs1 += msg + "\n"
                            // }
                        }
                        if (msgs1.length > 0) {
                            setAlertText(msgs1)
                            setIsOpenAlert(true)
                        }
                    }
                })
                .catch(function(response) {
                    setIsOpenAlert(true)
                    setAlertText(response)
                })
        }
    }

    // open warning modal dialog
    const [isOpenAlert, setIsOpenAlert] = useState(false)

    // 關閉警告對話盒
    const handleAlertClose = () => {
        setIsOpenAlert(false)
    }

    // 設定警告對話盒的訊息文字
    const [alertText, setAlertText] = useState("")

    // open info modal dialog
    const [isOpenSuccess, setIsOpenSuccess] = useState(false)

    // 關閉訊息對話盒
    // 1.登出
    // 2.回到登入頁
    const handleSuccessClose = () => {
        setIsOpenSuccess(false)
        Logout()
        window.location.href = "/member/login"
    }

    // 設定訊息對話盒的訊息文字
    const [successText, setSuccessText] = useState("")
        
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">更換密碼</h2>
                <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    <Password 
                        label="舊密碼"
                        name="oldPassword"
                        value={oldPassword}
                        id="oldPassword"
                        placeholder="請填舊密碼"
                        isRequired={true}
                        isError={isOldPasswordEmpty}
                        errorMsg={oldPasswordErrorMsg}
                        onChange={handleOldPassword}
                        onClear={clearOldPassword}
                    />
                    <Password 
                        label="新密碼"
                        name="newPassword"
                        value={newPassword}
                        id="newPassword"
                        placeholder="請填新密碼"
                        isRequired={true}
                        isError={isNewPasswordEmpty}
                        errorMsg={newPasswordErrorMsg}
                        onChange={handleNewPassword}
                        onClear={clearNewPassword}
                    />

                    <Password 
                        label="確認新密碼"
                        name="reNewPassword"
                        value={reNewPassword}
                        id="reNewPassword"
                        placeholder="請填確認新密碼"
                        isRequired={true}
                        isError={isReNewPasswordEmpty}
                        errorMsg={reNewPasswordErrorMsg}
                        onChange={handleReNewPassword}
                        onClear={clearReNewPassword}
                    />
                    <button
                        type="button"
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >送出</button>
                </div>
            </main>
        </div>
        <Alert isOpen={isOpenAlert} text={alertText} close={handleAlertClose} />
        <Success isOpen={isOpenSuccess} text={successText} close={handleSuccessClose} />
        </Layout>
        </>
    );
}

export default ChangePassword