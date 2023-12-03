import { createContext, useState } from 'react'
import toCookie from '../api/toCookie'
import {memberGetOneAPI} from './member/MemberAction';

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    //const [memberData, setMemberData] = useState({})

    const token = toCookie('GET_TOKEN')

    // const getMemberOne = async(token) => {
    //     const data = await memberGetOneAPI(token)
    //     setMemberData(data)
    // }
    // getMemberOne(token)

    return <BMContext.Provider value={{
        isLoading,
        setIsLoading,
        //memberData,
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext
