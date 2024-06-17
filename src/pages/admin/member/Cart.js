import {useContext, useState, useEffect} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getCartAPI, deleteCartAPI, deleteItemAPI } from '../../../context/member/MemberAction'
import { PrimaryButton, DeleteButton, EditButton, PrimaryOutlineButton, ShoppingCartButton, OrderButton } from '../../../component/MyButton'
import { formattedWithSeparator } from '../../../functions/math'

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
    const [amount, setAmount] = useState(0);

    const getCart = async (accessToken) => {
        const data = await getCartAPI(accessToken);
        console.info(data);
        if (Object.hasOwn(data.data, 'token')) {
            setCartToken(data.data.token);
        }
        if (Object.hasOwn(data.data, 'items')) {
            setRows(data.data.items);
            const amount = data.data.items.reduce((obj, item) => obj + item.amount, 0);
            //console.info(amount);
            setAmount(amount);
        }
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

    const handleEdit = (token) => {
        var url = "/admin/member/update"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        //navigate(url)
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
                    <h3>商品共</h3><h3 className='text-Warning-500'>{rows.length}</h3>項
                    <h3>價錢共NT$</h3><h3 className='text-Warning-500'>{formattedWithSeparator(amount)}</h3>元
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
                                代表圖
                            </th>
                            <th scope="col" className="px-6 py-3">
                                名稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                價格
                            </th>
                            <th scope="col" className="px-6 py-3">
                                數量
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
                                    <img src={row.product_featured} className='w-12' alt={row.product_name} />
                                </td>
                                <td className="px-6 py-4">
                                    {row.product_name}
                                </td>
                                <td className="px-6 py-4">
                                    {formattedWithSeparator(row.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    {row.quantity}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-4">
                                        <div className='flex flex-col md:flex-row gap-2'>
                                            <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                                            <DeleteButton onClick={() => handleDeleteItem(row.token)}>刪除</DeleteButton>
                                        </div>    
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
