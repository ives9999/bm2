import {Navigate, Outlet} from 'react-router-dom'

const AdminRoute = () => {
    const isLoggedIn = false
    return isLoggedIn ? <Outlet /> : <Navigate to='/member/login' />
}

export default AdminRoute
