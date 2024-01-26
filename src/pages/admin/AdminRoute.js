import {useContext, useRef, useEffect, useState} from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import BMContext from '../../context/BMContext'

const AdminRoute = () => {
    const {memberData, effectEnd} = useContext(BMContext)
    const {role} = memberData
    const [isAdmin, setIsAdmin] = useState(true)

    // const isMounted = useRef(true)
    // useEffect(() => {
    //     console.info(isAdmin)
    //     if (isMounted) {
    //         setIsAdmin(role === 'admin' ? true : false)
    //     }

    //     return () => {
    //         isMounted.current = false
    //     }
    // }, [isMounted])

    // if (effectEnd) {
    //     console.info("aaa")
    // }

    // const sleep = async () => {
    //     setTimeout(() => {
    //         console.info(role)
    //     }, 1000)
    // }
    // sleep()
    //const role1 = "admin"
    return (isAdmin) ? <Outlet /> : <Navigate to='/member/login' /> 
    //return isLogin ? <Outlet /> : <Navigate to='/member/login' />
}

export default AdminRoute
