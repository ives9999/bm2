import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import {Link} from 'react-router-dom';
import { HiDotsHorizontal } from "react-icons/hi";

export function Pagination({
    setPage,
    meta,
    params = {},
}){
    //console.info("params: " + JSON.stringify(params));
    const startNum = (meta.currentPage - 1) * meta.perPage + 1;
    const endNum = startNum + meta.perPage - 1;

    let pages = [];
    // 如果總頁數少於7頁，則直接顯示1-7
    if (meta.totalPage < 7) {
        for (let i = 1; i <= meta.totalPage; i++) {
            const active = (i === meta.currentPage) ? true : false;
            pages.push({key: i, value: i, active: active});
        }
    // 如果總頁數大於7頁，則必須做完整的分頁處理
    } else {
        // 如果目前在前兩頁，則顯示前三頁與後三頁
        if (meta.currentPage < 3) {
            // 前三頁
            for (let i = 1; i <= 3; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            // ...
            pages.push({key: -2, value: -1, active: false});
            // 後三頁
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        // 如果目前在第三頁到第7頁間，則顯示1-7頁，在前八頁時，不會顯示出中間三頁的部分
        } else if (meta.currentPage >= 3 && meta.currentPage < 8) {
            for (let i = 1; i <= 8; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        // 如果在第八頁到最後前8頁間，則有顯示中間的部分
        } else if (meta.currentPage >= 8 && meta.currentPage <= meta.totalPage - 7) {
            // 前三頁
            for (let i = 1; i <= 3; i++) {
                pages.push({key: i, value: i, active: false});
            }
            pages.push({key: -2, value: -1, active: false});
            // 中間三頁
            for (let i = meta.currentPage - 1; i <= meta.currentPage + 2; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
            pages.push({key: -3, value: -1, active: false});
            // 後三頁
            for (let i = meta.totalPage - 2; i <= meta.totalPage; i++) {
                pages.push({key: i, value: i, active: false});
            }
        // 如果目前在最後三頁到最後六頁間，則顯示最後的1-7頁，在後八頁時，不會顯示出中間三頁的部分
        } else if (meta.currentPage > meta.totalPage - 7 && meta.currentPage <= meta.totalPage - 2) {
            for (let i = 1; i <= 3; i++) {
                pages.push({key: i, value: i, active: false});
            }
            pages.push({key: -2, value: -1, active: false});
            for (let i = meta.totalPage - 7; i <= meta.totalPage; i++) {
                const active = (i === meta.currentPage) ? true : false;
                pages.push({key: i, value: i, active: active});
            }
        // 如果目前在後兩頁，則顯示前三頁與後三頁
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

    return (
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 hover:gray-600 px-4 py-5 sm:px-6 text-gray-400">
            <div className="flex flex-1 justify-between sm:hidden">
                <div>
                    <Prev page={meta.currentPage} perpage={meta.perPage} setPage={setPage} params={params} />
                </div>
                
                <div>
                    <Next page={meta.currentPage} perpage={meta.perPage} totalPage={meta.totalPage} setPage={setPage} params={params} />
                </div>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <ShowCountData startNum={startNum} endNum={endNum} totalCount={meta.totalCount} />
                </div>
                <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Prev page={meta.currentPage} perpage={meta.perPage} setPage={setPage} params={params} />
                    {pages.map(item => (
                        (item.active)
                            ?<FocusStyle key={item.key} page={item.value} />
                            :<LinkStyle key={item.key} page={item.value} perpage={meta.perPage} setPage={setPage} params={params} />
                    ))}
                    <Next page={meta.currentPage} perpage={meta.perPage} totalPage={meta.totalPage} setPage={setPage} params={params} />
                </nav>
                </div>
            </div>
        </div>
    );
}

function baseClass() {
    return "p-4 inline-flex items-center justify-center ring-1 ring-inset ring-gray-300 focus:outline-offset-0";
}

function LinkStyle({
    page,
    perpage,
    setPage,
    params
}) {
    const handleClick = () => {
        setPage(page);
    }
    return (
        <div>
        {page > 0 ?
            <Link to={makeLink(page, perpage, params)} onClick={handleClick}
                  className={`${baseClass()} ${page > 0 ? 'hover:bg-gray-600 cursor-pointer' : ''}`}>{page}</Link>
            : <span className={baseClass()}><HiDotsHorizontal className="h-6 w-6"/></span>
        }
        </div>
    )
}

function FocusStyle({
    page,
}) {
    return (
        <span className={`${baseClass()} text-MyBlack bg-Primary-400`}>
            {page}
        </span>
    )
}

function Prev({
    page,
    perpage,
    setPage,
    params
}) {
    const handleClick = () => {
        setPage(page-1);
    }
    return (
        <>
        {(page === 1) ?
            <div className={`${baseClass()}`}>
                <FaLessThan className="h-5 w-5" aria-hidden="true" />
            </div>
        :<Link
            to={makeLink(page-1, perpage, params)}
            onClick={handleClick}
            className={`${baseClass()} hover:bg-gray-600 cursor-pointer`}
        >
            <div className="sr-only">上一頁</div>
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
    params
}) {
    //console.info(JSON.stringify(params));
    const handleClick = () => {
        setPage(page+1);
    }

    return (
        <>
        {(page === totalPage) ?
            <div className={`${baseClass()}`}>
                <FaGreaterThan className="h-5 w-5" aria-hidden="true" />
            </div>
            :<Link
                to={makeLink(page + 1, perpage, params)}
                onClick={handleClick}
                className={`${baseClass()} + hover:bg-gray-600 cursor-pointer`}
            >
                <div className="sr-only">下一頁</div>
                <FaGreaterThan className="h-4 w-4" aria-hidden="true" />
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

const makeLink = (page, perpage, params) => {
    var queryString = `?page=${page}&perpage=${perpage}`;
    Object.keys(params).forEach(key => queryString += `&${key}=${params[key]}`);
    return queryString;
}
