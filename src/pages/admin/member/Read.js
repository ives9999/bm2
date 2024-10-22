import {useContext, useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../component/Breadcrumb'
import SearchBar from "../../../component/form/SearchBar"
import StatusForTable from '../../../component/StatusForTable'
import { FaRegTrashAlt } from "react-icons/fa"
import { GoGear } from "react-icons/go"
import { PrimaryButton, DeleteButton, EditButton, PrimaryOutlineButton, ShoppingCartButton, OrderButton } from '../../../component/MyButton'
import { getReadAPI, deleteOneAPI } from '../../../context/member/MemberAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'

function ReadMember() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [keyword, setKeyword] = useState('');

    const location = useLocation();
    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    var { page, perpage, k } = useQueryParams();
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    k = (k === undefined) ? "" : k;

    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    const {accessToken} = auth
    const navigate = useNavigate()

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員', href: '/admin/member', current: true },
    ]

    const getData = async (accessToken, page, perpage, params) => {
        const data = await getReadAPI(accessToken, page, perpage, params)
        if (data.status === 200) {
            //console.info(data.data.data);
            setRows(data.data.rows)

            var meta = data.data.meta
            //const pageParams = getPageParams(meta)
            //meta = {...meta, ...pageParams}
            setMeta(meta);
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
    }

    useEffect(() => {
        setIsLoading(true);
        let params = {};
        if (k.length > 0) {
            setKeyword(k);
            params = {...params, k: k};
        }
        getData(auth.accessToken, _page, perpage, params);
        setStartIdx((_page - 1) * perpage + 1);
        setIsLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page])

    const handleEdit = (token) => {
        var url = "/admin/member/update"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }

    const handleDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDelete,
            params: {token: token},
        });
    }

    const onDelete = async (params) => {
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

    // 全選按鈕被按下
    const toggleChecked = (e) => {
        const checked = e.target.checked;
        let res = [];
        if (checked) {
            rows.forEach((item) => {
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
    const handleDeleteAll = () => {
        let arr = [];
        rows.forEach((row) => {
            if (isCheck.includes(row.id)) {
                arr.push(row);
            }
        });
        arr.forEach((item) => {
            onDelete(item);
        })
    }

    const onChange = (e) => {
        setKeyword(e.target.value);
    }

    const handleClear = () => {
        setKeyword('');
    }

    const handleSearch = () => {
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

    const handleShoppingCart = (token) => {
        //console.info(token);
        var url = "/admin/member/cart"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }

    const handleOrder = (token) => {
        //console.info(token);
        var url = "/admin/member/order"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }

    if (rows && rows.length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>會員列表</h2>
            <div className='flex justify-between mb-6'>
                <div className="flex items-center justify-center">
                    <div className="mr-4">
                        <div className="flex flex-row">
                            <SearchBar 
                                name="member" 
                                value={keyword} 
                                placeholder="請輸入關鍵字"
                                // isShowList={arenas.isShowArenasList}
                                // rows={arenas.list}
                                handleChange={onChange}
                                onClear={handleClear}
                                // setSelected={setArena}
                                // isRequired={true}
                                // errorMsg={errorObj.arenaError.message}
                            />
                            <PrimaryOutlineButton type="button" className='ml-4' onClick={handleSearch}>搜尋</PrimaryOutlineButton>
                        </div>
                    </div>
                    <div className='h-full w-4 border-l border-gray-600'></div>
                    <div className='flex gap-4'>
                        <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/>
                    </div>
                </div>
                <div>
                    <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
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
                                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
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
                        {rows.map((row, idx) => (
                            <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {startIdx + idx}
                                </th>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {row.id}
                                </td>
                                <td className="px-6 py-4">
                                    <img src={row.avatar} className='w-12' alt={row.nickname} />
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
                                            <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                                            <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
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
                               {meta && <Pagination setPage={setPage} meta={meta} />}
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    )}
}

export default ReadMember
