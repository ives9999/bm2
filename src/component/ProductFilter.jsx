import React, { useEffect, useRef, useState } from 'react'
import InputIcon from './form/InputIcon'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import useQueryParams from '../hooks/useQueryParams'
import { getReadAPI } from '../context/product/ProductAction'
import {ProductHomeGrid} from "./Grid";
import {PrimaryOutlineButton} from "./MyButton";

const ProductFilter = ({
    res,
                       }) => {
    const location = useLocation();
    const navigate = useNavigate();

    var {page, perpage} = useQueryParams();
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage

    const keywordRef = useRef(null);

    const [filterParams, setFilterParams] = useSearchParams({
        k: '',
    });
    let keyword = filterParams.get('k');
    if (typeof keyword === 'object') {
        keyword = '';
    }

    const onChange = async (e) => {
        const value = e.target.value;
        //setKeyword(value);
        setFilterParams(prev => {
            prev.set('k', value);
            return prev;
        });
    }

    const onClear = () => {
        setFilterParams(prev => {
            prev.set('k', '');
            // prev.set('page', 1);
            return prev;
        });
    }

    const filter = async (page, perpage, params) => {
        let url = location.pathname;
        let char = (url.indexOf('?') !== -1) ? "&" : "?";
        url += char + 'page=' + page;
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        });
        navigate(url);

        const data = await getReadAPI(page, perpage, params);
        console.info(data);
        if (data.status === 200) {
            //console.info(data.data.data);
            const rows = data.data.rows;
            const meta = data.data.meta
            res(rows, meta, toNext);
        }
    }

    const toNext = async () => {
        page++;
        const params = {k: keyword};
        await filter(page, perpage, params);
    }

    // const focusFilter = () => {
    //     setTimeout(() => {
    //         if (keywordRef) {
    //             keywordRef.current.focus();
    //         }
    //     }, 100);
    // }

    useEffect(() => {
        //console.info('aaa');
        if (keyword.length > 0) {
            const params = {k: keyword};
            filter(page, perpage, params);
        }
    }, [keyword])

    return (
        <section className='my-4'>
            <div className="">
                <div className="flex flex-row">
                    <InputIcon
                        inputRef={keywordRef}
                        name='keyword'
                        value={keyword}
                        placeholder='請輸入商品關鍵字'
                        handleChange={onChange}
                        handleClear={onClear}
                        Icon={MagnifyingGlassIcon}
                        containerWidth='w-full py-1'
                    />
                </div>
            </div>
        </section>
    )
}

export default ProductFilter

export const FilterResultHtml = ({
    rows,
    meta,
    addCart,
    toNext,
                          }) => {

    return (
        <section
            className='w-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 py-4 px-2'>
            <div className=' grid lg:grid-cols-3 gap-4'>
                {rows.map(row => (
                    <ProductHomeGrid
                        key={row.token}
                        product={row}
                        addCart={addCart}
                    />
                ))}
            </div>
            <div className='mt-4 text-center'>
                {meta.totalPage > 1 && meta.currentPage < meta.totalPage ?
                    <PrimaryOutlineButton className='w-[200px]' onClick={toNext}>更多...</PrimaryOutlineButton>
                    : ''
                }
            </div>
        </section>
    )
}