import { React, useState, Fragment, useEffect } from "react";
import Cookies from "universal-cookie";

import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import Privacy from "../../component/form/Privacy";
import UseHr from "../../component/UseHr";
import Alert from "../../component/Alert";
import Info from "../../component/Info";
import Button from '../../component/Button';

import { 
    NAMEBLANK,
    NAMEEXIST,
    NICKNAMEBLANK,
    NICKNAMEEXIST,
    EMAILBLANK,
    EMAILEXIST,
    PASSWORDBLANK,
    PASSWORDNOTMATCH,
    MOBILEBLANK,
    MOBILEEXIST,
    PRIVACYBLANK,
    GetEmailBlankError, 
    GetNameBlankError, 
    GetNicknameBlankError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetMobileBlankError,
    GetPrivacyBlankError,
 } from "../../errors/MemberError"

 import { 
    INSERTFAIL,
    EMAILFAIL,
    SMSFAIL,
} from "../../errors/Error"

 import axios from "axios";

 const data = {
    name: "",
    nickname: "",
    email: "",
    mobile: "",
}

const Register = () => {

    const [token, setToken] = useState(null)
    const [title, setTitle] = useState("註冊")
    const [submitButton, setSubmitButton] = useState("註冊")
    const [breadcrumbs, setBreadcrumbs] = useState([
        { name: '註冊', href: '/register', current: true },
    ])

    const [formData, setFormData] = useState({
		email: '',
		password: '',
        repassword: '',
        myName: '',
        nickname: '',
        mobile: '',
        privacy: false,
	})

    const {email, password, repassword, myName, nickname, mobile, privacy} = formData

    const [error, setError] = useState({
		emailErrorMsg: '',
		passwordErrorMsg: '',
        repasswordErrorMsg: '',
        nameErrorMsg: '',
        nicknameErrorMsg: '',
        mobileErrorMsg: '',
        privacyErrorMsg: '',
	})
    const {emailErrorMsg, passwordErrorMsg, repasswordErrorMsg, nameErrorMsg, nicknameErrorMsg, mobileErrorMsg, privacyErrorMsg} = error

    //當email值改變時，偵測最新的值
    const onChange = (e) => {

        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))

		clearError(e.target.id)
    }

    // 當同意隱私權值改變時，偵測最新的值
    const onPrivacyChange = (e) => {
        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.checked
		}))


        const err = {privacyErrorMsg: e.target.checked ? "" : GetPrivacyBlankError().msg}
        setError((prevState) => ({
            ...prevState, ...err
        }))
    }

    //當按下清除email文字按鈕後，清除email
    const handleClear = (id) => {
        setFormData((prevState) => ({
			...prevState,
			[id]: ""
		}))
		clearError(id)
    }

    const clearError = (id) => {
		if (id === 'email') {
			const err = {emailErrorMsg: ''}
			setError((prevState) => ({
				...prevState, ...err
			}))
		} else if (id === 'password') {
			const err = {passwordErrorMsg: ''}
			setError((prevState) => ({
				...prevState, ...err
			}))
		}
	}

    // useEffect(() => {
    //     const cookies = new Cookies();
    //     var token1 = cookies.get("token")
    //         // dump(token1)
    //         if (token1 !== undefined) {
    //         setToken(token1)
    //         const url = process.env.REACT_APP_API + "/member/getOne?token=" + token1

    //         const config = {
    //             method: "GET",
    //             Headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         }
    //         axios.get(url, {}, config)
    //         .then(response => {
    //             if (response.data.success) {
    //                 const row = response.data.row
    //                 setTitle("更新資料")
    //                 setSubmitButton("更新")
    //                 // dump(title)
    //                 setMyName(row.name)
    //                 setNickname(row.nickname)
    //                 setEmail(row.email)
    //                 setIsPasswordHidden(true)
    //                 setMobile(row.mobile)
    //                 setIsPrivacyHidden(true)
    //                 setBreadcrumbs([
    //                     { name: '會員', href: '/member', current: false },
    //                     { name: '會員資料', href: '/member/register', current: true },
    //                 ])
    //             }
    //         })
    //     }
    // },[])

    // open warning modal dialog
    const [isOpenAlert, setIsOpenAlert] = useState(false)

    // 關閉警告對話盒
    const handleAlertClose = () => {
        setIsOpenAlert(false)
    }

    // 設定警告對話盒的訊息文字
    const [alertText, setAlertText] = useState("")

    // open info modal dialog
    const [isOpenInfo, setIsOpenInfo] = useState(false)

    // 關閉訊息對話盒
    const handleInfoClose = () => {
        setIsOpenInfo(false)
        window.location.href = "/member/login"
    }

    // 設定訊息對話盒的訊息文字
    const [infoText, setInfoText] = useState("")

    //按下送出後的動作
    const onSubmit = (event) => {
        //console.info(privacy)
        //console.info(dobValue.startDate)
        event.preventDefault();

        var isPass = true
        var params = {}

        if (token !== null) {
            params["token"] = token
        }

        // 偵測姓名沒有填的錯誤
        if (myName !== undefined && myName.length > 0) {
            params["name"] = myName
        } else {
			const err = {nameErrorMsg: GetNameBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
        }

        // 偵測暱稱沒有填的錯誤
        if (nickname.length > 0) {
            params["nickname"] = nickname
        } else {
			const err = {nicknameErrorMsg: GetNicknameBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
        }

        // 偵測email沒有填的錯誤
        if (email.length > 0) {
            params["email"] = email
        } else {
			const err = {emailErrorMsg: GetEmailBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
        }

        if (privacy === false) {
            const err = {privacyErrorMsg: GetPrivacyBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
        }

        // 偵測密碼沒有填的錯誤
        if (token === null) {
            if (password.length > 0) {
                params["password"] = password
            } else {
                const err = {passwordErrorMsg: GetPasswordBlankError().msg}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
                isPass = false
                }
        }

        // 偵測確認密碼沒有填的錯誤
        if (token === null) {
            if (repassword.length > 0) {
                params["repassword"] = repassword
            } else {
                const err = {repasswordErrorMsg: GetRePasswordBlankError().msg}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
                isPass = false
                }
        }

        // 偵測密碼與確認密碼不一致的錯誤
        if (token === null) {
            if (password !== repassword) {
                const err = {passwordErrorMsg: GetPasswordNotMatchError().msg}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
                isPass = false
            }
        }

        // 偵測手機沒有填的錯誤
        if (mobile.length > 0) {
            params["mobile"] = mobile
        } else {
            const err = {mobileErrorMsg: GetMobileBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
        }

        // 偵測同意隱私權沒有勾選的錯誤
        if (token === null) {
            if (privacy) {
                params["privacy"] = 1
            } else {
                const err = {privacyErrorMsg: GetPrivacyBlankError().msg}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
                isPass = false
            }
        }

        // client端檢查錯誤完成，如果客戶端資料全部無誤後，準備送出註冊資料
        if (isPass) {
            //dump(params)
            const url = process.env.REACT_APP_API + "/member/postRegister"
            const headers = {
                headers: {
                    "content-type": "application/json",
                    "Origin": process.env.REACT_APP_DOMAIN,
                }
            }

            axios.post(url, params, headers)
            .then(response => callback(response.data))
        }
    }
    
    // 伺服器回傳訊息的處置
    const callback = (data) => {
        // 註冊成功
        if (data["status"] >= 200 && data["status"] < 300) {
            //console.info(data)
            setInfoText("恭喜您完成註冊，請重新登入！！")
            setIsOpenInfo(true)
        // 註冊失敗
        } else {
            var err = {}
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                if (id === EMAILBLANK || id === EMAILEXIST) {
                    err["emailErrorMsg"] = data["message"][i].message
                } else if (id === PASSWORDBLANK || id === PASSWORDNOTMATCH) {
                    err["passwordErrorMsg"] = data["message"][i].message
                } else if (id === NAMEBLANK || id === NAMEEXIST) {
                    err["nameErrorMsg"] = data["message"][i].message
                } else if (id === NICKNAMEBLANK || id === NICKNAMEEXIST) {
                    err["nicknameErrorMsg"] = data["message"][i].message
                } else if (id === MOBILEBLANK || id === MOBILEEXIST) {
                    err["mobileErrorMsg"] = data["message"][i].message
                } else if (id === PRIVACYBLANK) {
                    err["privacyErrorMsg"] = data["message"][i].message
                }
            }
            setError((prevState) => ({
                ...prevState, ...err
            }))

            //接收伺服器回傳的錯誤
            //目前伺服器的錯誤有3種
            //1.新增或修改資料庫時發生錯誤
            //2.寄送email認證碼時發生錯誤
            //3.發送簡訊認證碼時發生錯誤
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const id = msgs1[i].id
                const msg = msgs1[i].msg

                //1.新增或修改資料庫時發生錯誤
                if (id === INSERTFAIL) {
                    setAlertText(msg)
                    setIsOpenAlert(true)
                }

                //如果寄送email或簡訊認證碼時若發生錯誤，會放置在同一個錯誤中回傳
                if (id === EMAILFAIL || id === SMSFAIL) {
                    msgs1 += msg + "\n"
                }
            }
            if (msgs1.length > 0) {
                setAlertText(msgs1)
                setIsOpenAlert(true)
            }
        }
    }

    // const DivUploadButton = asUploadButton((props) => {
    //     return <div {...props} style={{ rounded-md bg-lime-500 px-3 py-2 text-sm font-semibold text-lime-950 shadow-sm hover:bg-lime-600 }}>
    //         上傳
    //     </div>
    // });
    

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary text-center text-4xl font-bold mb-8">{title}</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        id="email"
                        placeholder="you@example.com"
                        isRequired={true}
                        errorMsg={emailErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Password 
                        label="密碼"
                        name="password"
                        value={password}
                        id="password"
                        placeholder="請填密碼"
                        isRequired={true}
                        errorMsg={passwordErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />

                    <Password 
                        label="確認密碼"
                        name="repassword"
                        value={repassword}
                        id="repassword"
                        placeholder="請填確認密碼"
                        isRequired={true}
                        errorMsg={repasswordErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <UseHr />
                    <Input 
                        label="姓名"
                        type="text"
                        name="name"
                        value={myName}
                        id="name"
                        placeholder="王小明"
                        isRequired={true}
                        errorMsg={nameErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Input 
                        label="暱稱"
                        type="text"
                        name="nickname"
                        value={nickname}
                        id="nickname"
                        placeholder="羽神"
                        isRequired={true}
                        errorMsg={nicknameErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />                    
                    <Input 
                        label="手機"
                        type="text"
                        name="mobile"
                        value={mobile}
                        id="mobile"
                        placeholder="0933456789"
                        isRequired={true}
                        errorMsg={mobileErrorMsg}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    
                    <UseHr />

                    <Privacy
                        checked={privacy}
                        errorMsg={privacyErrorMsg}
                        onChange={onPrivacyChange}
                    />
                    <div className="mb-6"></div>
                    
                    <Button type="submit">送出</Button>

                    <div className={`text-menuTextWhite text-sm mt-3 ${token === null ? "block" : "hidden"}`}>
                        已經有帳號，請<a className="text-Primary text-sm" href="/member/login">登入</a>
                    </div>
                </div>
            </form>  
        </div>    
        <Alert isOpen={isOpenAlert} text={alertText} close={handleAlertClose} />
        <Info isOpen={isOpenInfo} text={infoText} close={handleInfoClose} />
        </>
    );
}

export default Register