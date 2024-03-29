import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import {Link} from 'react-router-dom';
import { HiDotsHorizontal } from "react-icons/hi";

export function Pagination({
    setPage,
    meta,
}){
    // console.info(meta);
    const startNum = (meta.currentPage - 1) * meta.perPage + 1;
    const endNum = startNum + meta.perPage - 1;

    let pages = [];
    if (meta.totalPage < 7) {
        for (let i = 1; i <= meta.totalPage; i++) {
            const active = (i === meta.currentPage) ? true : false;
            pages.push({key: i, value: i, active: active});
        }
    } else {
        if (meta.currentPage < 3) {
            for (let i = 1; i < 3; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            pages.push({key: 3, value: 3, active: false});
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        } else if (meta.currentPage >= 3 && meta.currentPage < 8) {
            for (let i = 1; i < 8; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            pages.push({key: 8, value: 8, active: false});
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        } else if (meta.currentPage >= 8 && meta.currentPage <= meta.totalPage - 7) {
            for (let i = 1; i <= 3; i++) {
                pages.push({key: i, value: i, active: false});
            }
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.currentPage - 1; i <= meta.currentPage + 2; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            pages.push({key: -3, value: -1, active: false});
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        } else if (meta.currentPage > meta.totalPage - 7 && meta.currentPage <= meta.totalPage - 2) {
            for (let i = 1; i <= 3; i++) {
                pages.push({key: i, value: i, active: false});
            }
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 7; i <= meta.totalPage; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
        } else if (meta.currentPage > meta.totalPage - 3) {
            for (let i = 1; i <= 3; i++) {
                pages.push({key: i, value: i, active: false});
            }
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
        } else {
            
        }
    }
    // console.info(pages);

    // const handleClick = (page) => {
    //     setPage(page);
    // }

    return (
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 hover:gray-600 px-4 py-5 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <div>
                    <Prev page={meta.currentPage} perpage={meta.perPage} setPage={setPage} />
                </div>
                
                <div>
                    <Next page={meta.currentPage} perpage={meta.perPage} totalPage={meta.totalPage} setPage={setPage} />
                </div>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <ShowCountData startNum={startNum} endNum={endNum} totalCount={meta.totalCount} />
                </div>
                <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <div>
                        <Prev page={meta.currentPage} perpage={meta.perPage} setPage={setPage} />
                    </div>

                    {pages.map(item => (
                        <div key={item.key}>
                        {(item.active)
                            ?<FocusStyle page={item.value} />
                            :<LinkStyle page={item.value} perpage={meta.perPage} setPage={setPage} />
                        }
                        </div>
                    ))}
                    <div>
                        <Next page={meta.currentPage} perpage={meta.perPage} totalPage={meta.totalPage} setPage={setPage} />
                    </div>
                </nav>
                </div>
            </div>
        </div>
    );
}

function baseClass() {
    return "h-9 w-9 px-8 py-4 inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0";
}

function formalClass() {
    return baseClass()+" text-gray-400 hover:bg-gray-600"
}

function focusClass() {
    return baseClass() + " text-MyBlack bg-Primary-400";
}

function LinkStyle({
    page,
    perpage,
    setPage,
}) {
    const handleClick = () => {
        setPage(page);
    }
    return (
        <>
        {page > 0
            ?<Link 
                to={`?page=${page}&perpage=${perpage}`} 
                onClick={handleClick} 
                className={formalClass()}>
                {page}
            </Link>
            :<span 
                className={`h9 w9 px-8 py-4 py-[11px] inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}>
                <HiDotsHorizontal className="text-gray-400" />
            </span>
        }
        </>
    )
}

function FocusStyle({
    page,
}) {
    return (
        <span className={focusClass()}>
            {page}
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
            <span className={`h9 w9 px-8 py-4 py-[8px] rounded-l-md inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0 text-gray-400`}>
                <FaLessThan className="h-5 w-5" aria-hidden="true" />
            </span>
        :<Link
            to={makeLink(page-1, perpage)}
            onClick={handleClick}
            // className={formalClass()+' py-[10px]'}
            className={`h9 w9 px-8 py-4 py-[10px] rounded-l-md inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0 text-gray-400 hover:bg-gray-600`}
        >
            <span className="sr-only">上一頁</span>
            <FaLessThan className="h-4 w-4" aria-hidden="true" />
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
            <span className={`h9 w9 px-8 py-4 py-[8px] rounded-r-md inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0 text-gray-400`}>
                <FaGreaterThan className="h-5 w-5" aria-hidden="true" />
            </span>
            :<Link
                to={makeLink(page + 1, perpage)}
                onClick={handleClick}
                className={`h9 w9 px-8 py-4 py-[10px] rounded-r-md inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0 text-gray-400 hover:bg-gray-600`}
            >
                <span className="sr-only">下一頁</span>
                <FaGreaterThan className="h-4 w-4" aria-hidden="true" />
            </Link>
        }
        </>
    )
}

function PrevMobile({
    page,
    perpage,
    setPage,
    totalPage,
}) {

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
