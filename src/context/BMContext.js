import { createContext, useState, useReducer, useEffect } from 'react'
import memberReducer from './MemberReducer'
import {getOneAPI, getAccessTokenAPI} from './member/MemberAction';
import useAxiosPublic from '../hooks/useAxiosPublic';

const BMContext = createContext()

export const BMProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [auth, setAuth] = useState({});
    const axiosPublic = useAxiosPublic();

    const getAccessToken = async (refreshToken) => {
        setIsLoading(true);
        try {
            const domain = process.env.REACT_APP_API
            const url = domain + "/member/getAccessToken?refresh_token=" + refreshToken;
            const data = await axiosPublic.get(url)
            //console.info(data);
            if (data.data.data.refreshToken !== null) {
                localStorage.setItem('refreshToken', data.data.data.refreshToken)
            }
            setAuth((prev) => ({...prev, ...{refreshToken: data.data.data.refreshToken}, ...{accessToken: data.data.data.accessToken}, ...data.data.data.idToken}));
        } catch (e) {
            console.info(e)
        }
        //const data = await getAccessTokenAPI(accessToken);
        //console.info(data);
        setIsLoading(false);
    }

    const getMemberData = async (token) => {
        setIsLoading(true)
        const data = await getOneAPI(token)
        memberDispatch({type: 'GET_ONE', payload: data.data})
        setAuth(data.data)
        setIsLoading(false)
    }

    useEffect(() => {
        //const token = toCookie('GET_TOKEN')
        // if (token !== undefined && token !== null && token.length > 0) {
        //     getMemberData(token)
        // } 
        // else {
        //     memberDispatch({type: 'GET_ONE', payload: {
        //         nickname: '',
        //         email: '',
        //         avatar: "",
        //         token: token
        //     }})
        // }

        // 1.先檢查auth是否有保存refresh token
        if (Object.keys(auth).length === 0 && auth.constructor === Object) {
            const refreshToken = localStorage.getItem('refreshToken');
            // 2.如果有，表示已經登入，但access token已被清除，如果沒有表示沒有登入
            if (refreshToken != null) {
                // 3.用refresh token去取得access token，但如果refresh token也過期，則直接登出
                getAccessToken(refreshToken);
            }
        }
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