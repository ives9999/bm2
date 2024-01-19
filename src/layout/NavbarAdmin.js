import React from 'react'

function NavbarAdmin() {
    return (
        <nav className='border-b border-gray-600 mx-2 px-2 py-2.5 rounded'>
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
    )
}

export default NavbarAdmin
