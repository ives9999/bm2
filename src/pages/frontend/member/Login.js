import { React, useState, useContext, useReducer, useEffect } from "react";
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import Password from "../../../component/form/Password";
import {PrimaryButton} from '../../../component/MyButton';
import {loginAPI} from "../../../context/member/MemberAction"
import toCookie from '../../../api/toCookie';
import {
    EMAILBLANK,
    GetEmailBlankError,
    EMAILINVALID,
    GetEmailInvalidError,
    PASSWORDBLANK,
    GetPasswordBlankError,
    PASSWORDERROR,
    getPasswordErrorError,
    // NEEDEMAILVALIDATE,
    // GetNeedEmailValidateError,
    // NEEDMOBILEVALIDATE,
    // GetNeedMobileValidateError,
    // MEMBERSTOP,
    // GetMemberStopError,
} from "../../../errors/MemberError"
import Cookies from "universal-cookie";
import { useLocation, useNavigate } from 'react-router-dom'

    
    
const initData = {
    email: 'ives@bluemobile.com.tw',
    password: '1234',
};

const Login = () => {
    //const cookies = new Cookies()
    //var token = cookies.get('token')
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    
    const {setIsLoading, setAlertModal, setAuth} = useContext(BMContext);
    const breadcrumbs = [
        { name: '登入', href: '/member', current: true },
    ]

    const [formData, setFormData] = useState(initData)
	const {email, password} = formData

    const initalError = {
        loading: false,
        email: {
            code: 0,
            message: '',
        },
        password: {
            code: 0,
            message: '',
        },
        modal: {
            code: 0,
            message: '',
        },
    }
    
    const errorReducer = (state = initalError, action) => {
        var [newState, emailState, passwordState] = [{}, {}, {}]
        switch(action.type) {
            case "LOADING":
                return { ...state, loading: true }
            case "SUCCESS":
                return { ...state, loading: false }
            case EMAILBLANK:
                emailState = {code: EMAILBLANK, message: GetEmailBlankError().msg}
                newState = {loading: false, email: emailState}
                return {...state, ...newState}
            case EMAILINVALID:
                emailState = {code: EMAILINVALID, message: GetEmailInvalidError(email).msg}
                newState = {loading: false, email: emailState}
                return {...state, ...newState}
            case PASSWORDBLANK:
                passwordState = {code: PASSWORDBLANK, message: GetPasswordBlankError().msg}
                newState = {loading: false, password: passwordState}
                return { ...state, ...newState}
            case PASSWORDERROR:
                passwordState = {code: PASSWORDERROR, message: getPasswordErrorError().msg}
                newState = {loading: false, password: passwordState}
                return { ...state, ...newState}
            //case NEEDEMAILVALIDATE:
                // modalState = {code: NEEDEMAILVALIDATE, message: GetNeedEmailValidateError().msg}
                // newState = {loading: false, modal: modalState}
                // const a = {
                //     modalType: 'alert',
                //     modalText: action.payload,
                //     isModalShow: true,
                // }
                // setAlertModal(a)
                // return state
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    // const errors = [EMAILBLANK, EMAILINVALID, 
    //     PASSWORDBLANK, PASSWORDERROR,
    //     NEEDEMAILVALIDATE, NEEDMOBILEVALIDATE,
    //     MEMBERSTOP,
    // ]

    //當email值改變時，偵測最新的值
    const onChange = (e) => {
        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
		clearError(e.target.id)
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
        var error = {}
		if (id === 'email') {
            error = {email:{message: ''}}
		} else if (id === 'password') {
            error = {password:{message: ''}}
		}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    //按下送出後的動作
    const onSubmit = async (e) => {
		e.preventDefault()
        setIsLoading(true)
        dispatch({type: 'LOADING'})

		let isPass = true
        // 本地端檢查
		if (email.trim().length === 0) {
            dispatch({type: EMAILBLANK})
			isPass = false
		}
		if (password.trim().length === 0) {
            dispatch({type: PASSWORDBLANK})
			isPass = false
		}

        setIsLoading(false)
        if (isPass) {
            const data = await loginAPI(email, password)
            callback(data)
		}
	}

    const callback = (data) => {
        // 登入成功
        //console.info(data)
        if (data.status >= 200 && data.status < 300) {
            //console.info(token)
            // 登入成功，但是沒有通過email或手機認證，出現警告
            if (data.status === 202) {
                var message = ""
                for (var i = 0; i < data.message.length; i++) {
                    message += data.message[i].message + "\n"
                }
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '提醒',
                    modalText: message,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                    onClose: toMember,
                    onOK: toMember,
                })
                // dispatch({type: NEEDEMAILVALIDATE, payload: message});
            } else {
                // 登入成功，導到會員首頁
                //token = data.data.token
                dispatch({type: 'SUCCESS'})
                setFormData({email: '', password:''})
                toMember()
            }
            if (data.data.refreshToken !== null) {
                localStorage.setItem('refreshToken', data.data.refreshToken)
                //console.info(data.data)
                setAuth(data.data)
            }
            //localStorage.setItem('refreshToken', data.data.refreshToken)
        // 登入失敗
        } else {
            if (data["status"] === 401) {
                const message = data["message"][0].message
                setAlertModal({
                    modalType: 'warning',
                    modalText: message,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
            })
            } else {
                for (let i = 0; i < data["message"].length; i++) {
                    const id = data["message"][i].id
                    dispatch({type: id})
                }
            }
        }
    }
    const toMember = () => {
        //window.location.href = document.referrer
        //navigate(from, {replace: true})
    }
    // useEffect(() => {
    //     let isMounted = true
    //     console.info(isMounted)
    //     return () => {
    //         isMounted = false
    //         console.info(isMounted)
    //     }
    // },[])

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">歡迎回來 !</h2>
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
						errorMsg={errorObj.email.message}
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
						errorMsg={errorObj.password.message}
						onChange={onChange}
						onClear={handleClear}
					    />
                        
                        <a href="/member/forgetPassword" className="text-Primary-300 text-sm">忘記密碼？</a>

                        <div className='mt-12'><PrimaryButton extraClassName="w-full" type="submit">送出</PrimaryButton></div>
                        <div className="text-menuTextWhite text-sm mt-3">還沒有帳號，請<a className="text-Primary-300 text-sm" href="/member/register">註冊</a></div>
                    </div>
                </form>  
            </main>
        </div>
        </>
    );
}

export default Login