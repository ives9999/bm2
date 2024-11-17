import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import BMContext from "../../../context/BMContext";
import Breadcrumb from "../../../component/Breadcrumb";
import useQueryParams from "../../../hooks/useQueryParams";
import {useLocation, useNavigate} from "react-router-dom";
import {getReadAPI} from "../../../context/Action";
import SearchBar from "../../../component/form/SearchBar";
import {DeleteButton, EditButton, PrimaryButton, PrimaryOutlineButton} from "../../../component/MyButton";
import {deleteOneAPI, postUpdateSortOrderAPI} from "../../../context/product/ProductAction";
import {TableRowSort} from "../../../component/TableRowSort";
import {CSS} from "@dnd-kit/utilities";
import {formattedWithSeparator} from "../../../functions/math";
import StatusForTable from "../../../component/StatusForTable";
import {Pagination} from "../../../component/Pagination";
import {arrayMove} from "@dnd-kit/sortable";
import ReadHeader from '../../../component/admin/ReadHeader'

const ReadSupplier = () => {
    const {auth, setIsLoading, warning, setAlertModal} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);

    const initBreadcrumb = [
        {name: '後台首頁', href: '/admin', current: false},
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    var {page, perpage, k, cat} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage;
    k = (k === undefined) ? "" : k;
    const [keyword, setKeyword] = useState('');

    const [_page, setPage] = useState(page);
    const startIdx = (page - 1) * perpage + 1

    const {accessToken} = auth

    const navigate = useNavigate();

    const [read, setRead] = useState({rows: [], meta: {}});
    // 用useMemo設定當rows的內容更動時，sortIdx才會跟著變動
    const sortIdx = useMemo(() => read.rows.map(row => row.id), [read.rows]);
    // 用useRef設定當rows的內容更動時，sortOrder也不會跟著變動
    let sortOrder = useRef(null);

    const onEdit = (token) => {
        var url = "/admin/supplier/update"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }
    const onDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: handleDelete,
            params: {token: token},
        });
    }

    const handleDelete = async (params) => {
        const token = params.token
        setIsLoading(true)
        const data = await deleteOneAPI(accessToken, token)
        //console.info(data)
        setIsLoading(false)
        if (data.status !== 200) {
            var msgs = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs += msg + "\n"
            }
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: msgs,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
            })
        } else {
            setIsLoading(true)
            getData()
            setIsLoading(false)
        }
    };

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);
    // 全選按鈕被按下
    const toggleChecked = (e) => {
        const checked = e.target.checked;
        let res = [];
        if (checked) {
            read.rows.forEach((item) => {
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

    // 刪除所選擇的項目
    const onDeleteAll = () => {
        let arr = [];
        read.rows.forEach((row) => {
            if (isCheck.includes(row.id)) {
                arr.push(row);
            }
        });
        arr.forEach((item) => {
            handleDelete(item);
        })
    }

    const location = useLocation();
    const onChange = (e) => {
        setKeyword(e.target.value);
    }

    const onClear = () => {
        setKeyword('');
    }

    const onSearch = () => {
        //console.log(location.pathname);
        setIsLoading(true);
        var url = location.pathname;
        if (url.indexOf('?') !== -1) {
            url += '&k=' + keyword;
        } else {
            url += '?k=' + keyword;
        }
        //console.info(url);
        navigate(url);
        let params = [];
        if (keyword.length > 0) {
            params.push({k: keyword});
        }
        //console.info(params);
        getData(auth.accessToken, _page, perpage, params);
        setIsLoading(false);
    }

    const getData = async (accessToken, page, perpage, params) => {
        const data = await getReadAPI('supplier', page, perpage, params, accessToken);
        console.info(data.data);
        if (data.status === 200) {
            setRead(prev => {
                if (data.data.meta.currentPage === 1) {
                    return {rows: data.data.rows, meta: data.data.meta};
                } else {
                    return {rows: [...prev, ...data.data.rows], meta: data.data.meta};
                }
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
        setIsGetComplete(true);
    }

    useEffect(() => {
        setIsLoading(true);

        const params = {};
        getData(accessToken, page, perpage, params)
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, cat, keyword])

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
                    {startIdx + idx}
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
                    {read.meta && <Pagination setPage={setPage} meta={read.meta}/>}
                </td>
            </tr>
            </tfoot>
        )
    }

    const onDragEnd = async (e) => {
        const {active, over} = e;
        if (active !== over) {
            //let items = rows;
            const oldIdx = sortIdx.indexOf(active.id);
            const newIdx = sortIdx.indexOf(over.id);
            // items = arrayMove(items, oldIdx, newIdx);
            // setRows(items);
            // items = items.map(item => {return {token: item.token, sort_order: item.sort_order}});
            //console.info(JSON.stringify(items));

            let res = null;
            setRead(prev => {
                const oldIdx = sortIdx.indexOf(active.id);
                const newIdx = sortIdx.indexOf(over.id);
                //console.info(prev);
                let after = arrayMove(prev.rows, oldIdx, newIdx);

                // 由於拖曳排序時，是整個row跟著移動，所以sort_order也是一樣，這樣排序沒有變動，重新整理後排序依然一樣，所以必須把原來的排序值設定到拖曳後排序值
                after = after.map((item, idx) => {
                    item['sort_order'] = sortOrder.current[idx];
                    return item;
                });
                // console.info(after);
                res = after.map(item => {
                    return {name: item.name, token: item.token, sort_order: item.sort_order}
                });
                prev.rows = after;
                return {...prev};
            });
            setIsLoading(true);
            const data = await postUpdateSortOrderAPI(auth.accessToken, res);
            //console.info(JSON.stringify(data));
            setIsLoading(false);
        }
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
                <ReadHeader
                    type='supplier'
                    accessToken={auth.accessToken}
                    getReadAPI={getReadAPI}
                    checkCount={isCheck.length}
                    onDeleteAll={onDeleteAll}
                    onEdit={onEdit}
                />
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <TableRowSort
                        rows={read.rows}
                        onDragEnd={onDragEnd}
                        sortIdx={sortIdx}
                        startIdx={sortIdx}
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