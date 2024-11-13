import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../component/Breadcrumb'
import {getReadAPI} from '../../../context/order/OrderAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import {formattedWithSeparator} from '../../../functions/math'
import {noSec} from '../../../functions/date'
import Divider from '../../../component/Divider'
import {PrimaryButton, SecondaryButton} from "../../../component/MyButton";
import {ImSpinner6} from "react-icons/im";
import {Featured} from "../../../component/image/Images";

export default function Order() {
    const {auth, setIsLoading, setAlertModal, isLoading} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    var params = {};


    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    var {page, perpage} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const startIdx = (page - 1) * perpage + 1

    const {accessToken} = auth

    const navigate = useNavigate()


    const breadcrumbs = [
        {name: '會員', href: '/member', current: false},
        {name: '訂單', href: '/member/order', current: true},
    ];

    const getData = async (accessToken) => {
        const data = await getReadAPI(accessToken, page, perpage);
        console.info(data);
        if (data.status === 200) {
            setRows(data.data.rows)

            var meta = data.data.meta
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            setMeta(meta)
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
        setIsGetComplete(true);
    }

    useEffect(() => {
        console.info("1. isLoading: " + isLoading);
        if (!isLoading) {
            console.info("2. isLoading: " + isLoading);
            setIsLoading(true)
            getData(accessToken)
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, isLoading]);

    const goOrder = (token) => {
        //console.info(token);
        navigate('/member/order/show/' + token);
    }

    const goCheckout = (token) => {
        navigate('/member/checkout/' + token);
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
            <div>
                <div className="mx-auto max-w-7xl">
                    <main className="isolate px-1">
                        <Breadcrumb items={breadcrumbs}/>
                        <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">購買紀錄</h2>
                        <div className="w-full bg-Menu border border-PrimaryBlock-800 px-2 lg:p-6 rounded-lg">
                            {rows.map((row, idx) =>
                                <div key={row.id}>
                                    <div className='text-white bg-blockColor mb-8'>
                                        <div
                                            className='flex items-center justify-center text-Primary-300 py-4'>{startIdx + idx}</div>
                                        <div
                                            className='flex flex-row items-center justify-between mt-4 lg:p-4 lg:pl-4 text-MyWhite'>
                                            <div className='lg:mr-4 flex flex-row gap-4'>
                                                <div className=''>{noSec(row.created_at, true)}</div>
                                                <div className='flex flex-row items-center'>
                                                    <span className='text-xs mr-2'>總額：NT$</span>
                                                    <span
                                                        className='text-xl text-Warning-400'>{formattedWithSeparator(row.grand_total)}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row items-center'>{row.order_no}</div>
                                        </div>
                                        <div className=''>
                                            {row.items.map(item =>
                                                <div key={item.id} className='py-4 lg:p-4 text-white bg-blockColor'>
                                                    <div className='flex flex-row items-center gap-2 mb-4 pb-4'>
                                                        <div className="w-[100px] xl:w-[200px] lg:mr-4">
                                                            <Featured row={item.product} className='w-[300px]' />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className='mb-2'>{item.product.name}</div>
                                                            <div className='flex flex-row items-center justify-between'>
                                                                <div className=''>單價：$&nbsp;<span
                                                                    className='text-Warning-400'>{formattedWithSeparator(item.sell_price)}</span>
                                                                </div>
                                                                <div className='lg:mr-6'>x{item.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row justify-end items-center mt-2'>
                                                        <div className='flex items-center'>
                                                            <span className='text-xs mr-2'>總額：NT$</span>
                                                            <span
                                                                className='text-xl text-Warning-400'>{formattedWithSeparator(item.total_amount)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center justify-center mt-6 gap-4'>
                                                        <PrimaryButton className='w-64' onClick={() => goOrder(row.token)}>詳細內容</PrimaryButton>
                                                        {row.process === 'normal' && row.gateway === 'credit_card' ?
                                                            <SecondaryButton className='w-64' onClick={() => goCheckout(row.token)}>結帳</SecondaryButton> : ''
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Divider text='分隔線' textColor='MyWhite' textSize='lg:text-base text-xs'/>
                                </div>
                            )}
                        </div>
                        <div className='mt-6'>
                            {meta && <Pagination setPage={setPage} meta={meta} params={params} />}
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}
