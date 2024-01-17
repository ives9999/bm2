import React from 'react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Sidebar from '../../component/Sidebar'

function Index() {
    return (
        <>
            <div className="flex flex-auto h-screen">
                <Sidebar />
                <div className="grow">
                    <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded'>
                        <div className='container flex justify-between items-center mx-auto pt-3'>
                            <div className='flex items-center mx-auto'>
                            <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
                                Welcome
                            </span>
                            </div>

                            <div className='flex justify-end pr-4'>
                                <div className='text-white'>頭像</div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Index
