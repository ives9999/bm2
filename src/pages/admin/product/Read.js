import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../component/Breadcrumb'
import StatusForTable from '../../../component/StatusForTable'
import {PrimaryButton, DeleteButton, EditButton} from '../../../component/MyButton'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import {formattedWithSeparator} from '../../../functions/math'
import {BsThreeDots} from "react-icons/bs";
import {CSS} from "@dnd-kit/utilities";
import {TableRowSort} from "../../../component/TableRowSort";
import {arrayMove} from "@dnd-kit/sortable";
import FilterRead from '../../../component/FilterRead'
import {getReadAPI, deleteOneAPI, postUpdateSortOrderAPI} from '../../../context/Action'
import {ImSpinner6} from "react-icons/im";
import { Featured } from '../../../component/image/Images'

function ReadProduct() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const {accessToken} = auth;
    const [isGetComplete, setIsGetComplete] = useState(false);

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        rows: [],
        meta: {},
    });
    const [cats, setCats] = useState([]);

    var {page, perpage, k, cat} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage;
    const [keyword, setKeyword] = useState(k);

    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    const location = useLocation();
    let baseUrl = location.pathname;// /admin/order
    let initParams = {
        backend: true,
    };
    initParams = (k && k.length > 0) ? {...initParams, k: k} : initParams;
    initParams = (cat && cat.length > 0) ? {...initParams, cat: cat} : initParams;
    const [params, setParams] = useState(initParams);

    // 用useMemo設定當rows的內容更動時，sortIdx才會跟著變動
    const sortIdx = useMemo(() => filters.rows.map(row => row.id), [filters.rows]);
    // 用useRef設定當rows的內容更動時，sortOrder也不會跟著變動
    let sortOrder = useRef(null);

    const initBreadcrumb = [
        {name: '後台首頁', href: '/admin', current: false},
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);


    const getData = async (accessToken, page, perpage, _params) => {
        const data = await getReadAPI('product', page, perpage, _params, accessToken);
        //console.info(data);
        if (data.status === 200) {
            setFilters({
                rows: data.data.rows,
                meta: data.data.meta,
            })
            sortOrder.current = data.data.rows.map(row => row.sort_order);
            setCats(data.cats.rows);
            const activeCat = data.cats.rows.find(row => row.active);
            //console.info(activeCat);
            if (activeCat) {
                if (activeCat.children.length > 0) {
                    const activeChildren = activeCat.children.find(row => row.active);
                    const tails = [
                        {name: '商品', href: '/admin/product', current: false}, {
                            name: activeCat.name,
                            href: '/admin/product?cat=' + activeCat.token,
                            current: false
                        }];
                    if (activeChildren) {
                        tails.push({
                            name: activeChildren.name,
                            href: '/admin/product?cat=' + activeChildren.token,
                            current: true
                        });
                    }
                    setBreadcrumbs(prev => {
                        return [...initBreadcrumb, ...tails];
                    });
                } else {
                    setBreadcrumbs(prev => {
                        return [...initBreadcrumb, {name: '商品', href: '/admin/product', current: false}, {
                            name: activeCat.name,
                            href: '/admin/product?cat=' + activeCat.token,
                            current: false
                        }];
                    });
                }
            } else {
                setBreadcrumbs(() => ([...initBreadcrumb, {name: '商品', href: '/admin/product', current: true}]));
            }
        } else {
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs1 += msg + "\n"
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'alert',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                })
            }
        }
        let arr = {};
        if (page && page.length > 0) {
            arr = {...arr, page: page, perpage: perpage};
        }
        Object.keys(params).forEach(key => {
            if (key !== 'backend') {
                const value = params[key];
                arr = {...arr, [key]: value};
            }
        })
        let url = `${baseUrl}`;
        Object.keys(arr).forEach((key, idx) => {
            url += `${idx===0?'?':'&'}${key}=${arr[key]}`;
        })
        navigate(url);

        setIsGetComplete(true);
    }

    useEffect(() => {
        //setIsLoading(true);
        // if (cat) {
        //     params = {...params, cat_token: cat};
        // }
        // if (keyword.length > 0) {
        //     params = {...params, k: keyword};
        // }
        getData(accessToken, page, perpage, params);
        setStartIdx((_page - 1) * perpage + 1);
        //setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, params])

    const onEdit = (token) => {
        if (token !== undefined && token.length > 0) {
            const url = `${baseUrl}/update/${token}`;
            navigate(url);
        }
    }

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    // 全選按鈕被按下
    const toggleChecked = (e) => {
        const checked = e.target.checked;
        let res = [];
        if (checked) {
            filters.rows.forEach((item) => {
                res.push(item.id);
            })
        }
        setIsCheck(res);
    }

    // 單一的選擇按鈕被按下
    const singleCheck = (e, id) => {
        const checked = e.target.checked;
        if (checked) {
            setIsCheck((prev) => [...prev, id]);
        } else {
            setIsCheck((prev) => {
                return prev.filter((item) => item !== id);
            });
        }
    }

    const onDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: () => {
                handleDelete(token)
            },
        });
    }

    // 刪除所選擇的項目
    const onDeleteAll = () => {
        let arr = [];
        filters.rows.forEach((row) => {
            if (isCheck.includes(row.id)) {
                arr.push(row.token);
            }
        });

        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除所選？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: () => {
                handleDelete(arr);
            },
        });
    }

    const handleDelete = async (token) => {
        setIsLoading(true);
        let res = null;
        if (Array.isArray(token)) {
            const _token = JSON.stringify(token);
            res = await _handleDelete(_token);
        } else {
            res = await _handleDelete(token);
        }
        setIsLoading(false);
        if (res) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: res,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
            });
        } else {
            setIsLoading(true);
            getData(accessToken, _page, perpage, params);
            setIsLoading(false);
        }
    };
    const _handleDelete = async (token) => {
        const data = await deleteOneAPI('product', token, accessToken);
        if (data.status !== 200) {
            let msgs = "";
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs += msg + "\n"
            }
            return msgs;
        } else {
            return null;
        }
    }

    const onChange = (e) => {
        setKeyword(e.target.value);
        setParams(prev => {
            return {...prev, k: e.target.value};
        });
    }

    const onClear = () => {
        setKeyword('');
        setParams(prev => {
            return delete prev.k;
        });
        setFilters({
            rows: [],
            meta: {},
        });
    }

    const goCat = (token) => {
        //console.info(token);
        navigate('/admin/product?cat=' + token);
        setCats(() => {
            const a = cats.map(cat => {
                cat.active = false;
                return cat;
            });
            return a;
        })
    }

    const showChild = (idx) => {
        //console.info(idx);
        setCats(() => {
            let a = cats.map(cat => {
                cat.active = false;
                return cat;
            });
            a[idx].active = true;
            return [...a];
        })
    }

    const onDragEnd = async (e) => {
        const {active, over} = e;
        if (active !== over) {
            //let items = rows;
            // const oldIdx = sortIdx.indexOf(active.id);
            // const newIdx = sortIdx.indexOf(over.id);
            // items = arrayMove(items, oldIdx, newIdx);
            // setRows(items);
            // items = items.map(item => {return {token: item.token, sort_order: item.sort_order}});
            //console.info(JSON.stringify(items));

            let res = null;
            setFilters(prev => {
                const oldIdx = sortIdx.indexOf(active.id);
                const newIdx = sortIdx.indexOf(over.id);
                //console.info(prev);
                let after = arrayMove(prev.rows, oldIdx, newIdx);

                // 由於拖曳排序時，是整個row跟著移動，所以sort_order也是一樣，這樣排序沒有變動，重新整理後排序依然一樣，所以必須把原來的排序值設定到拖曳後排序值
                after = after.map((item, idx) => {
                    item['sort_order'] = sortOrder.current[idx];
                    return item;
                });
                console.info(after);
                res = after.map(item => {
                    return {name: item.name, token: item.token, sort_order: item.sort_order}
                });
                prev.rows = after;
                return {...prev};
            });
            //console.info(res);
            setIsLoading(true);
            const data = await postUpdateSortOrderAPI('product', JSON.stringify(res), auth.accessToken);
            //console.info(JSON.stringify(data));
            setIsLoading(false);
        }
    }

    const Thead = () => {
        return (
            <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        #
                    </th>
                    <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input id="checkbox-all-search" type="checkbox"
                                   onChange={(e) => toggleChecked(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   checked={isCheck.length > 0}
                            />
                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        id
                    </th>
                    <th scope="col" className="px-6 py-3">
                        代表圖
                    </th>
                    <th scope="col" width='20%' className="px-6 py-3">
                        名稱
                    </th>
                    <th scope="col" className="px-6 py-3">
                        類型
                    </th>
                    <th scope="col" className="px-6 py-3">
                        觀看人數
                    </th>
                    <th scope="col" className="px-6 py-3">
                        狀態
                    </th>
                    <th scope="col" className="px-6 py-3">
                        功能
                    </th>
                </tr>
            </thead>
        )
    }

    const TR = ({
        row,
        sortable,
        idx
                }) => {

        const {attributes, listeners, setNodeRef, transform, transition} = sortable;
        return (
            <tr
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition: transition
                }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {idx}
                </th>
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input onChange={(e) => singleCheck(e, row.id)} id="checkbox-table-search-1"
                               type="checkbox"
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                               checked={isCheck.includes(row.id)}
                        />
                        <label htmlFor="checkbox-table-search-1"
                               className="sr-only">checkbox</label>
                    </div>
                </td>
                <td className="px-6 py-4">
                    {row.id}
                </td>
                <td className="px-6 py-4">
                    <Featured row={row} className='w-[60px]' />
                    {/*<img src={row.featured} className='w-12 h-12 rounded-full' alt={row.name}/>*/}
                </td>
                <td className="px-6 py-4">
                    {row.name}
                </td>
                <td className="px-6 py-4 cursor-pointer"
                    onClick={() => goCat(row.cat[(row.cat.length) - 1].token)}>
                    {row.cat[(row.cat.length) - 1].name}
                    {/*{tag(row.type, row.type_text)}*/}
                </td>
                <td className="px-6 py-4">
                    {formattedWithSeparator(row.pv)}
                </td>
                <td className="px-6 py-4">
                    <StatusForTable status={row.status} status_text={row.status_text}/>
                </td>
                <td className="px-6 py-4">
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <EditButton onClick={() => onEdit(row.token)}>編輯</EditButton>
                        <DeleteButton onClick={() => onDelete(row.token)}>刪除</DeleteButton>
                    </div>
                </td>
            </tr>
        )
    }

    const Tfoot = () => {
        return (
            <tfoot>
            <tr>
                <td colSpan='100'>
                    {filters.meta && <Pagination setPage={setPage} meta={filters.meta}/>}
                </td>
            </tr>
            </tfoot>
        )
    }
    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className='p-4'>
                <Breadcrumb items={breadcrumbs}/>
                <h2 className='text-MyWhite text-3xl mb-4'>商品列表</h2>
                <div className='flex justify-between mb-6'>
                    <div className="flex items-center justify-center">
                        <FilterRead
                            value={keyword}
                            onChange={onChange}
                            onClear={onClear}
                        />
                        <div className='h-full w-4 border-l border-gray-600'></div>
                        <div className='flex gap-4'>
                            {/* <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/> */}
                            <DeleteButton disabled={isCheck.length === 0}
                                          onClick={() => onDeleteAll()}>刪除多筆</DeleteButton>
                        </div>
                    </div>
                    <div>
                        <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => onEdit('')}>新增</PrimaryButton>
                    </div>
                </div>
                <div className="p-4 my-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className='mb-8 grid grid-cols-6 gap-4 2xl:grid-cols-8 xl:gap-10'>
                        {cats.map((cat, idx) => (
                            <div key={cat.id}>
                                <div key={cat.token}
                                     className={`flex flex-col items-center justify-center h-20 2xl:px-2 px-1 bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-100 ${cat.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800' : 'dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800 dark:text-white'}`}
                                     onClick={() => goCat(cat.token)} onMouseOver={() => showChild(idx)}>
                                    <h5 className="text-2xl font-bold tracking-tight">{cat.name}</h5>
                                    {cat.children.length > 0 ? <BsThreeDots className='text-MyWhite w-8 h-8'/> : ""}
                                </div>
                                {cat.children.length > 0 ?
                                    <div
                                        className={`absolute bdivide-y z-10 bg-white divide-y divide-gray-100 w-44 dark:bg-PrimaryBlock-950 ${cat.active ? 'block' : 'hidden'}`}>
                                        <ul className="mt-2 py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow">
                                            {cat.children.map((childrenCat, idx1) => (
                                                <li key={childrenCat.token}
                                                    onClick={() => goCat(childrenCat.token, idx, idx1)}
                                                    className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer`}>{childrenCat.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <TableRowSort
                        rows={filters.rows}
                        onDragEnd={onDragEnd}
                        sortIdx={sortIdx}
                        startIdx={startIdx}
                        Thead={Thead}
                        TR={TR}
                        Tfoot={Tfoot}
                    />
                </div>
            </div>
        )
    }
}

export default ReadProduct

function tag(type, text) {
    if (type === 'clothes') {
        return <span
            className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{text}
        </span>
    } else if (type === 'racket') {
        return <span
            className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{text}</span>
    } else if (type === 'shoes') {
        return <span
            className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{text}</span>
    } else if (type === 'coin') {
        return <span
            className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{text}</span>
    } else if (type === 'match') {
        return <span
            className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{text}</span>
    } else if (type === 'subscription') {
        return <span
            className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">{text}</span>
    } else if (type === 'mejump') {
        return <span
            className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">{text}</span>
    }
}
