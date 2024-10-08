import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import BMContext from "../../../context/BMContext";
import {getOneAPI} from "../../../context/order/OrderAction";
import Breadcrumb from "../../../layout/Breadcrumb";
import {CardWithTitle} from "../../../component/Card";
import {formattedWithSeparator} from "../../../functions/math";
import {noSec} from "../../../functions/date";
import Divider from "../../../component/Divider";
import * as Icons from "react-icons/fa";

const OrderShow = () => {
    const {auth, setIsLoading, isLoading, warning} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const [data, setData] = useState({});
    const {token} = useParams();

    const initBreadcrumb = [
        {name: '會員', href: '/member', current: false},
        {name: '訂單', href: '/member/order', current: false},
    ];

    const [breadcrumb, setBreadcrumb] = useState(initBreadcrumb)

    const getOne = async (accessToken, token, scenario) => {
        let data = await getOneAPI(accessToken, token, scenario);
        console.info(data);
        if (data.status === 200) {
            data = data.data;
            setData(data);
            setBreadcrumb((prev) => [...prev, {name: data.order_no, href: '', current: true}]);
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
        getOne(auth.accessToken, token, 'one')
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const process_active_color = 'MyWhite';
    const process_unactive_color = 'gray-500';

    const ProcessBlock = ({text, time, side='left'}) => {
        return (
            <div
                className={`w-1/2 mt-3 mb-4 flex ${side === 'left' ? 'justify-end pe-2 lg:pe-4' : 'justify-start ps-2 lg:ps-4'}`}>
                <div className={`flex flex-col flex-grow lg:flex-grow-0 py-4 px-2 border-t-2 lg:w-1/2 ${side === 'left' ? 'text-right' : 'text-left'} ${time ? 'border-t-gray-100 bg-MyBlack' : 'border-t-gray-500 bg-PrimaryBlock-950'}`}>
                    <div
                        className={`text-base md:text-lg mb-1 ${time ? 'font-bold text-' + process_active_color : 'font-normal text-' + process_unactive_color}`}>
                        {text}
                    </div>
                    <time
                        className="mb-1 text-xs md:text-base font-normal text-gray-400 sm:order-last sm:mb-0">{time}</time>
                </div>
            </div>
        )
    }

    const ProcessIcon = ({icon, time}) => {
        const className = 'w-4 h-4 ' + ((time !== null) ? 'text-MyBlack' : 'text-gray-600');
        return React.createElement(Icons[icon], {className: className});
    }

    if (isLoading || imBusy) {
        return <div className='text-MyWhite'>loading...</div>
    } else {
        return (
            <div className="mx-auto max-w-7xl text-MyWhite">
                <main className="isolate px-1">
                    <Breadcrumb items={breadcrumb}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">訂單{data.order_no}</h2>

                    <CardWithTitle title='訂單流程' mainClassName='my-6'>
                        <ul className="relative border-gray-200 dark:border-gray-700 my-4 mx-auto">
                            {data.processes.map((process, idx) => (
                                <li key={process.key} className='flex flex-row min-h-[110px]' title={process.text}>
                                    {idx % 2 === 0 ?
                                        <div className='block w-1/2'></div>
                                        :
                                        <ProcessBlock text={process.text} time={process.time} />
                                    }
                                    <div
                                        className="flex flex-col !items-center">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${process.time ? 'bg-' + process_active_color : 'bg-' + process_unactive_color}`}>
                                            <ProcessIcon icon={process.icon} time={process.time} />
                                        </span>
                                        {idx < data.processes.length - 1 ?
                                            <div className={`w-0.5 grow ${process.time ? 'bg-' + process_active_color : 'bg-' + process_unactive_color}`}></div>
                                            : ''
                                        }
                                    </div>
                                    {idx % 2 === 1 ?
                                        <div className='block w-1/2'></div>
                                        :
                                        <ProcessBlock text={process.text} time={process.time} side='right' />
                                    }
                                </li>
                            ))}
                        </ul>
                    </CardWithTitle>

                    {data.gateway.method === 'remit' ?
                        <CardWithTitle title='匯款資訊' mainClassName='mb-6'>
                            <div
                                className='flex flex-col gap-2 mb-2'>
                                <div>銀行：{data.remit.bank}</div>
                                <div>分行：{data.remit.branch}</div>
                                <div>匯款帳戶：{data.remit.name}</div>
                                <div>銀行代碼：{data.remit.code}</div>
                                <div>匯款帳號：{data.remit.account}</div>
                            </div>
                        </CardWithTitle>
                        : ''
                    }

                    {data.gateway.method === 'store_cvs' && data.gateway.process === 'code' ?
                        <CardWithTitle title='超商繳款資訊' mainClassName='mb-6'>
                            <div
                                className='flex flex-col gap-2 mb-2'>
                                <div className='flex flex-row items-center'>繳款編號：<div className='text-5xl text-MyWhite flex flex-row items-center'>{data.gateway.payment_no}</div></div>
                                <div>到期時間：{data.gateway.expire_at}</div>
                            </div>
                        </CardWithTitle>
                        : ''
                    }

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
                            <span className='text-Primary-300'>付款方式：{data.gateway.method_show}</span>
                            <span className='text-Primary-300'>到貨方式：{data.shipping.method_show}</span>
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='訂購者' mainClassName='mb-6'>
                        <div className='flex flex-row items-center justify-between'>
                            <span>訂購者：{auth.name}</span>
                            <span>email：{auth.email}</span>
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span>電話：{auth.mobile}</span>
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='收貨者' mainClassName='mb-6'>
                        <div className='flex flex-row items-center justify-between'>
                            <span>收貨者：{data.order_name}</span>
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
                    <CardWithTitle title={`發票 (${data.invoice_type === 'personal' ? "個人" : "公司"})`} mainClassName='mb-6'>
                        <div className='flex flex-row items-center justify-between'>
                            <span className='mb-4'>訂購者：{data.order_name}</span>
                            <span>email：{data.order_email}</span>
                        </div>
                        <div className='flex flex-row items-center justify-between'>
                            <span className='mb-4'>電話：{data.order_tel}</span>
                            <span>住址：{data.order_address}</span>
                        </div>
                        {data.invoice_type === 'company' ?
                            <div className='flex flex-row items-center justify-between'>
                                <span className='mb-4'>公司名稱：{data.invoice_company_name}</span>
                                <span className=''>公司統編：{data.invoice_company_tax}</span>
                            </div> : ''
                        }
                        <div className='flex flex-row items-center justify-between'>
                            <span className='mb-4'>發票號碼：{data.invoice_no}</span>
                            <span>開立時間：{data.invoice_at}</span>
                        </div>
                    </CardWithTitle>

                </main>
            </div>
    );
    }
};

export default OrderShow;