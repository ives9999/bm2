import {useContext, useState, useEffect} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getCartsAPI, deleteCartAPI, deleteItemAPI } from '../../../context/member/MemberAction'
import { PrimaryButton, DeleteButton, EditButton, PrimaryOutlineButton, ShoppingCartButton, OrderButton } from '../../../component/MyButton'
import { formattedWithSeparator } from '../../../functions/math'
import useQueryParams from "../../../hooks/useQueryParams";

export function Cart() {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext);
    const {token} = useParams();//console.info(token);
    const [cartToken, setCartToken] = useState('');
    const {accessToken} = auth;
    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員列表', href: '/admin/member', current: false },
        { name: '購物車', href: '/admin/member/cart', current: true },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    const [rows, setRows] = useState([]);
    const [showItems, setShowItems] = useState([]);
    //const [amount, setAmount] = useState(0);

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const startIdx = (page-1)*perpage + 1

    const getCart = async (accessToken) => {
        const data = await getCartsAPI(accessToken, token, page, perpage);
        console.info(data);
        if (data.status === 200) {
            data.rows.forEach((row, idx) => {
                var amount = 0;
                row.items.forEach((item) => {
                    amount += item.total_amount;
                })
                data.rows[idx]["amount"] = amount;
            });
            setRows(data.rows);

            var initShowItems = [];
            data.rows.forEach((row) => {
                const showItem = {token: row.token, isShow: true};
                initShowItems.push(showItem);
            });
            setShowItems(initShowItems);
        }
        // if (Object.hasOwn(data.data, 'token')) {
        //     setCartToken(data.data.token);
        // }
        // if (Object.hasOwn(data.data, 'items')) {
        //     setRows(data.data.items);
        //     const amount = data.data.items.reduce((obj, item) => obj + item.amount, 0);
        //     //console.info(amount);
        //     setAmount(amount);
        // }
    }
    useEffect(() => {        
        // console.info(token);
        // 表示修改資料
        if (token !== undefined && token.length > 0) {
            getCart(accessToken);
        // 表示新增資料
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = (token) => {
        setShowItems((prev) => {
            var res = [];
            prev.forEach(item => {
                if (item.token === token) {
                    item.isShow = !item.isShow;
                }
                res.push(item);
            });
            return res;
        })
    }

    const handleDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除整個購物車？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDelete,
            params: {token: token},
        });
    }

    const onDelete = async (params) => {
        const token = params.token;
        console.info(token);
        setIsLoading(true)
        const data = await deleteCartAPI(accessToken, token)
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
            getCart(accessToken)
            setIsLoading(false)
        }
    };

    const handleDeleteItem = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除此商品？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeleteItem,
            params: {token: token},
        });
    }

    const onDeleteItem = async (params) => {
        const token = params.token;
        console.info(token);
        setIsLoading(true)
        const data = await deleteItemAPI(accessToken, token)
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
            getCart(accessToken)
            setIsLoading(false)
        }
    }

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>購物車</h2>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className='flex flex-row text-white gap-4 text-xl mb-6'>
                    <h3>購物車共</h3><h3 className='text-Warning-500'>{rows.length}</h3>台
                    {/*<h3>價錢共NT$</h3><h3 className='text-Warning-500'>{formattedWithSeparator(amount)}</h3>元*/}
                    <DeleteButton className={`${cartToken.length > 0 ? 'ml-16' : 'hidden'}`} onClick={() => handleDelete(cartToken)}>清空</DeleteButton>
                </div>
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
                                訂單編號
                            </th>
                            <th scope="col" className="px-6 py-3">
                                金額
                            </th>
                            <th scope="col" className="px-6 py-3">
                                商品數量
                            </th>
                            <th scope="col" className="px-6 py-3">
                                功能
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <>
                            <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {idx + 1}
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
                                    {row.order_id}
                                </td>
                                <td className="px-6 py-4">
                                    {formattedWithSeparator(row.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    {row.items.length}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-4">
                                        <div className='flex flex-col md:flex-row gap-2'>
                                            <EditButton onClick={() => toggle(row.token)}>商品</EditButton>
                                            <DeleteButton onClick={() => handleDeleteItem(row.token)}>刪除</DeleteButton>
                                        </div>    
                                    </div>
                                </td>
                            </tr>
                            <tr className={`${showItems[idx].isShow ? 'show' : 'hidden'}`}>
                                <td colSpan='100'>
                                    <table className='m-4'>
                                        <thead>
                                        <tr>
                                            <td className='w-24'>&nbsp;</td>
                                            <th className="px-6 py-3 bg-gray-600">#</th>
                                            <td className="w-4 p-4 bg-gray-600">
                                                <div className="flex items-center">
                                                    <input id="checkbox-table-search-1" type="checkbox"
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="checkbox-table-search-1"
                                                           className="sr-only">checkbox</label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 bg-gray-600">商品</td>
                                            <td className="px-6 py-3 bg-gray-600">數量</td>
                                            <td className="px-6 py-3 bg-gray-600">進貨價</td>
                                            <td className="px-6 py-3 bg-gray-600">售價</td>
                                            <td className="px-6 py-3 bg-gray-600">利潤</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {row.items.map((item, idx1) => (
                                            <tr key={item.token}>
                                                <td className='w-24'>&nbsp;</td>
                                                <th scope="row" className="px-6 py-4 font-medium bg-gray-800">
                                                    {idx1 + 1}
                                                </th>
                                                <td className="w-4 p-4  bg-gray-800">
                                                    <div className="flex items-center">
                                                        <input id="checkbox-table-search-1" type="checkbox"
                                                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                        <label htmlFor="checkbox-table-search-1"
                                                               className="sr-only">checkbox</label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 bg-gray-800">
                                                    {item.product.name}
                                                </td>
                                                <td className="px-6 py-4 bg-gray-800">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 bg-gray-800">
                                                    {formattedWithSeparator(item.buy_price)}
                                                </td>
                                                <td className="px-6 py-4 bg-gray-800">
                                                    {formattedWithSeparator(item.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 bg-gray-800">
                                                    {formattedWithSeparator(item.total_profit)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
