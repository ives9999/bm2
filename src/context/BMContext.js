import { createContext, useState, useReducer, useEffect } from 'react'
import memberReducer from './MemberReducer'
import {getOneAPI} from './member/MemberAction';

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [auth, setAuth] = useState({})
    const token = localStorage.getItem('token')

    const getMemberData = async (token) => {
        setIsLoading(true)
        const data = await getOneAPI(token)
        memberDispatch({type: 'GET_ONE', payload: data.data})
        setIsLoading(false)
    }

    useEffect(() => {
        //const token = toCookie('GET_TOKEN')
        if (token !== undefined && token !== null && token.length > 0) {
            getMemberData(token)
        } 
        // else {
        //     memberDispatch({type: 'GET_ONE', payload: {
        //         nickname: '',
        //         email: '',
        //         avatar: "",
        //         token: token
        //     }})
        // }
    }, [token])

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
        auth,
        setAuth,
        alertModal,
        setAlertModal,
        ...memberState,
        memberDispatch,
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext