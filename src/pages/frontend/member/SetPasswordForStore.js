import { React, useState, useReducer, useContext } from "react";
import useQueryParams from '../../../hooks/useQueryParams'
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import Password from "../../../component/form/Password";
import {PrimaryButton} from '../../../component/MyButton';
import {setPasswordForStore1, setPasswordForStore2} from '../../../context/member/MemberAction'
import { useNavigate } from "react-router-dom";

import { 
    MOBILEBLANK,
    PASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    CODEBLANK,
    GetMobileBlankError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetCodeBlankError
 } from "../../../errors/MemberError"

const SetPasswordForStore = () => {
    const {setIsLoading, setAlertModal} = useContext(BMContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const { token } = useQueryParams()

    const breadcrumbs = [
        { name: '設定密碼', href: '/member/setPassword', current: true },
    ]

    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        rePassword: '',
        code: ''
	})
	const {mobile, password, rePassword, code} = formData

    const initalError = {
        loading: false,
        mobile: {
            code: 0,
            message: ''
        },
        password: {
            code: 0,
            message: '',
        },
        rePassword: {
            code: 0,
            message: '',
        },
        code: {
            code: 0,
            message: '',
        }
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, mobileState, passwordState, rePasswordState, codeState] = [{}, {}, {}, {}, {}]
        switch(action.type) {
            case "LOADING":
                return { ...state, loading: true }
            case "SUCCESS":
                return { ...state, loading: false }
            case MOBILEBLANK:
                mobileState = {code: MOBILEBLANK, message: GetMobileBlankError().msg}
                newState = {loading: false, mobile: mobileState}
                return {...state, ...newState}
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
                return {...state, ...newState};
            case CODEBLANK:
                codeState = {code: CODEBLANK, message: GetCodeBlankError().msg}
                newState = {loading: false, code: codeState}
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
        if (id === 'mobile') {
            error = {mobile: {message: ''}}
        } else if (id === 'password') {
            error = {password:{message: ''}}
		} else if (id === 'rePassword') {
            error = {rePassword:{message: ''}}
		} else if (id === 'code') {
            error = {code: {message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}
    
    
    const handleStep = async (nextOrPrev) => {
        if (nextOrPrev === "prev") {
            setStep((prev) => nextOrPrev === "next" ? prev + 1 : prev - 1);
        } else {
            var isPass = true
            var params = {}
            if (step === 1) {
                params["token"] = token

                // 偵測手機沒有填的錯誤
                if (mobile !== undefined && mobile.length > 0) {
                    params["mobile"] = mobile;
                } else {
                    dispatch({type: MOBILEBLANK})
                    isPass = false
                }

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
                if (isPass) {
                    setIsLoading(true)
                    const data = await setPasswordForStore1(mobile, password, rePassword);
                    console.info(data)
                    callback(data.data, nextOrPrev);
                    setIsLoading(false)
                }
            } else if (step === 2) {
                // 偵測驗證碼沒有填的錯誤
                if (code !== undefined && code.length > 0) {
                    params["code"] = code;
                } else {
                    dispatch({type: CODEBLANK})
                    isPass = false
                }
                if (isPass) {
                    setIsLoading(true)
                    const data = await setPasswordForStore2(code, mobile);
                    console.info(data)
                    callback(data.data, nextOrPrev);
                    setIsLoading(false)
                }
            }
        }

    }

    const callback = (data, nextOrPrev) => {
        if (data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalTitle: '成功',
                modalText: "成功送出密碼，系統也送出一組驗證碼，請繼續完成填入正確驗證碼，確認是本人設定。",
                isModalShow: true,
                isShowCancelButton: true,
                onClose: toStep(nextOrPrev)
            });
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

    const toStep = (nextOrPrev) => {
        setAlertModal({
            isModalShow: false
        });
        setStep((prev) => nextOrPrev === "next" ? prev + 1 : prev - 1);
    }
        
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-20">設定密碼</h2>
                <div className="mx-auto bg-Menu border border-PrimaryBlock-800 p-8 rounded-lg">
                    <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse mb-12">
                        <li className={`flex items-center space-x-2.5 rtl:space-x-reverse dark:${step === 1 ? "border-Primary-300 text-Primary-300" : "border-gray-400 text-gray-400"}`}>
                            <span className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 dark:${step === 1 ? "border-Primary-300" : "border-gray-400"}`}>
                                1
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">設定密碼</h3>
                            </span>
                        </li>
                        <li className={`flex items-center space-x-2.5 rtl:space-x-reverse dark:${step === 2 ? "border-Primary-300 text-Primary-300" : "border-gray-400 text-gray-400"}`}>
                            <span className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 dark:${step === 2 ? "border-Primary-300" : "border-gray-400"}`}>
                                2
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">驗證手機</h3>
                            </span>
                        </li>
                        <li className={`flex items-center space-x-2.5 rtl:space-x-reverse dark:${step === 3 ? "border-Primary-300 text-Primary-300" : "border-gray-400 text-gray-400"}`}>
                            <span className={`flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:${step === 3 ? "border-Primary-300" : "border-gray-400"}`}>
                                3
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">完成</h3>
                            </span>
                        </li>
                    </ol>
                    <div className={`${step === 1 ? "block" : "hidden"}`}>
                        <Input 
                            label="手機"
                            type="text"
                            name="mobile"
                            value={mobile || ''}
                            id="mobile"
                            placeholder="0933256899"
                            isRequired={true}
                            errorMsg={errorObj.mobile.message}
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
                    </div>
                    
                    <div className={`${step === 2 ? "block" : "hidden"}`}>
                        <div className={`${step === 2 ? "block" : "hidden"}`}>
                            <Input 
                                label="驗證碼"
                                type="text"
                                name="code"
                                value={code || ''}
                                id="code"
                                placeholder="123456"
                                isRequired={true}
                                errorMsg={errorObj.code.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                    </div>
                    <div className={`${step === 3 ? "block" : "hidden"}`}>

                    </div>
                    <div className="mb-8"></div>
                    <div className={`flex flex-row gap-8 ${step === 2 ? "justify-between": ""}`}>
                        <PrimaryButton className={`w-full mb-8 ${step===1 ? "hidden" : "block"}`} type="button" onClick={() => handleStep("prev")}>上一步</PrimaryButton>
                        <PrimaryButton className={`w-full mb-8 ${step===3 ? "hidden" : "block"}`} type="button" onClick={() => handleStep("next")}>下一步</PrimaryButton>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}

export default SetPasswordForStore