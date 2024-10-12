import React from 'react'
import Sidebar from './Sidebar'
import NavbarAdmin from './NavbarAdmin';
import { Outlet } from 'react-router-dom'

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
