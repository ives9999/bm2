import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../layout/Sidebar'
import NavbarAdmin from '../../layout/NavbarAdmin';

export function Layout() {
    return (
        <div className="flex flex-auto h-screen">
            <Sidebar />
            <div className="grow">
                <NavbarAdmin />
                <div className=''>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
