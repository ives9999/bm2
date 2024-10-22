import {useContext, useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../component/Breadcrumb'
import SearchBar from "../../../component/form/SearchBar"
import StatusForTable from '../../../component/StatusForTable'
import { FaRegTrashAlt } from "react-icons/fa"
import { GoGear } from "react-icons/go"
import { PrimaryButton, DeleteButton, EditButton, PrimaryOutlineButton } from '../../../component/MyButton'
import { getReadAPI } from '../../../context/order/OrderAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'
import { noSec, nowDate } from '../../../functions/date';
import { DateRange } from '../../../component/form/DateSingle';
import { Card } from '../../../component/Card'

function ReadCart() {
    const {auth, setIsLoading, setAlertModal, issLoading} = useContext(BMContext)

    const [imBusy, setImBusy] = useState(true);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState(null);
    const [keyword, setKeyword] = useState('');
    const location = useLocation();

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    var { page, perpage, k } = useQueryParams();
    var params = {backend: true};
    if (k !== undefined && k.length > 0) {
        params = {...params, ...{k: k}};
    }
    //console.info("1.:" + JSON.stringify(params));
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const startIdx = (page-1)*perpage + 1

    const {accessToken} = auth

    const navigate = useNavigate()

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '訂單', href: '/admin/order', current: true },
    ];

    const now = nowDate();//console.info(nowDate);
    // 要設定匯入時間的物件
    const [date, setDate] = useState({
        startDate: now,
        endDate: now,
    });

    const onDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDate(newValue); 
    }


    const getData = async (accessToken) => {
        const data = await getReadAPI(accessToken, page, perpage, params);
        console.info(data);
        if (data.status === 200) {
            setRows(data.data.rows)

            var meta = data.data.meta
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            setMeta(meta);
            setSummary(data.data.summary);
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
        setImBusy(false);
    }

    useEffect(() => {
        //setKeyword(k);
        setIsLoading(true)
        getData(accessToken)
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, keyword]);

    const handleEdit = (token) => {
        var url = "/admin/order/update"
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
        //const data = await deleteOneAPI(accessToken, token)
        //console.info(data)
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
        //     setIsLoading(true)
        //     getData()
        //     setIsLoading(false)
        // }
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

    const handleSearch = async () => {
        //console.log(location.pathname);
        //setIsLoading(true);
        var url = location.pathname;

        var char = (url.indexOf('?') !== -1) ? "&" : "?";
        if (keyword !== undefined && keyword.length > 0) {
            url += char + 'k=' + keyword;
            params = {...params, ...{k: keyword}};
        } else {
            delete params.k;
        }
        navigate(url);
        //console.info("params:" + JSON.stringify(params));
        setIsLoading(true);
        await getData(auth.accessToken, _page, perpage, params);
        setIsLoading(false);
    }

    const handleDateSearch = async () => {
        //console.info(date["startDate"] !== null);
        if (date["startDate"] !== undefined && date["endDate"] !== undefined && date["startDate"] !== null && date["endDate"] !== null) {
            params = {...params, ...{startDate: date["startDate"], endDate: date["endDate"]}};
        } else {
            delete params.startDate;
            delete params.endDate;
        }
        //console.info(params);
        setIsLoading(true);
        await getData(auth.accessToken, _page, perpage, params);
        setIsLoading(false);
    }

    if (issLoading || imBusy) { return <div className='text-MyWhite'>Loading</div>}
    else { return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>訂單列表</h2>
            <div className='flex justify-between mb-6'>
                <div className="flex flex-col lg:flex-row lg:items-center justify-center">
                    <div className="lg:mr-16 mb-4 lg:mb-0">
                        <div className="flex flex-row">
                            <SearchBar 
                                name="order" 
                                value={keyword || ''} 
                                placeholder="請輸入關鍵字"
                                handleChange={onChange}
                                onClear={handleClear}
                            />
                            <PrimaryOutlineButton type="button" className='ml-4' onClick={handleSearch}>搜尋</PrimaryOutlineButton>
                        </div>
                    </div>
                    <DateRange label="日期" value={date} onChange={onDateChange} />
                    <PrimaryOutlineButton type="button" className='ml-4' onClick={handleDateSearch}>搜尋</PrimaryOutlineButton>
                    <div className='ml-4 h-full w-4 border-l border-gray-600'></div>
                    <div className='flex gap-4'>
                        {/* <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/> */}
                        <DeleteButton disabled={isCheck.length === 0 ? true : false} onClick={() => handleDeleteAll()}>刪除多筆</DeleteButton>
                    </div>
                </div>
                <div>
                    <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
                </div>
            </div>
            <div className='mb-8 flex flex-row gap-8'>
                <Card title="總營收" content={ "NT$：" + formattedWithSeparator(summary.grandTotal)} />
                <Card title="總利潤" content={ "NT$：" + formattedWithSeparator(summary.profit)} />
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
                                    <input id="checkbox-all-search" type="checkbox" onChange={(e) => toggleChecked(e)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                no / pos id
                            </th>
                            <th scope="col" width='20%' className="px-6 py-3">
                                時間
                            </th>
                            <th scope="col" className="px-6 py-3">
                                會員
                            </th>
                            <th scope="col" className="px-6 py-3">
                                銷售金額 / 利潤
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
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {startIdx + idx}
                                </th>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input onChange={(e) => singleCheck(e, row.id)} id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                            checked={isCheck.includes(row.id)}
                                        />                                        
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {row.id}
                                </td>
                                <td className="px-6 py-4">
                                    {row.order_no}<br />{row.posId}
                                </td>
                                <td className="px-6 py-4">
                                    {noSec(row.created_at, true)}
                                </td>
                                <td className="px-6 py-4">
                                    {row.member_nickname}
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-row items-center gap-2'><span className='text-xs'>NT$</span> <span className='text-xl text-Warning-400'>{formattedWithSeparator(row.grand_total)}</span></div>
                                        <div className='flex flex-row items-center gap-2'><span className='text-xs'>NT$</span> <span className='text-xl text-Success-500'>{formattedWithSeparator(row.profit)}</span></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusForTable status={row.invalid} status_text="結帳" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex flex-col sm:flex-row gap-2'>
                                        <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                                        <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='100'>
                                {meta && <Pagination setPage={setPage} meta={meta} params={params} />}
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    )}
}

export default ReadCart

function tag(type, text) {
    if (type === 'clothes') {
        return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{text}</span>
    } else if (type === 'racket') {
        return <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{text}</span>
    } else if (type === 'shoes') {
        return <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{text}</span>
    } else if (type === 'coin') {
        return <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{text}</span>
    } else if (type === 'match') {
        return <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{text}</span>
    } else if (type === 'subscription') {
        return <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">{text}</span>
    } else if (type === 'mejump') {
        return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">{text}</span>
    }
}
