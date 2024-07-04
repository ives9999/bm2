import { React, useState, useReducer, useContext, useRef } from "react";
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
    MEMBERINVALID,
    PASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    CODEBLANK,
    GetMobileBlankError,
    GetMemberInvalidError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetCodeBlankError
 } from "../../../errors/MemberError"

const SetPasswordForStore = () => {
    const {setIsLoading, setAlertModal} = useContext(BMContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // 測試是否第一關驗證已經通過
    const isValidate1 = useRef(false);
    // 測試是否第二關驗證已經通過
    const isValidate2 = useRef(false);
    // 是否已經取得驗證碼
    const isGetCode = useRef(false);
    // 是否已經送出驗證碼，並且驗證成功
    const isSendCode = useRef(false);

    const { token } = useQueryParams();

    const breadcrumbs = [
        { name: '設定密碼', href: '/member/setPassword', current: true },
    ];

    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        rePassword: '',
        code: ''
	});
	const {mobile, password, rePassword, code} = formData;

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
            case MEMBERINVALID:
                mobileState = {code: MEMBERINVALID, message: GetMemberInvalidError().msg}
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
    
    // 處理第幾步
    const handleStep = (nextOrPrevStep) => {
        if (nextOrPrevStep === 1) {
            setStep(1);
        } else if (nextOrPrevStep === 2) {
            if (!isValidate1.current) {
                validateStep1();
            }
            if (isValidate1.current && !isGetCode.current) {
                getCode();
            }
            if (isValidate1.current && isGetCode.current) {
                setAlertModal({
                    isModalShow: false
                });
                setStep(2);
            }
        } else if (nextOrPrevStep === 3) {
            if (!isValidate2.current) {
                validateStep2();
            }
            if (isValidate2.current && !isSendCode.current) {
                sendCode();
            } 
            if (isValidate2.current && isSendCode.current) {
                setAlertModal({
                    isModalShow: false
                });
                setStep(3);
            }
        }
    }

    // 驗證手機與密碼的錯誤
    const validateStep1 = () => {
        var isPass = true;
        if (!isValidate1.current) {
            // 偵測手機沒有填的錯誤
            if (mobile === undefined || mobile.length === 0) {
                dispatch({type: MOBILEBLANK})
                isPass = false
            }

            // 偵測舊密碼沒有填的錯誤
            if (password === undefined || password.length === 0) {
                dispatch({type: PASSWORDBLANK})
                isPass = false
            }

            // 偵測確認密碼沒有填的錯誤
            if (rePassword === undefined || rePassword.length === 0) {
                dispatch({type: REPASSWORDBLANK})
                isPass = false
            }
            // 偵測密碼與確認密碼不一致的錯誤
            if (password !== rePassword) {
                dispatch({type: PASSWORDNOTMATCH})
                isPass = false
            }
        }
        if (isPass) {
            isValidate1.current = true;
        }
    }

    // 從系統取得驗證碼
    const getCode = async () => {
        setIsLoading(true);
        const data = await setPasswordForStore1(mobile, password, rePassword);
        console.info(data);
        if (data.data.status === 200) {
            isGetCode.current = true
            setAlertModal({
                modalType: 'success',
                modalTitle: '成功',
                modalText: "成功送出密碼，系統也送出一組驗證碼，請繼續完成填入正確驗證碼，確認是本人設定。",
                isModalShow: true,
                isShowCancelButton: true,
                onClose: toStep(2)
            });
        } else {
            const messages = data.data["message"];
            let errors = [];
            messages.forEach((item) => {
                errors.push(item.message);
            })

            if (errors.length > 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalText: errors,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                });
            }
        }
        setIsLoading(false);
    }

    // 驗證驗證碼的錯誤
    const validateStep2 = async () => {
        var isPass = true;
        if (!isValidate2) {
            // 偵測驗證碼沒有填的錯誤
            if (code === undefined && code.length === 0) {
                dispatch({type: CODEBLANK})
                isPass = false
            }
        }
        if (isPass) {
            isValidate2.current = true;
        }
    }

    // 送出驗證碼
    const sendCode = async () => {
        setIsLoading(true)
        const data = await setPasswordForStore2(code, mobile);
        console.info(data);
        if (data.data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalTitle: '成功',
                modalText: "成功設定密碼，並完成手機驗證，請用新密碼登入。",
                isModalShow: true,
                isShowCancelButton: true,
                onClose: toStep(3)
            });
            isSendCode.current = true;
        } else {
            const messages = data.data["message"];
            let errors = [];
            messages.forEach((item) => {
                errors.push(item.message);
            })

            if (errors.length > 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalText: errors,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                });
            }
        }
        setIsLoading(false);
    }

    const toStep = (nextOrPrev) => {
        setAlertModal({
            isModalShow: false
        });
        setStep(nextOrPrev);
    }

    const toLogin = () => {
        navigate("/member/login");
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
                        <div className="text-MyWhite mb-8">密碼已設定完成，且已經完成手機驗證，請用新設的密碼來登入</div>
                        <PrimaryButton className={`w-full mb-8 ${step===1 ? "hidden" : "block"}`} type="button" onClick={() => toLogin()}>登入</PrimaryButton>
                    </div>
                    <div className="mb-8"></div>
                    <div className={`flex flex-row gap-8 ${step === 2 ? "justify-between": ""}`}>
                        <PrimaryButton className={`w-full mb-8 ${step===2 ? "block" : "hidden"}`} type="button" onClick={() => handleStep(step-1)}>上一步</PrimaryButton>
                        <PrimaryButton className={`w-full mb-8 ${step===3 ? "hidden" : "block"}`} type="button" onClick={() => handleStep(step+1)}>下一步</PrimaryButton>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}

export default SetPasswordForStore