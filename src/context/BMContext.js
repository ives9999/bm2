import { createContext, useState, useReducer } from 'react'
import memberReducer from './MemberReducer'

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)

    const initMemberState = {
        memberData: {},
        isLogin: false,
    }
    const [memberState, memberDispatch] = useReducer(memberReducer, initMemberState)

    return <BMContext.Provider value={{
        isLoading,
        setIsLoading,
        ...memberState,
        memberDispatch,
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext
