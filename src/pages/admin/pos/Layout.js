import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export function Layout() {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <Header />
            <Outlet/>
        </div>
    )
}
