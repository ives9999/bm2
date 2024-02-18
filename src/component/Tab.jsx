import React from 'react'
import {Link} from 'react-router-dom';

function Tab({items, to}) {
    const onTo = (e, idx) => {
        e.preventDefault()
        to(idx)
    }

    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                {items.map((item, idx) => (
                    <li key={item.key} className="me-2">
                        <Link to={item.to} onClick={(e) => onTo(e, idx)} className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-Primary-300 hover:border-Primary-300 dark:hover:text-Primary-300 ${item.active ? 'active dark:text-Primary-300 dark:border-Primary-300' : 'dark:hover:text-gray-300'}`}>{item.name}</Link>
                    </li>
                ))}                
            </ul>
        </div>
    )
}

export default Tab
