import React, {useContext, useEffect, useRef, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../component/Breadcrumb'
import StatusForTable from '../../../component/StatusForTable'
import { PrimaryButton, DeleteButton, EditButton, PrimaryOutlineButton, ShoppingCartButton, OrderButton } from '../../../component/MyButton'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import {ImSpinner6} from "react-icons/im";
import FilterRead from "../../../component/FilterRead";
import { getReadAPI, deleteOneAPI } from '../../../context/Action'

function ReadMember() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)
    const [isGetComplete, setIsGetComplete] = useState(false);
    const {accessToken} = auth;

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        rows: [],
        meta: {},
    });

    var { page, perpage, k } = useQueryParams();
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [keyword, setKeyword] = useState(k);

    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    const location = useLocation();
    let baseUrl = location.pathname;// /admin/order
    let initParams = {
        backend: true,
    };
    initParams = (k && k.length > 0) ? {...initParams, k: k} : initParams;
    const [params, setParams] = useState(initParams);

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員', href: '/admin/member', current: true },
    ]

    const getData = async (accessToken, page, perpage, _params) => {
        const data = await getReadAPI('member', page, perpage, _params, accessToken);
        if (data.status === 200) {
            setFilters({
                rows: data.data.rows,
                meta: data.data.meta,
            })
        } else if (data.status === 401) {
            // access token invalid
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: data.message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
            });
        } else {
            // console.info(data.status);
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs1 += msg + "\n"
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                });
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

        getData(accessToken, _page, perpage, params);
        setStartIdx((_page - 1) * perpage + 1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, params])

    const onEdit = (token) => {
        if (token !== undefined && token.length > 0) {
            const url = `${baseUrl}/update/token`;
            navigate(url);
        } else {
            const url = `${baseUrl}/update`;
            navigate(url);
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
            onOK: handleDelete,
            params: {token: token},
        });
    }

    // 刪除所選擇的項目
    const onDeleteAll = () => {
        let arr = [];
        filters.rows.forEach((row) => {
            if (isCheck.includes(row.id)) {
                arr.push(row);
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
            //params: {token: token},
        });

        // arr.forEach((item) => {
        //     onDelete(item);
        // })
    }

    const handleDelete = async (params) => {
        console.info(params);
        // const token = params.token
        // setIsLoading(true);
        // const data = await deleteOneAPI('member', token, accessToken);
        // //console.info(data)
        // setIsLoading(false)
        // if (data.status !== 200) {
        //     var msgs = ""
        //     for (let i = 0; i < data["message"].length; i++) {
        //         const msg = data["message"][i].message
        //         msgs += msg + "\n"
        //     }
        //     setAlertModal({
        //         modalType: 'warning',
        //         modalTitle: '警告',
        //         modalText: msgs,
        //         isModalShow: true,
        //         isShowOKButton: true,
        //         isShowCancelButton: true,
        //     })
        // } else {
        //     setIsLoading(true);
        //     getData(accessToken, _page, perpage, params);
        //     setIsLoading(false);
        // }
    };

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

    const onChange = async (e) => {
        setKeyword(e.target.value);
        const params = {k: e.target.value};
        await getData(accessToken, 1, perpage, params);
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

    // const handleSearch = () => {
    //     //console.log(location.pathname);
    //     setIsLoading(true);
    //     var url = location.pathname;
    //     if (url.indexOf('?') !== -1) {
    //         url += '&k=' + keyword;
    //     } else {
    //         url += '?k=' + keyword;
    //     }
    //     //console.info(url);
    //     navigate(url);
    //     let params = [];
    //     if (keyword.length > 0) {
    //         params.push({k: keyword});
    //     }
    //     //console.info(params);
    //     getData(auth.accessToken, _page, perpage, params);
    //     setIsLoading(false);
    // }

    const handleShoppingCart = (token) => {
        //console.info(token);
        if (token !== undefined && token.length > 0) {
            const url = `${baseUrl}/cart/${token}`;
            navigate(url)
        }
    }

    const handleOrder = (token) => {
        //console.info(token);
        var url = "/admin/member/order"
        if (token !== undefined && token.length > 0) {
            const url = `${baseUrl}/${token}`;
            navigate(url)
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
                <h2 className='text-MyWhite text-3xl mb-4'>會員列表</h2>
                <div className='flex justify-between mb-6'>
                    <div className="flex items-center justify-center">
                        <FilterRead
                            value={keyword}
                            onChange={onChange}
                            onClear={onClear}
                        />

                        <div className='h-full w-4 border-l border-gray-600'></div>
                        <div className='flex gap-4'>
                            <DeleteButton disabled={isCheck.length === 0}
                                          onClick={() => onDeleteAll()}>刪除多筆</DeleteButton>
                        </div>
                    </div>
                    <div>
                        <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => onEdit('')}>新增</PrimaryButton>
                    </div>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                            <th scope="col" className="px-6 py-3">
                                頭像
                            </th>
                            <th scope="col" className="px-6 py-3">
                                名稱/暱稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email/手機
                            </th>
                            <th scope="col" className="px-6 py-3">
                                狀態
                            </th>
                            <th scope="col" className="px-6 py-3">
                                功能
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filters.rows.map((row, idx) => (
                            <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium">
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
                                    <img src={row.avatar} className='w-12' alt={row.nickname}/>
                                </td>
                                <td className="px-6 py-4">
                                    {row.name}<br/>{row.nickname}
                                </td>
                                <td className="px-6 py-4">
                                    {row.email}<br/>{row.mobile}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusForTable status={row.status} status_text={row.status_text} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-4">
                                        <div className='flex flex-col md:flex-row gap-2'>
                                            <EditButton onClick={() => onEdit(row.token)}>編輯</EditButton>
                                            <DeleteButton onClick={() => onDelete(row.token)}>刪除</DeleteButton>
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-2'>
                                            <ShoppingCartButton onClick={() => handleShoppingCart(row.token)}>購物車</ShoppingCartButton>
                                            <OrderButton onClick={() => handleOrder(row.token)}>訂單</OrderButton>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan='100'>
                                {filters.meta && <Pagination setPage={setPage} meta={filters.meta} />}
                            </td>
                        </tr>
                        </tfoot>
                    </table>

                </div>
            </div>
        )}
}

export default ReadMember