import { createContext, useState, useReducer, useEffect } from 'react'
import memberReducer from './MemberReducer'
import toCookie from "../api/toCookie"
import {memberGetOneAPI} from './member/MemberAction';

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [effectEnd, setEffectEnd] = useState(false)

    useEffect(() => {
        const token = toCookie('GET_TOKEN')
        if (token.length > 0) {
            const getMemberData = async (token) => {
                const data = await memberGetOneAPI(token)
                memberDispatch({type: 'GET_ONE', payload: data.data})
            }
            getMemberData(token)
            setEffectEnd(true)
        } else {
            memberDispatch({type: 'GET_ONE', payload: {
                nickname: '',
                email: '',
                avatar: "",
                token: token
            }})
        }
        setIsLoading(false)
    }, [])

    // const initModalState = {
    //     modalType: "alert",
    //     modalText: "警告",
    //     isModalShow: false,
    // }
    // const [modalState, modalDispatch] = useReducer(modalReducer, initModalState)
    const [alertModal, setAlertModal] = useState({
        isModalShow: false,
        modalType: "success",
        modalTitle: "成功",
        modalText: "您已經新增成功",
        isShowOKButton: false,
        isShowCancelButton: false,
        onOK: null,
        onClose: null,
        params: {},
    })

    const initMemberState = {
        memberData: {
            nickname: "",
            avatar: "",
            email: '',
            privacy: false,
        },
        isLogin: false,
    }
    const [memberState, memberDispatch] = useReducer(memberReducer, initMemberState)

    return <BMContext.Provider value={{
        isLoading,
        setIsLoading,
        alertModal,
        setAlertModal,
        ...memberState,
        memberDispatch,
        effectEnd,
        setEffectEnd,
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext