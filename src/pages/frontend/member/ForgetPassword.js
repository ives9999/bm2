import { React, useState, useReducer, useContext } from "react";
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import {PrimaryButton} from '../../../component/MyButton';
import {getForgetPasswordAPI} from '../../../context/member/MemberAction'
import { useNavigate } from "react-router-dom"

import { 
    EMAILBLANK,
    EMAILINVALID,
    GetEmailBlankError, 
    GetEmailInvalidError,
 } from "../../../errors/MemberError"

const ChangePassword = () => {
    const {setIsLoading, setAlertModal} = useContext(BMContext);
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: '忘記密碼', href: '/member/changePassword', current: true },
    ]

    const [formData, setFormData] = useState({
		email: '',
	})
	const {email} = formData

    const initalError = {
        loading: false,
        email: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, emailState] = [{}, {}]
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
		if (id === 'email') {
            error = {email:{message: ''}}
		}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}
    
    
    const onSubmit = async (event) => {
        event.preventDefault()

        var isPass = true

        if (email.trim().length === 0) {
            dispatch({type: EMAILBLANK})
			isPass = false
		}

        if (isPass) {
            setIsLoading(true)
            const data = await getForgetPasswordAPI(email)
            callback(data)
            setIsLoading(false)
        }
    }

    const callback = (data) => {
        if (data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalTitle: '成功',
                modalText: "已經將重設密碼的信件，寄到您註冊的信箱了",
                isModalShow: true,
                isShowCancelButton: true,
                onClose: navigate('/member/login'),
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
        
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-20">忘記密碼</h2>
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