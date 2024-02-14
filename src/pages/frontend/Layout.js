import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../layout/Header'

export function Layout() {
    return (
        <>
            <Header />
            <div className="max-h-full min-h-full bg-background">
                <Outlet />
            </div>
        </>
    )
}