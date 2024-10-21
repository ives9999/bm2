import React from 'react'
import { Featured } from './image/Images'

const InfiniteList = ({children}) => {
    return (
        <div>

        </div>
        // <div ref={scrollRef} className='h-[200px] overflow-y-auto mt-4' onScroll={handleScroll}>
        //     <ul className='text-base text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow'>
        //         {page.rows.length > 0 && page.rows.map((row, idx) => (
        //             <li key={row.token} onClick={() => setResult(idx)}
        //                 className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
        //                 <p>{idx + 1}.</p>
        //                 <Featured row={row} className='w-12' />
        //                 {row.name}
        //             </li>
        //         ))}
        //     </ul>
        // </div>
    )
}

export default InfiniteList