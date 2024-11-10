import React, { useEffect, useRef, useState } from 'react'
import InputIcon from './form/InputIcon'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useLocation, useSearchParams } from 'react-router-dom'
import useQueryParams from '../hooks/useQueryParams'
import { getReadAPI } from '../context/product/ProductAction'

const ProductFilter = ({
    //value,
    //onChange,
    //onClear,
                       }) => {
    const location = useLocation();
    let url = location.pathname;

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

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);


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

        setRows([]);
        setMeta({});
    }

    const filter = async (page, perpage, params) => {
        let char = (url.indexOf('?') !== -1) ? "&" : "?";
        url += char + 'page=' + page;
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        });
        //navigate(url);

        const data = await getReadAPI(page, perpage, params);
        console.info(data);
        if (data.status === 200) {
            //console.info(data.data.data);
            const rows = data.data.rows;
            setRows(prev => {
                return [...prev, ...rows];
            })

            var meta = data.data.meta
            //const pageParams = getPageParams(meta)
            //meta = {...meta, ...pageParams}
            setMeta(meta);
        }
        //setIsGetComplete(true);
    }

    const toNext = async () => {
        page++;
        const params = {k: keyword};
        await filter(page, perpage, params);
    }

    const focusFilter = () => {
        setTimeout(() => {
            if (keywordRef) {
                keywordRef.current.focus();
            }
        }, 100);
    }

    useEffect(() => {
        console.info('bbb');
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