import React, {useContext, useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    PrimaryOutlineButton,
    SecondaryButton,
} from '../MyButton'
import { AutoCompleteModal, BlueModal } from '../Modal'
import {getReadAPI} from "../../context/product/ProductAction";
const ProductSimilar = () => {
    //const {setIsLoading} = useContext(BMContext)
    const [toggleModalShow, setToggleModalShow] = useState(false);
    // const [keyword, setKeyword] = useState('')
    // const keywordRef = useRef();
    // const [similars, setSimilars] = useState([]);
    //
    // const scrollRef = useRef();
    // const currentPageRef = useRef(1);
    // const initPage = {
    //     meta: {
    //         totalCount: 0,
    //         totalPage: 0,
    //         currentPage: 0,
    //         offset: 0,
    //         perPage: process.env.REACT_APP_PERPAGE,
    //     },
    //     rows: [],
    // }
    // const [page, setPage] = useState(initPage);
    // const isFetching = useRef(false);

    const setSelected = (row) => {
        console.info(row);
    }

    // const getList = async (currentPage, params) => {
    //     //setIsLoading(true);
    //     const data = await getReadAPI(currentPage, page.meta.perPage, params);
    //
    //     setPage(prev => {
    //         return {...prev, rows: prev.rows.concat(data.data.rows), meta: data.data.meta}
    //     });
    //     isFetching.current = false;
    // }

    // const handleChange = async (e) => {
    //     if (e.target.id === 'product') {
    //         const k = e.target.value
    //         setKeyword(k);
    //
    //         setPage(initPage);
    //
    //         if (k.length > 0) {
    //             await getList(currentPageRef.current, [{k: k}]);
    //         }
    //     }
    // }
    // const handleScroll = async () => {
    //     if (scrollRef.current && keyword.length > 0) {
    //         const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
    //         // console.info("scroll:" + (scrollTop + clientHeight));
    //         // console.info("contentHeight:" + scrollHeight);
    //         if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching.current) {
    //             isFetching.current = true;
    //             // console.info("isLastList:" + isLastList);
    //             // console.info("prevPage:" + prevPage);
    //             // console.info("currPage:" + currPage);
    //             if (currentPageRef.current < page.meta.totalPage) {
    //                 //console.info("page:" + page.currPage);
    //                 const params = [{k: keyword}];
    //                 await getList(currentPageRef.current + 1, params);
    //                 currentPageRef.current++;
    //             }
    //         }
    //     }
    // }

    // const onClear = () => {
    //     setKeyword('');
    //     setPage(initPage);
    //     isFetching.current = false;
    //     currentPageRef.current = 1;
    // }

    // const getRead = (params) => {
    //     setIsLoading(true);
    //     const data = getReadAPI(1, 20, params);
    //     setIsLoading(false);
    //     return data;
    // }

    const addSimilar = () => {
        setToggleModalShow(true);
    }

    return (
        <>
            <div className="flex">
                <PrimaryOutlineButton
                    type="button"
                    className="ml-auto mr-4 md:mr-0"
                    onClick={addSimilar}
                >
                    新增類似商品
                </PrimaryOutlineButton>
            </div>

            <AutoCompleteModal
                toggleModalShow={toggleModalShow}
                setToggleModalShow={setToggleModalShow}
                title='搜尋商品'
                placeholder='請輸入商品關鍵字'
                setSelected={setSelected}
                getReadAPI={getReadAPI}
            />

            {/*<BlueModal isModalShow={toggleModalShow}>*/}
            {/*    <BlueModal.Header setIsModalShow={setToggleModalShow}>*/}
            {/*        搜尋商品*/}
            {/*    </BlueModal.Header>*/}
            {/*    <BlueModal.Body height='h-[300px]'>*/}
            {/*        <div className={`flex justify-between mb-2`}>*/}
            {/*            <label className="block text-MyWhite font-medium leading-6 ml-1">*/}
            {/*                請輸入商品關鍵字*/}
            {/*            </label>*/}
            {/*        </div>*/}
            {/*        <div className="">*/}
            {/*            <div className='relative rounded-md shadow-sm'>*/}
            {/*                <MagnifyingGlassIcon*/}
            {/*                    className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>*/}
            {/*                <input*/}
            {/*                    autoFocus*/}
            {/*                    ref={keywordRef}*/}
            {/*                    className={`*/}
            {/*                w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] */}
            {/*                focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}*/}
            {/*                    placeholder={'請輸入關鍵字...'}*/}
            {/*                    name='product'*/}
            {/*                    value={keyword}*/}
            {/*                    id='product'*/}
            {/*                    onChange={handleChange}*/}
            {/*                />*/}
            {/*                <div className="absolute inset-y-0 right-0 items-center pr-3 flex">*/}
            {/*                    <span className="cursor-pointer" onClick={() => onClear('product')}>*/}
            {/*                        <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>*/}
            {/*                    </span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div ref={scrollRef} className='h-[200px] overflow-y-auto mt-4' onScroll={handleScroll}>*/}
            {/*            <ul className='text-base text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow'>*/}
            {/*            {page.rows.length > 0 && page.rows.map((row, idx) => (*/}
            {/*                <li key={row.token} onClick={() => setResult(idx)} className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>*/}
            {/*                    <p>{idx+1}.</p>*/}
            {/*                    <Featured row={row} className='w-12' />*/}
            {/*                    {row.name}*/}
            {/*                </li>*/}
            {/*            ))}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </BlueModal.Body>*/}
            {/*    <BlueModal.Footer>*/}
            {/*        <PrimaryButton onClick={() => setToggleModalShow(false)}>*/}
            {/*            關閉*/}
            {/*        </PrimaryButton>*/}
            {/*    </BlueModal.Footer>*/}
            {/*</BlueModal>*/}
        </>
    )
}


export default ProductSimilar



