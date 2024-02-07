import {useLocation, Navigate, Outlet} from 'react-router-dom'

const RequireAuth = () => {
    const auth = false
    const location = useLocation();
    return (
        auth 
        ? <Outlet /> 
        : <Navigate to="/member/login" state={{from: location}} replace />
        // state的內容可以傳到login page 使用，而replace表示login頁不會被記錄到歷史紀錄中，所以從登入頁回來後，按下上一頁，不會再回login頁面，login頁面的歷史紀錄已經被取代了
    )
}

export default RequireAuth
