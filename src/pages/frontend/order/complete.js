import React, {useContext, useEffect, useState} from 'react';
import Breadcrumb from "../../../layout/Breadcrumb";
import { useParams } from 'react-router-dom'
import BMContext from "../../../context/BMContext";
import {getOneAPI} from "../../../context/order/OrderAction";
import useQueryParams from "../../../hooks/useQueryParams";
import Radio from "../../../component/form/Radio";
import {formattedWithSeparator} from "../../../functions/math";
import Divider from "../../../component/Divider";
import SelectNumber from "../../../component/form/SelectNumber";
import {FaRegTrashAlt} from "react-icons/fa";
import {PrimaryButton} from "../../../component/MyButton";
import {noSec} from "../../../functions/date";
import {CardWithTitle} from "../../../component/Card";


export const Complete = () => {
    const {auth, setAlertModal, setIsLoading, isLoading, warning} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const [data, setData] = useState({});

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '訂單', href: '/member/order', current: false },
        { name: '成功', href: '/member/complete', current: true },
    ]

    let {order_no} = useQueryParams()
    //console.info(order_no);


    const getOne = async (accessToken, token, scenario) => {
        let data = await getOneAPI(accessToken, token, scenario);
        console.info(data);
        if (data.status === 200) {
            data = data.data;
            setData(data);
            setImBusy(false);
        } else {
            var msgs = "";
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs += msg + "\n"
            }
            warning(msgs);
        }
    }

    useEffect(() => {
        setIsLoading(true)
        getOne(auth.accessToken, order_no, 'one')
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (isLoading || imBusy) { return <div className='text-MyWhite'>loading...</div>}
    else {
        return (
            <div className="mx-auto max-w-7xl text-MyWhite">
                <main className="isolate px-1">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">完成訂單 !</h2>

                    <CardWithTitle title='訂單資訊' mainClassName='mb-6'>
                        <div
                            className='flex flex-row items-center justify-between mb-2'>
                            <span>訂單編號：{data.order_no}</span>
                            <div className='flex flex-row items-center gap-4'>
                                <span className='text-xs mr-2'>總額：NT$</span>
                                <span
                                    className='text-xl text-Warning-400'>{formattedWithSeparator(data.grand_total)}</span>
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-between mb-2'>
                            <span>訂單日期：{noSec(data.created_at, true)}</span>
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span>付款方式：{data.gateway.method_show}</span>
                            <span>到貨方式：{data.shipping.method_show}</span>
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='訂購者' mainClassName='mb-6'>
                        <div className='flex flex-row items-center justify-between'>
                            <span>訂購者：{data.order_name}</span>
                            <span>email：{data.order_email}</span>
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span>電話：{data.order_tel}</span>
                            <span>住址：{data.order_address}</span>
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='商品' mainClassName='mb-6'>
                        {data.items.map((row, idx) =>
                            <div key={row.id} className=''>
                                <div className='flex flex-row items-center gap-4 mb-4 pb-4'>
                                    <div className="w-[100px] xl:w-[200px] lg:mr-4">
                                        <img src={row.product_featured} alt={row.product_name}/>
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <div className='mb-2'>{row.product_name}</div>
                                        <div className='flex flex-row gap-4 justify-between items-center mb-2'>
                                            <div className='text-xs mr-2'>單價：<span
                                                className='text-Warning-400'>${formattedWithSeparator(row.sell_price)}</span>
                                            </div>
                                            <div className='lg:mr-6 text-xs'>
                                                x{row.quantity}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <span className='text-xs'>總價：</span>
                                            <span
                                                className='text-Warning-400'>${formattedWithSeparator(row.total_amount)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Divider text='分隔線' textColor='PrimaryBlock-400'
                                         textSize='lg:text-base text-xs'/>
                            </div>
                        )}
                    </CardWithTitle>
                    <CardWithTitle title='發票' mainClassName='mb-6'>
                        <div className='flex flex-row items-center justify-between'>
                            <span>訂購者：{data.order_name}</span>
                            <span>email：{data.order_email}</span>
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span>電話：{data.order_tel}</span>
                            <span>住址：{data.order_address}</span>
                        </div>
                    </CardWithTitle>

                </main>
            </div>
        );
    }
};