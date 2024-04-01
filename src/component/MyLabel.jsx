import React from 'react'

function MyLabel({
    children,
    active = false,
}) {
    const common = 'items-center focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-4 py-2.5 ';
    const style = common + ((active) ? 'text-Primary-400 bg-BG-800 hover:bg-BG-700 focus:ring-Primary-500':'text-gray-300 bg-gray-800 hover:bg-gray-600 focus:ring-gray-800');
    return (
        <div 
            className={style} 
        >{children}
        </div>
    )
}

export default MyLabel
