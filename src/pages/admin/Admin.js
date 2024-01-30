import { Routes, Route } from 'react-router-dom';
import React from 'react'
import Sidebar from '../../layout/Sidebar'
import NavbarAdmin from '../../layout/NavbarAdmin';
import Index from '../admin/Index'
import ReadMember from '../admin/member/Read'
import ReadProduct from '../admin/product/Read'
import UpdateProduct from './product/Update';

function Admin() {
    return (
        <>
        <div className="flex flex-auto h-screen">
            <Sidebar />
            <div className="grow">
                <NavbarAdmin />
                <div className=''>
                    <Routes>
                        <Route path="/" element={ <Index /> } />
                        <Route path="/member" element={ <ReadMember /> } />
                        <Route path="/product" element={ <ReadProduct /> } />
                        <Route path="/product/update" element={ <UpdateProduct /> }>
                        <Route index element={ <UpdateProduct />} />
                            <Route path=":token" element={ <UpdateProduct /> } />
                        </Route>
                    </Routes>
                </div>
            </div>
        </div>
        </>
    )
}

export default Admin
