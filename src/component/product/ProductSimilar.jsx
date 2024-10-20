import React, {useContext, useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    PrimaryOutlineButton,
    SecondaryButton,
} from '../MyButton'
import { BlueModal } from '../Modal'
import SearchBar from '../form/searchbar/SearchBar'
import BMContext from "../../context/BMContext";
import {getReadAPI} from "../../context/product/ProductAction";
import {ExclamationCircleIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {Featured} from "../image/Images";
const ProductSimilar = () => {
    //const {setIsLoading} = useContext(BMContext)
    const [toggleModalShow, setToggleModalShow] = useState(false);
    const [keyword, setKeyword] = useState('')
    const keywordRef = useRef();
    const [similars, setSimilars] = useState([]);

    const scrollRef = useRef();
    const initPage = {
        perPage: process.env.REACT_APP_PERPAGE,
        currPage: 1,
        prevPage: 0,
        productList: [],
        isLastList: false,
    }
    const [page, setPage] = useState(initPage)
    // const [currPage, setCurrPage] = useState(1);
    // const [prevPage, setPrevPage] = useState(0);
    // const [productList, setProductList] = useState([]);
    // const [isLastList, setIsLastList] = useState(false);

    const setResult = (idx) => {
        const product = page.productList[idx];
        console.info(product);
        setSimilars(prev => {
            return [...prev, product];
        })
    }

    const getList = async (page, params) => {
        //setIsLoading(true);
        const data = await getReadAPI(page, 20, params);
        //setIsLoading(false);
        //console.info(data);
        if (data.data._meta.currentPage === data.data._meta.totalPage) {
            setPage(prev => {
                return {...prev, isLastList: true}
            });
            return;
        }
        //setPrevPage(currPage);
        setPage(prev => {
            return {...prev, ...{productList: data.data.rows}};
        });
    }

    const handleChange = async (e) => {
        if (e.target.id === 'product') {
            const k = e.target.value
            setKeyword(k);

            setPage(initPage);
            // const page = 1;
            // setCurrPage(page);
            // setPrevPage(0);
            // setProductList([]);
            // setIsLastList(false);

            if (k.length > 0) {
                await getList(page.currPage, [{k: k}]);
            }
        }
    }
    const handleScroll = async () => {
        if (scrollRef.current && keyword.length > 0) {
            const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
            // console.info("scrollTop:" + scrollTop);
            // console.info("scrollHeight:" + scrollHeight);
            // console.info("clientHeight:" + clientHeight);
            if (scrollTop + clientHeight === scrollHeight) {
                // console.info("isLastList:" + isLastList);
                // console.info("prevPage:" + prevPage);
                // console.info("currPage:" + currPage);
                if (!page.isLastList && page.prevPage !== page.currPage) {
                    //console.info("page:" + page);
                    const params = [{k: keyword}];
                    await getList(page.currPage+1, params);
                    setPage(prev => {
                        return {...prev, currPage: prev.currPage + 1, prevPage: prev.prevPage + 1}
                    });
                }
            }
        }
    }

    const onClear = () => {
        setKeyword('');
        setPage(initPage)
    }

    // const getRead = (params) => {
    //     setIsLoading(true);
    //     const data = getReadAPI(1, 20, params);
    //     setIsLoading(false);
    //     return data;
    // }

    const addSimilar = () => {
        setToggleModalShow(true);
        // console.info(keywordRef.current);
        setTimeout(() => {
            keywordRef.current.focus();
        }, 500);
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

            <BlueModal isModalShow={toggleModalShow}>
                <BlueModal.Header setIsModalShow={setToggleModalShow}>
                    搜尋商品
                </BlueModal.Header>
                <BlueModal.Body height='h-[300px]'>
                    <div className={`flex justify-between mb-2`}>
                        <label className="block text-MyWhite font-medium leading-6 ml-1">
                            請輸入商品關鍵字
                        </label>
                    </div>
                    <div className="">
                        <div className='relative rounded-md shadow-sm'>
                            <MagnifyingGlassIcon
                                className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>
                            <input
                                autoFocus
                                ref={keywordRef}
                                className={`
                            w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] 
                            focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}
                                placeholder={'請輸入關鍵字...'}
                                name='product'
                                value={keyword}
                                id='product'
                                onChange={handleChange}
                            />
                            <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                                <span className="cursor-pointer" onClick={() => onClear('product')}>
                                    <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div ref={scrollRef} className='h-[200px] overflow-y-auto mt-4' onScroll={handleScroll}>
                        <ul className='text-base text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow'>
                        {page.productList.length > 0 && page.productList.map((product, idx) => (
                            <li key={product.token} onClick={() => setResult(idx)} className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                                <Featured row={product} className='w-12' />
                                {product.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                </BlueModal.Body>
                <BlueModal.Footer>
                    <PrimaryButton onClick={() => setToggleModalShow(false)}>
                        關閉
                    </PrimaryButton>
                </BlueModal.Footer>
            </BlueModal>

            {/*{toggleModalShow ? (*/}
            {/*    <BlueModal isModalShow={toggleModalShow}>*/}
            {/*        <BlueModal.Header setIsModalShow={setToggleModalShow}>*/}
            {/*            搜尋商品*/}
            {/*        </BlueModal.Header>*/}
            {/*        <BlueModal.Body>*/}
            {/*            <SearchBar*/}
            {/*                label='搜尋商品'*/}
            {/*                name='product'*/}
            {/*                isShowList={productList.isShowList}*/}
            {/*                list={productList.list}*/}
            {/*                handleChange={handleChange}*/}
            {/*                onClear={onClear}*/}
            {/*                setResult={setResult}*/}
            {/*            />*/}
            {/*        </BlueModal.Body>*/}
            {/*        <BlueModal.Footer>*/}
            {/*            <PrimaryButton onClick={() => setToggleModalShow(false)}>*/}
            {/*                關閉*/}
            {/*            </PrimaryButton>*/}
            {/*        </BlueModal.Footer>*/}
            {/*    </BlueModal>*/}
            {/*) : (*/}
            {/*    ''*/}
            {/*)}*/}
        </>
    )
}


export default ProductSimilar



