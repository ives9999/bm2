import React, {useState} from 'react'
import { BiSolidCategory } from "react-icons/bi";
import {Link, useNavigate} from 'react-router-dom';
import { FaCaretDown, FaCaretRight } from "react-icons/fa6";
import { RiFolderAddLine } from "react-icons/ri";

function ProductCats({
    able,
    cats,
    perpage,
    isCatsOpen,
    setIsCatsOpen
}) {
    //console.info(isCatsOpen);
    //console.info(cats);
    // const initOpens = cats.map(cat => {
    //     return cat.active;
    // });
    // //console.info(initOpens);
    // const [isOpens, setIsOpens] = useState(initOpens);
    const navigator = useNavigate();

    const toCat = (idx) => {
        //navigator('/' + able + '?page=1&perpage=' + perpage + '&cat=' + cat.token);
        const cat = cats[idx];
        //console.info(cat);
        if ('children' in cat && cat.children.length > 0) {
            setIsCatsOpen(prev => {
                //const a = prev.map((item, idx1) => false);
                return prev.map(((item, idx1) => (idx === idx1) ? !item : item));
            })
        } else {
            navigator('/' + able + '?page=1&perpage=' + perpage + '&cat=' + cat.token);
        }
    }
    if (!cats) return <div className='text-MyWhite'>loading</div>
    else {
    return (
    <div className="p-4 my-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <ul className='grid grid-cols-3 md:grid-cols-8 lg:grid-cols-8 gap-4'>
            {cats.map((cat, idx) => (
                <li key={cat.token} className=''>
                    <div className={`flex flex-row items-center justify-center border rounded-xl px-3 py-1 text-gray-400 cursor-pointer hover:bg-MyWhite hover:text-MyBlack hover:font-black ${cat.active ? 'border-Primary-300' : 'border-gray-400'}`} onClick={() => toCat(idx)}>
                        <div className={`flex flex-row items-center`}>
                            {cat.name}
                            {cat.children.length > 0
                                ? (isCatsOpen[idx])
                                    ? <FaCaretRight className='text-rabbit-400 ml-2' />
                                    : <FaCaretDown className='text-rabbit-400 ml-2' />
                                : ''
                            }
                        </div>
                    </div>
                    {cat.children.length > 0
                        ?<ul className={`bg-gray-600 rounded-md mt-1 ${isCatsOpen[idx] ? 'block ml-8' : 'hidden'}`} >
                            {cat.children.map(children => (
                                <li key={children.token} className={`mb-2 px-2 py-2 flex flex-row items-center hover:bg-gray-500 hover:text-MyWhite`}>
                                    {/*<BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4'/>*/}
                                    <div
                                        className={`flex flex-row items-center cursor-pointer ${children.active ? 'text-Primary-300' : 'text-rabbit-400 hover:text-MyWhite'}`}
                                        onClick={() => toCat(children, idx)}>{children.name}
                                    </div>
                                </li>
                                ))}
                        </ul>
                        : ''
                    }
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
