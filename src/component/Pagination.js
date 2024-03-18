import { FaGreaterThan, FaLessThan, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import {Link} from 'react-router-dom';

export function Pagination({
    meta,
    token=null,
}){
    const makeLink = (page) => {
        return token === null ? `?page=${page}&perpage=${meta.perPage}` : `?page=${page}&perpage=${meta.perPage}&token=${token}`
    }

    return (
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 hover:gray-600 px-4 py-5 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {meta.currentPage === 1 ?
                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">上一頁</span>
                    :<Link
                    to={makeLink(meta.next)}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
                    >
                    上一頁
                    </Link>
                }
                {meta.currentPage === meta.totalPage ?
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50">下一頁</span>
                    :<Link
                    to={makeLink(meta.prev)}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50"
                    >
                    下一頁
                    </Link>
                }
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                <p className="text-sm text-MyWhite">
                    顯示 <span className="font-medium">{meta.startNum}</span> 到 <span className="font-medium">{meta.endNum}</span> 的筆數{' '}
                    <span className="font-medium">共 {meta.totalCount}</span> 筆資料
                </p>
                </div>
                <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {(meta.currentPage === 1) ?
                        <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"><FaAnglesLeft className="h-5 w-5" aria-hidden="true" /></span>
                    :<Link
                        to={makeLink(1)}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 bg-gray-700 text-gray-400 hover:bg-gray-600 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">第一頁</span>
                        <FaAnglesLeft className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    }
                    {(meta.currentPage === 1) ?
                        <span className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"><FaLessThan className="h-5 w-5" aria-hidden="true" /></span>
                    :<Link
                        to={makeLink(meta.prev)}
                        className="relative inline-flex items-center px-2 py-2 bg-gray-700 text-gray-400 hover:bg-gray-600 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">上一頁</span>
                        <FaLessThan className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    }

                    {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                    {meta.pageNum && meta.pageNum.map(item => (
                        <div key={item.idx}>
                        {(item.idx > 0) ?
                        item.idx === meta.currentPage ? <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-Primary-400 text-MyBlack">{item.idx}</span>
                        : <Link
                            key={item.idx + 10000}
                            to={makeLink(item.idx)}
                            aria-current="page"
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${item.active ? "bg-Primary-400 text-MyBlack" : "text-gray-400 hover:bg-gray-500"}`}
                        >
                            {item.idx}
                        </Link>
                        : <span key={item.idx + 10000} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                        }</div>
                    ))}

                    {(meta.currentPage === meta.totalPage) ?
                        <span className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"><FaGreaterThan className="h-5 w-5" aria-hidden="true" /></span>
                        :<Link
                        to={makeLink(meta.next)}
                        className="relative inline-flex items-center px-2 py-2 hover:bg-gray-600 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                        >
                        <span className="sr-only">下一頁</span>
                        <FaGreaterThan className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    }
                    {(meta.currentPage === meta.totalPage) ?
                        <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"><FaAnglesRight className="h-5 w-5" aria-hidden="true" /></span>
                        :<Link
                        to={makeLink(meta.totalPage)}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 hover:bg-gray-600 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                        >
                        <span className="sr-only">最後一頁</span>
                        <FaAnglesRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    }
                </nav>
                </div>
            </div>
        </div>
    );
}

export function getPageParams(meta) {
    const startNum = (meta.currentPage-1)*meta.perPage + 1
    const endNum = (meta.currentPage-1)*meta.perPage + meta.perPage

    var pageNum = [];
    if (meta.totalPage > 6) {
        const navCount = 3
        for (let i = 0; i < navCount; i++) {
            const active = (i === meta.currentPage + i) ? true : false
            const page = {idx: meta.currentPage + i, active: active}
            pageNum.push(page)
        }
        pageNum.push({idx: "...", active: false})
        for (let i = 0; i < navCount; i++) {
            const active = (meta.totalPage-navCount+i+1 === meta.currentPage) ? true : false
            const page = {idx: meta.totalPage-navCount+i+1, active: active}
            pageNum.push(page)
        }
    } else {
        const navCount = meta.totalPage
        for (let i = 0; i < navCount; i++) {
            const active = (i === meta.currentPage + i) ? true : false
            const page = {idx: i + 1, active: active}
            pageNum.push(page)
        }
    }

    return {startNum: startNum, endNum: endNum, pageNum: pageNum, prev: meta.currentPage-1, next: meta.currentPage+1}
}