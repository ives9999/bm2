import { Routes, Route } from 'react-router-dom';
import React from 'react'
import Sidebar from '../../layout/Sidebar'
import NavbarAdmin from '../../layout/NavbarAdmin';
import Index from '../admin/Index'
import ReadMember from '../admin/member/Read'
import ReadProduct from '../admin/product/Read'
import { BMProvider } from '../../context/BMContext'
import Loading from '../../component/Loading'
import {AllModal} from "../../component/Modal";
import { ToastContainer } from 'react-toastify';

function Admin() {
    return (
        <BMProvider>
        <div className="flex flex-auto h-screen">
            <Sidebar />
            <div className="grow bg-PrimaryBlock-950">
                <NavbarAdmin />
                <div className=''>
                    <Routes>
                        <Route path="/" element={ <Index /> } />
                        <Route path="/member" element={ <ReadMember /> } />
                        <Route path="/product" element={ <ReadProduct /> } />
                    </Routes>
                </div>
            </div>
        </div>
        <Loading />
        <AllModal />
        <ToastContainer theme="colored" />

        </BMProvider>
    )
}

export default Admin
