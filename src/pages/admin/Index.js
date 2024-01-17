import React from 'react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

function Index() {
    return (
        <>
        <nav className="flex px-2 py-2.5 border-gray-700 bg-BG-900 sm:px-4 rounded">
            <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
        </nav>
        </>
    )
}

export default Index
