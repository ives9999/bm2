import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import {Link} from 'react-router-dom';

export function Pagination({
    setPage,
    meta,
}){
    // console.info(meta);
    const startNum = (meta.currentPage - 1) * meta.perPage;
    const endNum = startNum + meta.perPage;
    let pages = [];
    for (let i = 1; i <= meta.totalCount; i++) {
        pages.push(i);
    }

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

    const handleClick = (page) => {
        setPage(page);
    }

    return (
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 hover:gray-600 px-4 py-5 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {meta.currentPage === 1 ?
                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">上一頁</span>
                    :<Link
                    to={makeLink(meta.currentPage-1, meta.perPage)}
                    onClick={() => handleClick(meta.currentPage-1)}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
                    >
                    上一頁
                    </Link>
                }
                {meta.currentPage === meta.totalPage ?
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50">下一頁</span>
                    :<Link
                    to={makeLink(meta.currentPage+1)}
                    onClick={() => handleClick(meta.currentPage+1, meta.perPage)}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50"
                    >
                    下一頁
                    </Link>
                }
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <ShowCountData startNum={startNum} endNum={endNum} totalCount={meta.totalCount} />
                </div>
                <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Prev page={meta.currentPage} perpage={meta.perPage} setPage={setPage} />

                    {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                    {pages.map(idx => (
                        <p>{idx}<br /></p>
                    ))}
                    {/* {pageNum && pageNum.map(item => (
                        <div key={item.idx}>
                        {(item.idx > 0) ?
                        item.idx === meta.currentPage ? <FocusStyle>{item.idx}</FocusStyle>
                        : 
                        <LinkStyle page={item.idx} perpage={meta.perPage} setPage={setPage}>{item.idx}</LinkStyle>
                        : <span key={item.idx + 10000} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                        }</div>
                    ))} */}

                    <Next page={meta.currentPage} perpage={meta.perPage} totalPage={meta.totalPage} setPage={setPage} />
                </nav>
                </div>
            </div>
        </div>
    );
}

function LinkStyle({
    children,
    page,
    perpage,
    setPage,
}) {
    const handleClick = () => {
        setPage(page);
    }
    return (
        <Link 
            to={`?page=${page}&perpage=${perpage}`} 
            onClick={handleClick} 
            className="relative inline-flex items-center justify-center px-2 py-2 w-9 hover:bg-gray-600 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
            {children}
        </Link>
    )
}

function FocusStyle({
    children,
}) {

    return (
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-Primary-400 text-MyBlack">
            {children}
        </span>
    )
}

function Prev({
    page,
    perpage,
    setPage,
}) {
    const handleClick = () => {
        setPage(page-1);
    }
    return (
        <>
        {(page === 1) ?
            <span className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-l-md"><FaLessThan className="h-5 w-5" aria-hidden="true" /></span>
        :<Link
            to={makeLink(page-1, perpage)}
            onClick={handleClick}
            className="relative inline-flex items-center px-2 py-2 bg-gray-700 text-gray-400 hover:bg-gray-600 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-l-md"
        >
            <span className="sr-only">上一頁</span>
            <FaLessThan className="h-5 w-5" aria-hidden="true" />
        </Link>
        }
        </>
    )
}

function Next({
    page,
    perpage,
    setPage,
    totalPage,
}) {
    const handleClick = () => {
        setPage(page+1);
    }

    return (
        <>
        {(page === totalPage) ?
            <span className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"><FaGreaterThan className="h-5 w-5" aria-hidden="true" /></span>
            :<Link
            to={makeLink(page + 1, perpage)}
            onClick={handleClick}
            className="relative inline-flex items-center px-2 py-2 hover:bg-gray-600 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-r-md"
            >
            <span className="sr-only">下一頁</span>
            <FaGreaterThan className="h-5 w-5" aria-hidden="true" />
            </Link>
        }
        </>
    )
}

function ShowCountData({
    startNum,
    endNum,
    totalCount,
}) {
    return (
        <p className="text-sm text-MyWhite">
            顯示 <span className="font-medium">{startNum}</span> 到 <span className="font-medium">{endNum}</span> 的筆數{' '}
            <span className="font-medium">共 {totalCount}</span> 筆資料
        </p>
    )
}

const makeLink = (page, perpage) => {
    return `?page=${page}&perpage=${perpage}`
}
