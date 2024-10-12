import React, {useContext, useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../component/Breadcrumb';
import { deleteOneAPI, deleteItemAPI, updateQuantityAPI } from '../../../context/cart/CartAction';
import useQueryParams from '../../../hooks/useQueryParams';
import {Pagination} from '../../../component/Pagination';
import { formattedWithSeparator } from '../../../functions/math';
import SelectNumber from '../../../component/form/SelectNumber';
import { FaRegTrashAlt } from "react-icons/fa";
import Divider from '../../../component/Divider';
import { PrimaryButton } from '../../../component/MyButton';
import {getCartAPI} from "../../../context/member/MemberAction";


export default function Cart() {
    const {auth, setIsLoading, setAlertModal, isLoading, warning} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [grandTotal, setGrandTotal] = useState(0);

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const startIdx = (page-1)*perpage + 1

    const {accessToken} = auth;

    const navigate = useNavigate();

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '購物車', href: '/member/cart', current: true },
    ];

    const getData = async (accessToken) => {
        const data = await getCartAPI(accessToken, page, perpage);
        console.info(data);
        if (data.status === 200) {
            //console.info("test: " + Object.hasOwn(data.data, 'items'));
            if (!Object.hasOwn(data.data, 'items')) {
                setIsEmpty(true);
            } else {
                var grand_total = data.data.items.reduce((acc, row) => acc + row.total_amount, 0);
                setGrandTotal(grand_total);
                setRows(data.data.items);
                var meta = data.data._meta
                // const pageParams = getPageParams(meta)
                // meta = {...meta, ...pageParams}
                setMeta(meta)
            }
        } else {
            var msgs1 = ""
            if (data.message.length > 0) {
                msgs1 = data.message;
            } else {
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
                }
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
        if (!isLoading) {
            setIsLoading(true)
            getData(accessToken)
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, isLoading]);

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    // 全選按鈕被按下
    const toggleAllChecked = (e) => {
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

    function handleDeleteCart() {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeleteCart
        });
    };

    const handleDeleteItem = (item_token) => {
        //console.info(item_token);
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeleteItem,
            params: {item_token: item_token},
        });
    };

    // 刪除所選擇的項目
    const handleDeleteItems = () => {
        if (isCheck.length > 0) {
            setAlertModal({
                isModalShow: true,
                modalType: 'warning',
                modalTitle: '警告',
                modalText: '是否確定刪除？',
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: onDeleteItems
            });
        }
    }

    const onDeleteItem = async (params) => {
        const item_token = params.item_token;
        const res = await deleteItemAPI(accessToken, item_token);
        //console.info(res);
        if (res.status !== 200) {
            warning("刪除失敗，請再試一次或洽管理員");
        } else {
            getData(accessToken);
        }
    }

    const onDeleteItems = async () => {
        let arr = [];
        rows.forEach((row) => {
            if (isCheck.includes(row.id)) {
                arr.push(row.token);
            }
        });
        //console.info(arr);
        arr.forEach((token) => {
            onDeleteItem({item_token: token});
        });
    }

    const onDeleteCart = async (params) => {
        const item_token = params.item_token
        setIsLoading(true)
        const data = await deleteOneAPI(accessToken, item_token)
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

    const plus = (idx) => {
        const data = rows[idx];
        const val = data.quantity + 1;
        if (val > data.product_stock) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "庫存數只有"+data.product_stock,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false
            });
        } else {
            updateQuantity(data.token, val);
        }
    }

    const minus = (idx) => {
        const data = rows[idx];
        const val = data.quantity - 1;
        if (val <= 0) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "數量不得小於1",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false
            });
        } else {
            updateQuantity(data.token, val);
        }
    }

    const updateQuantity = async (item_token, quantity) => {
        setIsLoading(true)
        const data = await updateQuantityAPI(auth.accessToken, item_token, quantity);
        //console.info(data)
        setIsLoading(false)
        if (data.status !== 200) {
            var message = "";
            for (let i = 0; i < data["message"].length; i++) {
                message += data["message"][i].message;
            }
            warning(message);
        }
    }    

    const handlePayment = async () => {
        navigate("/member/checkout");
    }

    if (isLoading || imBusy) { return <div className="text-MyWhite">loading</div>}
    else {
    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <main className="isolate px-1">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">購物車</h2>
                    {(isEmpty) ? <div className='flex justify-center text-xl font-bold text-MyWhite'>購物車中無商品</div>
                        :<>
                        <div className="w-full bg-Menu border border-PrimaryBlock-800 px-2 lg:p-6 rounded-lg">
                            <div className='flex flex-row items-center justify-between bg-blockColor my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                                <div className='lg:mr-4 flex flex-row gap-4'>
                                    <input id="checkbox-all-search" type="checkbox" onChange={(e) => toggleAllChecked(e)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <FaRegTrashAlt
                                        className={`w-4 h-4 ${isCheck.length > 0 ? 'text-Warning-500 cursor-pointer' : 'text-BG-900'}`}
                                        onClick={() => handleDeleteItems()}
                                    />
                                </div>

                                <div className='flex flex-row items-center gap-4'>
                                    <PrimaryButton type="button" className="w-full lg:w-60" onClick={handlePayment}>結帳</PrimaryButton>
                                    <span className='text-xs mr-2'>總額：NT$</span>
                                    <span className='text-xl text-Warning-400'>{formattedWithSeparator(grandTotal)}</span>
                                </div>
                            </div>
                            {rows.map((row, idx) =>
                                <div key={row.id} className='py-4 lg:p-4 text-white bg-blockColor'>
                                    <div className='flex flex-row items-center gap-2 mb-4 pb-4'>
                                        <div className='lg:mr-4'>
                                            <input onChange={(e) => singleCheck(e, row.id)} id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                checked={isCheck.includes(row.id)}
                                            />
                                        </div>
                                        <div className="w-[100px] xl:w-[200px] lg:mr-4">
                                            <img src={row.product_featured} alt={row.product_name} />
                                        </div>
                                        <div className="flex-grow">
                                            <div className='mb-2'>{row.product_name}</div>
                                            <div className='flex flex-row items-center justify-between'>
                                                <div className=''>單價：$&nbsp;<span className='text-Warning-400'>{formattedWithSeparator(row.sell_price)}</span></div>
                                                <div className='lg:mr-6'>
                                                    <SelectNumber label="數量" value={row.quantity} plus={plus} minus={minus} idx={idx} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-row justify-between items-center mt-2'>
                                        <FaRegTrashAlt className='w-4 h-4 text-Warning-500 cursor-pointer' onClick={() => handleDeleteItem(row.token)} />
                                        <div className='flex items-center'>
                                            <span className='text-xs mr-2'>總額：NT$</span>
                                            <span className='text-xl text-Warning-400'>{formattedWithSeparator(row.total_amount)}</span>
                                        </div>
                                    </div>
                                    <Divider text='分隔線' textColor='PrimaryBlock-400' textSize='lg:text-base text-xs' />
                                </div>
                            )}
                        </div>
                    </>}
                </main>
            </div>
        </div>
    )}
}
