import { createContext, useState, useReducer } from 'react'
import memberReducer from './MemberReducer'

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)

    // const initModalState = {
    //     modalType: "alert",
    //     modalText: "警告",
    //     isModalShow: false,
    // }
    // const [modalState, modalDispatch] = useReducer(modalReducer, initModalState)
    const [alertModal, setAlertModal] = useState({
        modalType: "success",
        modalText: "成功",
        isModalShow: false,
        onClose: null,
    })

    const initMemberState = {
        memberData: {},
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
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext
