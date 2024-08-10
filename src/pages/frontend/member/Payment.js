import React, {useContext, useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../layout/Breadcrumb';
import { deleteOneAPI, deleteItemAPI, updateQuantityAPI } from '../../../context/cart/CartAction';
import useQueryParams from '../../../hooks/useQueryParams';
import {Pagination} from '../../../component/Pagination';
import { formattedWithSeparator } from '../../../functions/math';
import { noSec } from '../../../functions/date';
import SelectNumber from '../../../component/form/SelectNumber';
import { FaRegTrashAlt } from "react-icons/fa";
import Divider from '../../../component/Divider';
import { PrimaryButton } from '../../../component/MyButton';
import {getOrderToNewebpayAPI} from '../../../context/order/OrderAction';
import { getCartNotExistError, CARTNOTEXIST } from '../../../errors/OrderError';
import {getCartAPI} from "../../../context/member/MemberAction";
import {getPaymentAPI} from "../../../context/order/OrderAction";
import Radio from "../../../component/form/Radio";


export default function Payment() {
    const {auth, setIsLoading, setAlertModal, isLoading, warning} = useContext(BMContext);
    const {accessToken} = auth;
    const [imBusy, setImBusy] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    // for cart
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [grandTotal, setGrandTotal] = useState(0);

    // for payment
    const [gatways, setGateways] = useState([]);
    const [shippings, setShippings] = useState([]);

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '購物車', href: '/member/cart', current: false },
        { name: '結帳', href: '/member/payment', current: true },
    ];

    const [newebpay, setNewebpay] = useState({
        MerchantID: 0,
        TradeInfo: '',
        TradeSha: '',
        Version: 2.0,
        url: ''
    });

    const [isSubmit, setIsSubmit] = useState(false);

    const orderFormRef = useRef("form");

    const getData = async (accessToken) => {
        //const data = await getCartAPI(accessToken, page, perpage);
        var data = await getPaymentAPI();
        console.info(data);

        const initGateways = [];
        for (const key in data.gateways) {
            const item = {key: key, text: data.gateways[key], value: key, active: false}
            initGateways.push(item);
        }
        setGateways(initGateways);

        const initShippings = [];
        for (const key in data.shippings) {
            const item = {key: key, text: data.shippings[key], value: key, active: false}
            initShippings.push(item);
        }
        setShippings(initShippings);

        data = await getCartAPI(accessToken, 1, 20);
        console.info(data);
        if (!Object.hasOwn(data.data, 'items')) {
            setIsEmpty(true);
        } else {
            const grand_total = data.data.items.reduce((acc, row) => acc + row.total_amount, 0);
            setGrandTotal(grand_total);
            setRows(data.data.items);
            const meta = data.data._meta;
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            setMeta(meta);
        }

        setImBusy(false);
    }

    useEffect(() => {
        if (!isLoading && !isSubmit) {
            console.info("aaa");
            setIsLoading(true)
            getData(accessToken)
            setIsLoading(false)
        }

        if (!isLoading && isSubmit) {
            const form = orderFormRef.current;
            //console.info(form);
            form.submit();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSubmit]);

    const handleCheckout = async () => {
        var isPass = true;
        const gateway = gatways.filter(item => item.active === true);
        if (gateway.length === 0) {
            isPass = false;
            warning("請先選擇付款方式");
        }
        const shipping = shippings.filter(item => item.active === true);
        if (shipping.length === 0) {
            isPass = false;
            warning("請先選擇到貨方式")
        }

        if (isPass) {
            var data = await getOrderToNewebpayAPI(auth.accessToken, gateway[0].value, shipping[0].value);
            console.info(data);
            if (data.status === 200) {
                setNewebpay({
                    MerchantID: data.data.formData.MerchantID,
                    TradeInfo: data.data.formData.TradeInfo,
                    TradeSha: data.data.formData.TradeSha,
                    Version: data.data.formData.Version,
                    url: data.data.url
                });

                setIsSubmit(true);
                //console.info(data.data);
                // const form = document.createElement("form");
                // form.method = "POST";
                // form.action = data.data.url;
                // for (const key in data.data.formData) {
                //     const hiddenField = document.createElement('input');
                //     hiddenField.type = 'hidden';
                //     hiddenField.name = key;
                //     hiddenField.value = data.data.formData[key];
                //     form.appendChild(hiddenField);
                // }
                // document.body.appendChild(form);
                // form.submit();

                // const formData = new FormData();
                // formData.append("MerchantID", data.data.MerchantID);
                // formData.append("TradeInfo", data.data.TradeInfo);
                // formData.append("TradeSha", data.data.TradeSha);
                // formData.append("Version", data.data.Version);
                // fetch(data.data.url, {
                //     method: "POST",
                //     body: formData
                // });
            } else {
                //data = data.data;
                var message = "";
                for (let i = 0; i < data["message"].length; i++) {
                    message += data["message"][i].message;
                }
                warning(message);
            }
        }
    }

    // if (isSubmit) {
    //     setTimeout(function() {
    //         const form = orderFormRef.current;
    //         //console.info(form);
    //         form.submit();
    //     }, 500)
    // }

    if (isLoading || imBusy) { return <div className="text-MyWhite">loading</div>}
    else {
        return (
            <div>
                <div className="mx-auto max-w-7xl">
                    <main className="isolate px-1">
                        <Breadcrumb items={breadcrumbs}/>
                        <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">結帳</h2>
                        {(isEmpty) ? <div className='flex justify-center text-xl font-bold text-MyWhite'>購物車中無商品</div>
                        :<>
                        <div
                            className='flex flex-row items-center justify-end bg-blockColor mx-4 my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                            <PrimaryButton type="button" className="lg:w-60 mr-4"
                                           onClick={handleCheckout}>付款</PrimaryButton>
                            <span className='text-xs mr-2'>總額：NT$</span>
                            <span className='text-xl text-Warning-400'>{formattedWithSeparator(grandTotal)}</span>
                        </div>

                        <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                            <div className="">
                                <Radio
                                    label="付款方式"
                                    id="gateway"
                                    items={gatways}
                                    setChecked={setGateways}
                                />
                            </div>
                            <div className="mt-12">
                                <Radio
                                    label="到貨方式"
                                    id="shipping"
                                    items={shippings}
                                    setChecked={setShippings}
                                />
                            </div>

                            <div className="mt-12">
                                {rows.map((row, idx) =>
                                    <div key={row.id} className='py-4 lg:p-4 text-white flex flex-row gap-2 mb-4 pb-4 items-center'>
                                        <div className="w-[50px] xl:w-[100px] lg:mr-4">
                                            <img src={row.product_featured} alt={row.product_name}/>
                                        </div>
                                        <div className='lg:mr-4'>{row.product_name}</div>
                                        <div className='flex items-center'>
                                            <span className='text-xs mr-2'>總額：NT$</span>
                                            <span
                                                className='text-xl text-Warning-400'>{formattedWithSeparator(row.total_amount)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        </>
                        }
                    </main>
                </div>
                {isSubmit ?
                    <form action="https://ccore.newebpay.com/MPG/mpg_gateway" method='post' ref={orderFormRef}>
                        <input type='hidden' name='MerchantID' value={newebpay.MerchantID} />
                        <input type='hidden' name='TradeInfo' value={newebpay.TradeInfo} />
                        <input type='hidden' name='TradeSha' value={newebpay.TradeSha} />
                        <input type='hidden' name='Version' value={newebpay.Version} />
                    </form>
                    : <div></div>
                }
            </div>
        )
    }
}