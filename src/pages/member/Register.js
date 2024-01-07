import { useContext, useReducer } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import Privacy from "../../component/form/Privacy";
import UseHr from "../../component/UseHr";
import {PrimaryButton} from '../../component/MyButton';

import {registerAPI} from "../../context/member/MemberAction"
import { toLogin } from "../../context/to";

import { 
    NAMEBLANK,
    NAMEEXIST,
    NICKNAMEBLANK,
    NICKNAMEEXIST,
    EMAILBLANK,
    EMAILEXIST,
    PASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    MOBILEBLANK,
    MOBILEEXIST,
    PRIVACYBLANK,
    GetEmailBlankError, 
    GetEmailExistError,
    GetNameBlankError, 
    GetNameExistError,
    GetNicknameBlankError,
    GetNicknameExistError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetMobileBlankError,
    GetMobileExistError,
    GetPrivacyBlankError,
 } from "../../errors/MemberError"

 import { 
    INSERTFAIL,
    EMAILFAIL,
    SMSFAIL,
} from "../../errors/Error"

 //var data = {
    // myName: "孫志煌9",
    // nickname: "孫志煌9",
    // email: "ives@bluemobile.com.tw9",
    // mobile: "0911299999",
    // password: "1234",
    // repassword: "1234",
    // privacy: true,
//}

const Register = () => {
    const {memberData, memberDispatch, isLogin, setAlertModal, setIsLoading} = useContext(BMContext)

    const breadcrumbs_insert = [
        { name: '註冊', href: '/register', current: true },
    ]
    const breadcrumbs_update = [
        { name: '會員', href: '/member', current: false },
        { name: '註冊', href: '/register', current: true },
    ]

    // const [formData, setFormData] = useState({
	// 	email: '',
	// 	password: '',
    //     repassword: '',
    //     myName: '',
    //     nickname: '',
    //     mobile: '',
    //     privacy: false,
	// })
    // setFormData(memeberData)

    const {email, password, repassword, name, nickname, mobile, privacy, token} = memberData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        emailError: obj,
        passwordError: obj,
        repasswordError: obj,
        nameError: obj,
        nicknameError: obj,
        mobileError: obj,
        privacyError: obj,
    }
    const errorReducer = (state=initalError, action) => {
        var [newState, emailState, passwordState, repasswordState, nameState, nicknameState, mobileState, privacyState] = [{}, {}, {}, {}, {}, {}, {}, {}]
        switch (action.type) {
            case EMAILBLANK:
                emailState = {code: EMAILBLANK, message: GetEmailBlankError().msg}
                newState = {loading: false, emailError: emailState}
                return {...state, ...newState}
            case EMAILEXIST:
                emailState = {code: EMAILEXIST, message: GetEmailExistError(email).msg}
                newState = {loading: false, emailError: emailState}
                return {...state, ...newState}
            case PASSWORDBLANK:
                passwordState = {code: PASSWORDBLANK, message: GetPasswordBlankError().msg}
                newState = {loading: false, passwordError: passwordState}
                return { ...state, ...newState}
            case REPASSWORDBLANK:
                repasswordState = {code: REPASSWORDBLANK, message: GetRePasswordBlankError().msg}
                newState = {loading: false, repasswordError: repasswordState}
                return { ...state, ...newState}
            case PASSWORDNOTMATCH:
                passwordState = {code: PASSWORDNOTMATCH, message: GetPasswordNotMatchError().msg}
                newState = {loading: false, passwordError: passwordState}
                return { ...state, ...newState}
            case NAMEBLANK:
                nameState = {code: NAMEBLANK, message: GetNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return { ...state, ...newState}
            case NAMEEXIST:
                nameState = {code: NAMEEXIST, message: GetNameExistError(name).msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case NICKNAMEBLANK:
                nicknameState = {code: NICKNAMEBLANK, message: GetNicknameBlankError().msg}
                newState = {loading: false, nicknameError: nicknameState}
                return { ...state, ...newState}
            case NICKNAMEEXIST:
                nicknameState = {code: NICKNAMEEXIST, message: GetNicknameExistError(nickname).msg}
                newState = {loading: false, nicknameError: nicknameState}
                return {...state, ...newState}
            case MOBILEBLANK:
                mobileState = {code: MOBILEBLANK, message: GetMobileBlankError().msg}
                newState = {loading: false, mobileError: mobileState}
                return { ...state, ...newState}
            case MOBILEEXIST:
                mobileState = {code: MOBILEEXIST, message: GetMobileExistError(mobile).msg}
                newState = {loading: false, mobileError: mobileState}
                return {...state, ...newState}
            case PRIVACYBLANK:
                privacyState = {code: PRIVACYBLANK, message: GetPrivacyBlankError().msg}
                newState = {loading: false, privacyError: privacyState}
                return { ...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)
    // const [error, setError] = useState({
	// 	emailErrorMsg: '',
	// 	passwordErrorMsg: '',
    //     repasswordErrorMsg: '',
    //     nameErrorMsg: '',
    //     nicknameErrorMsg: '',
    //     mobileErrorMsg: '',
    //     privacyErrorMsg: '',
	// })
    // const {emailErrorMsg, passwordErrorMsg, repasswordErrorMsg, nameErrorMsg, nicknameErrorMsg, mobileErrorMsg, privacyErrorMsg} = error

    //當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        memberDispatch({type: 'UPDATE', payload: {[e.target.id]: e.target.value}})
		clearError(e.target.id)
    }

    // 當同意隱私權值改變時，偵測最新的值
    const onPrivacyChange = (e) => {
        memberDispatch({type: 'UPDATE', payload: {[e.target.id]: e.target.checked}})

        if (!e.target.checked) {
            dispatch({type: PRIVACYBLANK})
        } else {
            clearError(e.target.id)
        }
    }

    //當按下清除按鈕後，清除欄位值
    const handleClear = (id) => {
        memberDispatch({type: 'UPDATE', payload: {[id]: ""}})
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'email') {
			error = {emailError:{message: ''}}
		} else if (id === 'password') {
			error = {passwordError:{message: ''}}
		} else if (id === 'repassword') {
			error = {repasswordError:{message: ''}}
		} else if (id === 'name') {
			error = {nameError:{message: ''}}
		} else if (id === 'nickname') {
			error = {nicknameError:{message: ''}}
		} else if (id === 'mobile') {
			error = {mobileError:{message: ''}}
		} else if (id === 'privacy') {
            error = {privacyError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    //按下送出後的動作
    const onSubmit = async (event) => {
        //console.info(dobValue.startDate)
        event.preventDefault();

        var isPass = true
        var params = {}

        if (token !== null) {
            params["token"] = token
        }

        // 偵測姓名沒有填的錯誤
        if (name !== undefined && name.length > 0) {
            params["name"] = name
        } else {
			dispatch({type: NAMEBLANK})
			isPass = false
        }

        // 偵測暱稱沒有填的錯誤
        if (nickname.length > 0) {
            params["nickname"] = nickname
        } else {
			dispatch({type: NICKNAMEBLANK})
			isPass = false
        }

        // 偵測email沒有填的錯誤
        if (email.length > 0) {
            params["email"] = email
        } else {
			dispatch({type: EMAILBLANK})
			isPass = false
        }

        if (privacy === false) {
            dispatch({type: PRIVACYBLANK})
			isPass = false
        }

        // 偵測密碼沒有填的錯誤
        if (!isLogin) {
            if (password.length > 0) {
                params["password"] = password
            } else {
                dispatch({type: PASSWORDBLANK})
                isPass = false
            }
        }

        // 偵測確認密碼沒有填的錯誤
        if (!isLogin) {
            if (repassword.length > 0) {
                params["repassword"] = repassword
            } else {
                dispatch({type: REPASSWORDBLANK})
                isPass = false
            }
        }

        // 偵測密碼與確認密碼不一致的錯誤
        if (!isLogin) {
            if (password !== repassword) {
                dispatch({type: PASSWORDNOTMATCH})
                isPass = false
            }
        }

        // 偵測手機沒有填的錯誤
        if (mobile.length > 0) {
            params["mobile"] = mobile
        } else {
            dispatch({type: MOBILEBLANK})
			isPass = false
        }

        // 偵測同意隱私權沒有勾選的錯誤
        if (!isLogin) {
            if (privacy) {
                params["privacy"] = 1
            } else {
                dispatch({type: PRIVACYBLANK})
                isPass = false
            }
        }
        //console.info(isPass)

        // client端檢查錯誤完成，如果客戶端資料全部無誤後，準備送出註冊資料
        if (isPass) {
            setIsLoading(true)
            //console.info(params)
            const data = await registerAPI(params)
            setIsLoading(false)
            callback(data)
        }
    }
    
    // 伺服器回傳訊息的處置
    const callback = (data) => {
        // 註冊成功
        if (data["status"] >= 200 && data["status"] < 300) {
            const message = isLogin ? "完成修改" : "恭喜您完成註冊，請重新登入！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
            }
            if (!isLogin) {
                obj = {...obj, ...{onClose: toLogin,}}
            }
            setAlertModal(obj)
        // 註冊失敗
        } else {
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                dispatch({type: id})
            }

            //接收伺服器回傳的錯誤
            //目前伺服器的錯誤有3種
            //1.新增或修改資料庫時發生錯誤
            //2.寄送email認證碼時發生錯誤
            //3.發送簡訊認證碼時發生錯誤
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                const msg = data["message"][i].message

                //1.新增或修改資料庫時發生錯誤
                if (id === INSERTFAIL) {
                    setAlertModal({
                        modalType: 'alert',
                        modalText: msg,
                        isModalShow: true,
                    })
                }

                //如果寄送email或簡訊認證碼時若發生錯誤，會放置在同一個錯誤中回傳
                if (id === EMAILFAIL || id === SMSFAIL) {
                    msgs1 += msg + "\n"
                }
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'alert',
                    modalText: msgs1,
                    isModalShow: true,
                })
            }
        }
    }    

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={isLogin ? breadcrumbs_update : breadcrumbs_insert}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{isLogin ? "更新註冊資料" : "註冊"}</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        value={email || ''}
                        id="email"
                        placeholder="you@example.com"
                        isRequired={true}
                        errorMsg={errorObj.emailError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Password 
                        label="密碼"
                        name="password"
                        value={password || ''}
                        id="password"
                        placeholder="請填密碼"
                        isRequired={true}
                        errorMsg={errorObj.passwordError.message}
                        onChange={onChange}
                        onClear={handleClear}
                        isHidden={isLogin ? true : false}
                    />

                    <Password 
                        label="確認密碼"
                        name="repassword"
                        value={repassword || ''}
                        id="repassword"
                        placeholder="請填確認密碼"
                        isRequired={true}
                        errorMsg={errorObj.repasswordError.message}
                        onChange={onChange}
                        onClear={handleClear}
                        isHidden={isLogin ? true : false}
                    />
                    <UseHr />
                    <Input 
                        label="姓名"
                        type="text"
                        name="name"
                        value={name || ''}
                        id="name"
                        placeholder="王小明"
                        isRequired={true}
                        errorMsg={errorObj.nameError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Input 
                        label="暱稱"
                        type="text"
                        name="nickname"
                        value={nickname || ''}
                        id="nickname"
                        placeholder="羽神"
                        isRequired={true}
                        errorMsg={errorObj.nicknameError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />                    
                    <Input 
                        label="手機"
                        type="text"
                        name="mobile"
                        value={mobile || ''}
                        id="mobile"
                        placeholder="0933456789"
                        isRequired={true}
                        errorMsg={errorObj.mobileError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    
                    <UseHr />

                    <Privacy
                        checked={(privacy === undefined || privacy===false) ? false : true}
                        errorMsg={errorObj.privacyError.message}
                        onChange={onPrivacyChange}
                        isHidden={isLogin ? true : false}
                    />
                    <div className="mb-6"></div>
                    
                    <PrimaryButton type="submit" extraClassName="w-full">送出</PrimaryButton>

                    <div className={`text-menuTextWhite text-sm mt-3 ${token === null ? "block" : "hidden"}`}>
                        已經有帳號，請<a className="text-Primary-300 text-sm" href="/member/login">登入</a>
                    </div>
                </div>
            </form>  
        </div>
        {/* <Alert isOpen={isOpenAlert} text={alertText} close={handleAlertClose} />
        <Info isOpen={isOpenInfo} text={infoText} close={handleInfoClose} /> */}
        </>
    );
}

export default Register