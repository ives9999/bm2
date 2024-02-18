import {useLocation, Navigate, Outlet} from 'react-router-dom'
import {useContext} from 'react'
import BMContext from '../context/BMContext'
import Flash from './Flash'

const RequireAuth = () => {
    const {auth, isLoading} = useContext(BMContext)
    // const auth = (memberData.role === 'admin') ? true : false
    const location = useLocation();

    if (isLoading) return <h1>Loading...</h1>;
    else if (auth.role !== 'admin') return <Flash />
    else if (auth.role === 'admin') return <Outlet />;
    else return <Navigate to="/member/login" state={{from: location}} replace />
    //state的內容可以傳到login page 使用，而replace表示login頁不會被記錄到歷史紀錄中，所以從登入頁回來後，按下上一頁，不會再回login頁面，login頁面的歷史紀錄已經被取代了
}

export default RequireAuth