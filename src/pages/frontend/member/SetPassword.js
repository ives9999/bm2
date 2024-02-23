import { React, useState, useReducer, useContext } from "react";
import useQueryParams from '../../../hooks/useQueryParams'
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import Password from "../../../component/form/Password";
import {PrimaryButton} from '../../../component/MyButton';
import {putSetPasswordAPI} from '../../../context/member/MemberAction'
import {logoutAPI} from '../../../context/member/MemberAction'
import { toLogin } from "../../../context/to"

import { 
    PASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
 } from "../../../errors/MemberError"

const ChangePassword = () => {
    const {setIsLoading, setAlertModal} = useContext(BMContext);

    const { token } = useQueryParams()

    const breadcrumbs = [
        { name: '重設密碼', href: '/member/setPassword', current: true },
    ]

    const [formData, setFormData] = useState({
        password: '',
        rePassword: '',
	})
	const {password, rePassword} = formData

    const initalError = {
        loading: false,
        password: {
            code: 0,
            message: '',
        },
        rePassword: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, passwordState, rePasswordState] = [{}, {}, {}]
        switch(action.type) {
            case "LOADING":
                return { ...state, loading: true }
            case "SUCCESS":
                return { ...state, loading: false }
            case PASSWORDBLANK:
                passwordState = {code: PASSWORDBLANK, message: GetPasswordBlankError().msg}
                newState = {loading: false, password: passwordState}
                return {...state, ...newState}
            case REPASSWORDBLANK:
                rePasswordState = {code: REPASSWORDBLANK, message: GetRePasswordBlankError().msg}
                newState = {loading: false, rePassword: rePasswordState}
                return {...state, ...newState}
            case PASSWORDNOTMATCH:
                passwordState = {code: PASSWORDNOTMATCH, message: GetPasswordNotMatchError().msg}
                newState = {loading: false, password: passwordState}
                return {...state, ...newState}
                case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
		clearError(e.target.id)
    }

    const handleClear = (id) => {
        setFormData((prevState) => ({
			...prevState,
			[id]: ""
		}))
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'password') {
            error = {password:{message: ''}}
		} else if (id === 'rePassword') {
            error = {rePassword:{message: ''}}
		}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}
    
    
    const onSubmit = async (event) => {
        event.preventDefault()

        var isPass = true
        var params = {}
        params["token"] = token

        // 偵測舊密碼沒有填的錯誤
        if (password !== undefined && password.length > 0) {
            params["password"] = password
        } else {
            dispatch({type: PASSWORDBLANK})
            isPass = false
        }

        // 偵測確認密碼沒有填的錯誤
        if (rePassword !== undefined && rePassword.length > 0) {
            params["rePassword"] = rePassword
        } else {
            dispatch({type: REPASSWORDBLANK})
            isPass = false
        }
        // 偵測密碼與確認密碼不一致的錯誤
        if (password !== rePassword) {
            dispatch({type: PASSWORDNOTMATCH})
            isPass = false
        }
        // dump(params);

        if (isPass) {
            setIsLoading(true)
            const data = await putSetPasswordAPI(params)
            console.info(data)
            callback(data)
            setIsLoading(false)
        }
    }

    const callback = (data) => {
        if (data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalText: "成功設定新密碼，請用新密碼來登入",
                isModalShow: true,
                onClose: toGo,
            })
        } else {
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                dispatch({type: id})
            }
            //接收伺服器回傳的錯誤
            //目前伺服器的錯誤有3種
            //1.新增或修改資料庫時發生錯誤
            //2.修改資料庫時發生錯誤
            //3.發送簡訊認證碼時發生錯誤
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs1 += msg + "\n"
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

    // 關閉訊息對話盒
    // 1.登出
    // 2.回到登入頁
    const toGo = () => {
        logoutAPI()
        toLogin()
    }
        
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-20">更換密碼</h2>
                <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-Menu border border-PrimaryBlock-800 p-8 rounded-lg">
                    <Password 
                        label="新密碼"
                        name="password"
                        value={password}
                        id="password"
                        placeholder="請填密碼"
                        isRequired={true}
                        errorMsg={errorObj.password.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Password 
                        label="確認密碼"
                        name="rePassword"
                        value={rePassword}
                        id="rePassword"
                        placeholder="請填確認密碼"
                        isRequired={true}
                        errorMsg={errorObj.rePassword.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <PrimaryButton className='w-full mb-8' type="submit">送出</PrimaryButton>
                    <div className="mb-8"></div>
                </div>
                </form>
            </main>
        </div>
        </>
    );
}

export default ChangePassword