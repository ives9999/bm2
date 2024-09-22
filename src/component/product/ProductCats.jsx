import React, {useState} from 'react'
import { BiSolidCategory } from "react-icons/bi";
import {Link, useNavigate} from 'react-router-dom';
import { FaCaretDown, FaCaretRight } from "react-icons/fa6";

function ProductCats({
    able,
    cats,
    perpage,
}) {
    //console.info(cats);
    const initOpens = cats.map(cat => {
        return cat.active;
    });
    const [isOpens, setIsOpens] = useState(initOpens);
    const navigator = useNavigate();
    const toCat = (cat, idx) => {
        if ('children' in cat && cat.children.length > 0) {
            setIsOpens(prev => {
                return prev.map(((item, idx1) => (idx === idx1) ? !item : item));
            })
        } else {
            navigator('/' + able + '?page=1&perpage=' + perpage + '&cat=' + cat.token);
        }
    }
    if (!cats) return <div></div>
    else {
    return (
    <div className="p-4 my-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="mb-4 text-2xl font-bold text-rabbit-50 uppercase">分類</h4>
        <ul className=''>
            {cats.map((cat, idx) => (
                <li key={cat.token} className='mb-2'>
                    <div className='mb-2 flex flex-row items-center'>
                        <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4' />
                        <div className={`flex flex-row items-center cursor-pointer ${cat.active ? 'text-Primary-300' : 'text-rabbit-400 hover:text-rabbit-300'}`} onClick={() => toCat(cat, idx)}>
                            {cat.name}
                            {cat.children.length > 0
                                ? (isOpens[idx])
                                    ? <FaCaretRight className='text-rabbit-400 ml-2' />
                                    : <FaCaretDown className='text-rabbit-400 ml-2' />
                                : ''
                            }
                        </div>
                    </div>
                    {cat.children.length > 0
                        ?<ul className={`${isOpens[idx] ? 'block ml-8' : 'hidden'}`} >
                            {cat.children.map(children => (
                                <li key={children.token} className={`mb-2 flex flex-row items-center`}>
                                    <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4'/>
                                    <div
                                        className={`flex flex-row items-center cursor-pointer ${children.active ? 'text-Primary-300' : 'text-rabbit-400 hover:text-rabbit-300'}`}
                                        onClick={() => toCat(children, idx)}>{children.name}
                                    </div>
                                </li>
                                ))}
                        </ul>
                        : ''
                    }
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
