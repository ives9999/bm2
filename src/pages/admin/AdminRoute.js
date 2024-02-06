import {useContext, useRef, useEffect, useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Index from '../admin/Index'

import {Navigate, Outlet} from 'react-router-dom'
import BMContext from '../../context/BMContext'

const AdminRoute = () => {
    // const {memberData, effectEnd} = useContext(BMContext)
    // const {role} = memberData
    // const [isAdmin, setIsAdmin] = useState(true)

    <Routes>
        <Route path='/admin' element={<Layout />}>
            <Route index element={ <Index /> } />
            {/* <Route path="/member" element={ <ReadMember /> } />
            <Route path="/product" element={ <ReadProduct /> } />
            <Route path="/product/update" element={ <UpdateProduct /> }>
            <Route index element={ <UpdateProduct />} />
                <Route path=":token" element={ <UpdateProduct /> } />
            </Route> */}
        </Route>
    </Routes>

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
    //return (isAdmin) ? <Outlet /> : <Navigate to='/member/login' /> 
    //return isLogin ? <Outlet /> : <Navigate to='/member/login' />
}

export default AdminRoute
