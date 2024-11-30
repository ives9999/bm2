import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import BMContext from "../../../context/BMContext";
import Breadcrumb from "../../../component/Breadcrumb";
import useQueryParams from "../../../hooks/useQueryParams";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteOneAPI, getReadAPI, postUpdateSortOrderAPI} from "../../../context/Action";
import {DeleteButton, EditButton, PrimaryButton} from "../../../component/MyButton";
import {TableRowSort} from "../../../component/TableRowSort";
import {CSS} from "@dnd-kit/utilities";
import StatusForTable from "../../../component/StatusForTable";
import {Pagination} from "../../../component/Pagination";
import {arrayMove} from "@dnd-kit/sortable";
import FilterRead from "../../../component/FilterRead";

const ReadSupplier = () => {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const {accessToken} = auth;
    const [isGetComplete, setIsGetComplete] = useState(false);

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        rows: [],
        meta: {},
    });

    var {page, perpage, k} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage;
    k = (k === undefined) ? "" : k;
    const [keyword, setKeyword] = useState(k);

    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    const location = useLocation();
    let baseUrl = location.pathname;// /admin/order
    let initParams = {
        backend: true,
    };
    initParams = (k && k.length > 0) ? {...initParams, k: k} : initParams;
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
        const data = await getReadAPI('supplier', page, perpage, params, accessToken);
        console.info(data.data);
        if (data.status === 200) {
            setFilters({
                rows: data.data.rows,
                meta: data.data.meta,
            })
            sortOrder.current = data.data.rows.map(row => row.sort_order);
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
        getData(accessToken, page, perpage, params);
        setStartIdx((_page - 1) * perpage + 1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, params])
    const onEdit = (token) => {
        if (token !== undefined && token.length > 0) {
            const url = `${baseUrl}/update/${token}`;
            navigate(url);
        } else {
            navigate(`${baseUrl}/update`);
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
            console.info(res);
            setIsLoading(true);
            const data = await postUpdateSortOrderAPI('supplier', JSON.stringify(res), auth.accessToken);
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
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    id
                </th>
                <th scope="col" width='20%' className="px-6 py-3">
                    名稱
                </th>
                <th scope="col" className="px-6 py-3">
                    電話
                </th>
                <th scope="col" className="px-6 py-3">
                    聯絡人
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
                    {row.name}
                </td>
                <td className="px-6 py-4">
                    {row.tel}
                </td>
                <td className="px-6 py-4">
                    {row.contact_name}
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
                <h2 className='text-MyWhite text-3xl mb-4'>供應商列表</h2>
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
        );
    }
};

export default ReadSupplier;