import { createContext, useState, useEffect } from 'react'
import Cookies from "universal-cookie";
import { Logout } from '../component/Logout';
import IsLoginAPI from '../api/home/IsLoginAPI';

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false)

    //cookie
    const cookies = new Cookies()
    const token = cookies.get("token")
    // var page = cookies.get("page")
    // if (page === undefined) {
    //     page = "home";
    // }

    // const setPage = (value) => {
    //     cookies.set('page', value, {
    //         domain: process.env.REACT_APP_DOMAIN,
    //         expire: 60*60*24*30*365*10,
    //         path: '/',
    //         secure: 0,
    //     })
    // }

    // // State to track the active status and key
    // const [isActive, setIsActive] = useState({
    //     status: false,
    //     value: page,
    // });

    // // Function to handle toggling the active status based on the given key
    // const handleToggle = (value) => {

    //     cookies.set('page', value, {
    //         domain: process.env.REACT_APP_DOMAIN,
    //         expire: 60*60*24*30*365*10,
    //         path: '/',
    //         secure: 0,
    //     })
    //     // Check if the current key matches the active key in the state
    //     if (isActive.value === value) {
    //         // If the current key matches, set the active status to false
    //         setIsActive({
    //             status: false,
    //         });
    //     } else {
    //         // If the current key does not match, set the active status to true and update the key
    //         setIsActive({
    //             status: true,
    //             value,
    //         });
    //     }
    // };


    const [isLogin, data, message] = IsLoginAPI(token)

    const logout = () => {
        Logout(cookies)
        window.location.reload()
    }

    return <BMContext.Provider value={{
        isLoading,
        cookies,
        token,
        logout,
        isLogin,
    }}>
        {children}
    </BMContext.Provider>
}
export default BMContext
