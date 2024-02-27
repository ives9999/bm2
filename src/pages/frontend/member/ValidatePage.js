import {useContext, useState, useReducer} from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import toCookie from '../../../api/toCookie';
import {PrimaryButton, SecondaryButton} from '../../../component/MyButton';
import {getValidateCodeAPI, getValidateAPI} from '../../../context/member/MemberAction'
import {
    CODEBLANK,
    CODEERROR,
    GetCodeErrorError,
    GetCodeBlankError,
} from '../../../errors/MemberError'

function ValidatePage() {
    const {type} = useParams()
    const title_type = (type === 'email') ? "Email" : "手機"
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const {email, mobile, token} = auth
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: title_type + '認證', href: '/member/validate', current: true },
    ]
    //const value_type = (type === 'email') ? memberData.email : memberData.mobile

    const [formData, setFormData] = useState({
		code: '',
	})
    const {code} = formData

    const initalError = {
        loading: false,
        code: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, codeState] = [{}, {}, {}]
        switch(action.type) {
            case "LOADING":
                return { ...state, loading: true }
            case "SUCCESS":
                return { ...state, loading: false }
            case CODEBLANK:
                codeState = {code: CODEBLANK, message: GetCodeBlankError().msg}
                newState = {loading: false, code: codeState}
                return {...state, ...newState}
            case CODEERROR:
                codeState = {code: CODEERROR, message: GetCodeErrorError(code).msg}
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

    const handleClear = () => {
        setFormData((prevState) => ({
			...prevState,
			...{code:""}
		}))
		clearError()
    }

    const clearError = () => {
        const error = {code:{message: ''}}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    const resend = () => {
        setIsLoading(true)
        const getData = async () => {
            const data = await getValidateCodeAPI(auth.accessToken, type, token)
            setIsLoading(false)
            if (data.status === 200) {
                setAlertModal({
                    modalType: 'success',
                    modalTitle: '成功',
                    modalText: "認證碼已送出",
                    isModalShow: true,
                    isShowCancelButton: true,
                })
            } else {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '失敗',
                    modalText: "認證碼送出錯誤，請洽管理員",
                    isModalShow: true,
                    isShowCancelButton: true,
                })
            }
        }
        getData()
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        let isPass = true
        // 本地端檢查
		if (code.trim().length === 0) {
            dispatch({type: CODEBLANK})
			isPass = false
		}

        if (isPass) {
            setIsLoading(true)
            const data = await getValidateAPI(auth.accessToken, type, code, token)
            callback(data)
            setIsLoading(false)
        }
    }

    const callback = (data) => {
        if (data["status"] === 200) {
            setAlertModal({
                modalType: 'success',
                modalText: "恭喜您完成認證！！",
                isModalShow: true,
                isShowCancelButton: true,
                onClose: toMember,
            })
        } else {
            if (data["message"]["id"] === CODEERROR) {
                dispatch({type: CODEERROR})
            } else {
                setAlertModal({
                    modalType: 'alert',
                    modalText: data["message"]["message"],
                    isModalShow: true,
                    isShowCancelButton: true,
                })
            }
        }
    }

    const toMember = () => {
        setAlertModal({
            isModalShow: false,
        });
        navigate('/member');
        // toCookie('LOGIN', {token: token})
        // window.location.href = document.referrer
    }


    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{title_type}認證</h2>
                <form onSubmit={onSubmit}>
                    <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                        <div className='text-MyWhite mb-8'>{type==='email' ? email: mobile}</div>
                        <Input 
                        label="認證碼"
						type="text"
						name="code"
						value={code || ''}
						id="code"
						isRequired={true}
						errorMsg={errorObj.code.message}
						onChange={onChange}
						onClear={handleClear}
                        />
                        <PrimaryButton className='w-full mb-8' type="submit">送出</PrimaryButton>
                        <SecondaryButton className='w-full' type="button" onClick={resend}>重新發送</SecondaryButton>
                        <div className="mb-8"></div>
                    </div>
                </form>
            </main>
        </div>
        </>
    )
}

export default ValidatePage
