import {useState} from 'react'
import { IoIosSearch } from "react-icons/io";

function ProductSearch({
    able,
    filter,
}) {
    const [keyword, setKeyword] = useState('');
    const onChange = (e) => {
        setKeyword(e.target.value);
    }
    const onClick = (e) => {
        filter(e, keyword);
    }

    return (
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <IoIosSearch className="w-6 h-6 text-rabbit-50" />
            </div>
            <input type="search" value={keyword} onChange={(e) => onChange(e)} className="w-full p-4 ps-10 order text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-MyWhite focus:border-Primary-300 autofill:transition-colors autofill:duration-[5000000ms]" placeholder="關鍵字" />
            <button type="button" onClick={(e) => onClick(e)} className="text-white absolute end-2.5 bottom-2.5 border border-Primary-300 text-Primary-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-Primary-950 hover:bg-Primary-800 focus:ring-Primary-800">搜尋...</button>
        </div>
    )
}

export default ProductSearch
