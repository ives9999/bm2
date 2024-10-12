import { React, useState, useReducer, useContext } from "react";
import BMContext from "../../../context/BMContext";
import { useNavigate } from "react-router-dom";
import Breadcrumb from '../../../component/Breadcrumb'
import Password from "../../../component/form/Password";
import {PrimaryButton} from '../../../component/MyButton';
import {putChangePasswordAPI} from '../../../context/member/MemberAction'
import {logoutAPI} from '../../../context/member/MemberAction'
//import { toLogin } from "../../../context/to"

import { 
    OLDPASSWORDBLANK,
    NEWPASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    GetOldPasswordBlankError, 
    GetNewPasswordBlankError,
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
 } from "../../../errors/MemberError"

const ChangePassword = () => {
    const {auth, setAuth, setIsLoading, setAlertModal} = useContext(BMContext);
    const {token} = auth
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '更換密碼', href: '/member/changePassword', current: true },
    ]

    const [formData, setFormData] = useState({
		oldPassword: '',
        newPassword: '',
        reNewPassword: '',
	})
	const {oldPassword, newPassword, reNewPassword} = formData

    const initalError = {
        loading: false,
        oldPassword: {
            code: 0,
            message: '',
        },
        newPassword: {
            code: 0,
            message: '',
        },
        reNewPassword: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, oldPasswordState, newPasswordState, reNewPasswordState] = [{}, {}, {}, {}]
        switch(action.type) {
            case "LOADING":
                return { ...state, loading: true }
            case "SUCCESS":
                return { ...state, loading: false }
            case OLDPASSWORDBLANK:
                oldPasswordState = {code: OLDPASSWORDBLANK, message: GetOldPasswordBlankError().msg}
                newState = {loading: false, oldPassword: oldPasswordState}
                return {...state, ...newState}
            case NEWPASSWORDBLANK:
                newPasswordState = {code: NEWPASSWORDBLANK, message: GetNewPasswordBlankError().msg}
                newState = {loading: false, newPassword: newPasswordState}
                return {...state, ...newState}
            case REPASSWORDBLANK:
                reNewPasswordState = {code: REPASSWORDBLANK, message: GetRePasswordBlankError().msg}
                newState = {loading: false, reNewPassword: reNewPasswordState}
                return {...state, ...newState}
            case PASSWORDNOTMATCH:
                newPasswordState = {code: PASSWORDNOTMATCH, message: GetPasswordNotMatchError().msg}
                newState = {loading: false, newPassword: newPasswordState}
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
		if (id === 'oldPassword') {
            error = {oldPassword:{message: ''}}
		} else if (id === 'newPassword') {
            error = {newPassword:{message: ''}}
		} else if (id === 'reNewPassword') {
            error = {reNewPassword:{message: ''}}
		}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}
    
    
    const onSubmit = async (event) => {
        event.preventDefault()

        var isPass = true
        var params = {}
        params["token"] = token

        // 偵測舊密碼沒有填的錯誤
        if (oldPassword !== undefined && oldPassword.length > 0) {
            params["oldPassword"] = oldPassword
        } else {
            dispatch({type: OLDPASSWORDBLANK})
            isPass = false
        }

        // 偵測新密碼沒有填的錯誤
        if (newPassword !== undefined && newPassword.length > 0) {
            params["newPassword"] = newPassword
        } else {
            dispatch({type: NEWPASSWORDBLANK})
            isPass = false
        }

        // 偵測確認新密碼沒有填的錯誤
        if (reNewPassword !== undefined && reNewPassword.length > 0) {
            params["reNewPassword"] = reNewPassword
        } else {
            dispatch({type: REPASSWORDBLANK})
            isPass = false
        }
        // 偵測密碼與確認密碼不一致的錯誤
        if (newPassword !== reNewPassword) {
            dispatch({type: PASSWORDNOTMATCH})
            isPass = false
        }
        // dump(params);

        if (isPass) {
            setIsLoading(true)
            const data = await putChangePasswordAPI(auth.accessToken, params)
            callback(data)
            setIsLoading(false)
        }
    }

    const callback = (data) => {
        if (data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalTitle: '成功',
                modalText: "成功更新完密碼，請用新密碼來登入",
                isModalShow: true,
                isShowCancelButton: true,
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
                    modalType: 'warning',
                    modalTitle: '失敗',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowCancelButton: true,
                })
            }
        }
    }

    // 關閉訊息對話盒
    // 1.登出
    // 2.回到登入頁
    const toGo = () => {
        logoutAPI(setAuth);
        setAlertModal({
            isModalShow: false,
        });
        navigate('/member/login');
        //toLogin()
    }
        
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-20">更換密碼</h2>
                <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <Password 
                        label="舊密碼"
                        name="oldPassword"
                        value={oldPassword}
                        id="oldPassword"
                        placeholder="請填舊密碼"
                        isRequired={true}
                        errorMsg={errorObj.oldPassword.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Password 
                        label="新密碼"
                        name="newPassword"
                        value={newPassword}
                        id="newPassword"
                        placeholder="請填新密碼"
                        isRequired={true}
                        errorMsg={errorObj.newPassword.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />

                    <Password 
                        label="確認新密碼"
                        name="reNewPassword"
                        value={reNewPassword}
                        id="reNewPassword"
                        placeholder="請填確認新密碼"
                        isRequired={true}
                        errorMsg={errorObj.reNewPassword.message}
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