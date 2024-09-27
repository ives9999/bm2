import React from 'react'

export function PrimaryLabel({
                                 children,
                                 active = true,
                                 onClick = null
                             }) {
    // const common = 'items-center focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-4 py-2.5 mr-4 ';
    // const style = common + ((active) ? 'bg-Primary-300 hover:bg-BG-700 focus:ring-Primary-500' : 'text-gray-300 bg-gray-800 hover:bg-gray-600 focus:ring-gray-800');
    return (
        <span
            className='bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-Primary-300 dark:text-Primary-800'
            onClick={onClick}
        >{children}
        </span>
    )
}
