import {useLocation, Navigate, Outlet} from 'react-router-dom'
import {useContext, useState, useEffect} from 'react'
import BMContext from '../context/BMContext'
import Flash from './Flash'
import { getOneAPI } from '../context/member/MemberAction'

const RequireAuth = () => {
    const {auth, setIsLoading} = useContext(BMContext)
    const [isPass, setIsPass] = useState(false);
    const [roles, setRoles] = useState('guest');
    const location = useLocation();
    // console.info("isPass: " + isPass);
    // console.info("isLoading: " + isLoading);
    const getMemberData = async (accessToken, member_token, scenario) => {
        setIsLoading(true);
        const data = await getOneAPI(accessToken, member_token, scenario);
        setRoles(data.data.role.split(","));
        setIsPass(true);
        setIsLoading(false);
    }

    useEffect(() => {
        //console.info("aaa:"+Object.keys(auth).length);
        if (Object.keys(auth).length > 0 && auth.accessToken) {
            getMemberData(auth.accessToken, auth.token, 'read');
        } else { //(Object.keys(auth).length === 0) {
            setRoles(['guest']);
            setIsPass(true);
        }

    }, [auth]);


    if (!isPass) return <h1 className='text-MyWhite'>Loading...</h1>;
    else if (!roles.includes('admin')) return <Flash />
    else if (roles.includes('admin')) return <Outlet />;
    else return <Navigate to="/member/login" state={{from: location}} replace />
    //state的內容可以傳到login page 使用，而replace表示login頁不會被記錄到歷史紀錄中，所以從登入頁回來後，按下上一頁，不會再回login頁面，login頁面的歷史紀錄已經被取代了
}

export default RequireAuth