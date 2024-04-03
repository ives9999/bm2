import React from 'react'
import { BiSolidCategory } from "react-icons/bi";
import {Link} from 'react-router-dom';

function ProductCats({
    able,
    cats,
    perpage,
}) {
    if (!cats) return <div></div>
    else {
    return (
    <div className="p-4 my-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="mb-4 text-2xl font-bold text-rabbit-50 uppercase">分類</h4>
        <ul className=''>
            {cats.map((cat) => (
                <li key={cat.name} className='mb-2 flex items-center'>
                    <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4' />
                    <Link to={'/' + able + '?page=1&perpage='+perpage+'&cat='+cat.token} className='text-rabbit-400 hover:text-rabbit-300'>{cat.name}</Link>
                </li>
            ))}
            <li key='all' className='mb-2 flex items-center'>
                <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4' />
                <Link to={'/' + able + '?page=1&perpage='+perpage} className='text-rabbit-400 hover:text-rabbit-300'>全部</Link>
            </li>
        </ul>
    </div>
    )
    }
}

export default ProductCats
