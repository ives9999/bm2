import React, {useState} from 'react'
import { BiSolidCategory } from "react-icons/bi";
import {Link, useNavigate} from 'react-router-dom';
import { FaCaretDown, FaCaretRight } from "react-icons/fa6";
import { RiFolderAddLine } from "react-icons/ri";

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
        <ul className='grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-4'>
            {cats.map((cat, idx) => (
                <li key={cat.token} className=''>
                    <div className='flex flex-row items-center justify-center border border-gray-400 rounded-xl px-3 py-1 text-gray-400 cursor-pointer hover:bg-MyWhite hover:text-MyBlack hover:font-black'>
                        {cat.children.length > 0 ?
                            <RiFolderAddLine className='h-4 w-4 mr-1' />
                          : ''
                        }
                        <div className={`flex flex-row items-center ${cat.active ? 'text-MyWhite' : 'text-gray-400 hover:text-rabbit-300'}`} onClick={() => toCat(cat, idx)}>
                            {cat.name}
                            {/*{cat.children.length > 0*/}
                            {/*    ? (isOpens[idx])*/}
                            {/*        ? <FaCaretRight className='text-rabbit-400 ml-2' />*/}
                            {/*        : <FaCaretDown className='text-rabbit-400 ml-2' />*/}
                            {/*    : ''*/}
                            {/*}*/}
                        </div>
                    </div>
                    {/*{cat.children.length > 0*/}
                    {/*    ?<ul className={`${isOpens[idx] ? 'block ml-8' : 'hidden'}`} >*/}
                    {/*        {cat.children.map(children => (*/}
                    {/*            <li key={children.token} className={`mb-2 flex flex-row items-center`}>*/}
                    {/*                <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4'/>*/}
                    {/*                <div*/}
                    {/*                    className={`flex flex-row items-center cursor-pointer ${children.active ? 'text-Primary-300' : 'text-rabbit-400 hover:text-rabbit-300'}`}*/}
                    {/*                    onClick={() => toCat(children, idx)}>{children.name}*/}
                    {/*                </div>*/}
                    {/*            </li>*/}
                    {/*            ))}*/}
                    {/*    </ul>*/}
                    {/*    : ''*/}
                    {/*}*/}
                </li>
            ))}
            {/*<li key='all' className='mb-2 flex flex-row items-center'>*/}
            {/*    <BiSolidCategory className='h-4 w-4 text-Primary-800 mr-1' />*/}
            {/*    <Link to={'/' + able + '?page=1&perpage='+perpage} className='text-rabbit-400 hover:text-rabbit-300'>全部</Link>*/}
            {/*</li>*/}
        </ul>
    </div>
    )
    }
}

export default ProductCats
