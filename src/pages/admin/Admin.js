import { Routes, Route } from 'react-router-dom';
import React from 'react'
import Sidebar from '../../layout/Sidebar'
import NavbarAdmin from '../../layout/NavbarAdmin';
import Index from '../admin/Index'
import Read from '../admin/member/Read'

function Admin() {
    return (
        <div className="flex flex-auto h-screen">
            <Sidebar />
            <div className="grow bg-PrimaryBlock-950">
                <NavbarAdmin />
                <div className=''>
                    <Routes>
                        <Route path="/" element={ <Index /> } />
                        <Route path="/member" element={ <Read /> } />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Admin
