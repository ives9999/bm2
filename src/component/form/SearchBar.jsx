import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import React, {useEffect, useRef, useState} from "react";
import {Featured} from "../image/Images";
import {formattedWithSeparator} from "../../functions/math";

// const [arenas, setArenas] = useState({
//     isShowArenasList: false,
//     list: [],
// })

function SearchBar({
    label=null,               // 搜尋的標題列
    value,              // input value
    placeholder,        // input placeholder
    getReadAPI,         // 取得server資料
    setSelected,          // 選擇列表值時要設定的函式，把選擇的列傳回去
    isRequired=false,   // 是否為必填
    errorMsg,           // 錯誤訊息
    isHidden=false,     // 是否隱藏
    ResultRow,          // 搜尋結果列的樣式，html
    className='',
    containerWidth='w-full',
    itemWidth='w-full',
    contentHeight='h-[300px]'
}) {
    //console.info(value);
    // 設定focus使用
    const [keyword, setKeyword] = useState('');
    const keywordRef = useRef();

    const scrollRef = useRef();
    const currentPageRef = useRef(1);
    const isFetching = useRef(false);
    //console.info('keyword:'+keyword);

    const initPage = {
        meta: {
            totalCount: 0,
            totalPage: 0,
            currentPage: 0,
            offset: 0,
            perPage: process.env.REACT_APP_PERPAGE,
        },
        rows: [],
        isShow: false,
    }
    const [page, setPage] = useState(initPage);

    useEffect(() => {
        setKeyword(value);
    }, []);

    const getList = async (k, currentPage) => {
        //setIsLoading(true);
        const data = await getReadAPI(k, currentPage, page.meta.perPage);

        setPage(prev => {
            return {...prev, rows: prev.rows.concat(data.data.rows), meta: data.data.meta, isShow: true}
        });
        isFetching.current = false;
    }

    // 當搜尋框關鍵字變更時，就會啟動此函式
    const handleChange = async (e) => {
        const k = e.target.value;
        setKeyword(k);

        setPage(initPage);

        if (k.length > 0) {
            await getList(k, currentPageRef.current);
        }
    }

    const onClear = () => {
        setKeyword('');
        setPage(initPage);
        isFetching.current = false;
        currentPageRef.current = 1;
        keywordRef.current.focus();
    }

    const onSelected = (idx) => {
        const row = page.rows[idx];
        setSelected(row);
        setKeyword(row.nickname);
        setPage(prev => {
            return {...prev, isShow: false};
        });
    }

    const handleScroll = async () => {
        if (scrollRef.current && keyword.length > 0) {
            const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
            // console.info("scroll:" + (scrollTop + clientHeight));
            // console.info("contentHeight:" + scrollHeight);
            if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching.current) {
                isFetching.current = true;
                if (currentPageRef.current < page.meta.totalPage) {
                    await getList(keyword, currentPageRef.current + 1);
                    currentPageRef.current++;
                }
            }
        }
    }

    const toggleList = () => {
        setPage(prev => {
            return {...prev, isShow: !prev.isShow}
        });
    }

	const isError = (!(errorMsg === undefined || errorMsg === ''));

    return (
        <div className={`relative ${containerWidth}`}>
            {label !== undefined && label !== null && label.length > 0 &&
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`}>
                    *必填
                </span>
            </div>
            }
            <div className="">
                <div className={`
                     rounded-lg shadow-sm flex flex-row items-center border border-gray-500 bg-PrimaryBlock-900
                     ${!isError ? "focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600" : "text-Warning-400 border-Warning-400"}
                `}>
                    <MagnifyingGlassIcon className='items-center text-MyWhite w-5 h-5 cursor-pointer ml-2' onClick={toggleList} />
                    <input
                        ref={keywordRef}
                        className={`
                            w-full text-sm border-0 focus:border-0 focus:ring-0 text-MyWhite placeholder:text-gray-400 autofill:transition-colors autofill:duration-[5000000ms] bg-PrimaryBlock-900
                            ${className ? className : ''}
                        `}
                
                        // className='w-full pl-10 border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms] focus:ring-Primary-300 focus:border-Primary-300 border-gray-600'
                        placeholder={placeholder || '請輸入關鍵字...'}
                        id='filter'
                        name='filter'
                        value={keyword}
                        onChange={handleChange}
                    />
                    <div className="pr-1">
                        <span className="cursor-pointer" onClick={onClear}>
                            <XMarkIcon className="h-5 w-5 text-MyWhite" aria-hidden="true" />
                        </span>
                        <ExclamationCircleIcon className={`h-5 w-5 text-Warning-400 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
            </div>
            <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`}>
                {errorMsg}
            </p>
            <div ref={scrollRef} className={`absolute left-0 z-50 dark:bg-gray-700 border border-gray-500 overflow-y-auto w-full rounded-lg shadow mt-1 ${contentHeight} ${itemWidth} ${page.isShow ? 'block' : 'hidden'}`} onScroll={handleScroll}>
                <div className='text-xs my-3 ml-2 text-gray-400'>
                    <p>查看「<span className='text-gray-300'>{keyword}</span>」的結果</p>
                    <div>搜尋結果共「<span className='text-gray-300'>{formattedWithSeparator(page.meta.totalCount)}</span>」筆
                    </div>
                </div>
                <ul className='text-base text-gray-700 dark:text-gray-200 list-none'>
                    {page.rows.length > 0 && page.rows.map((row, idx) => (
                        <li key={row.token} onClick={() => onSelected(idx)} className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                            <ResultRow row={row} idx={idx} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SearchBar
