import React, {useContext, useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../layout/Breadcrumb';
import { formattedWithSeparator } from '../../../functions/math';
import { PrimaryButton } from '../../../component/MyButton';
import {getOrderToNewebpayAPI} from '../../../context/order/OrderAction';
import {
    getOrderAreaEmptyError,
    getOrderCityEmptyError,
    getOrderEmailEmptyError,
    getOrderNameEmptyError, getOrderRoadEmptyError,
    getOrderTelEmptyError
} from '../../../errors/OrderError';
import {getCartAPI} from "../../../context/member/MemberAction";
import {getCheckoutAPI} from "../../../context/order/OrderAction";
import Radio from "../../../component/form/Radio";
import Input from "../../../component/form/Input";
import SelectCity from "../../../component/form/SelectCity";
import {citys, areas} from "../../../zone";
import SelectArea from "../../../component/form/SelectArea";
import {CardWithTitle} from "../../../component/Card";


export default function Checkout() {
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

    const initFormData = {
        gateway: '',
        shipping: '',
        order_name: auth.name,
        order_tel: auth.mobile,
        order_email: auth.email,
        order_city: auth.city_id,
        order_area: auth.area_id,
        order_road: auth.road,
        memo: '',
        invoice_type: 'personal',
        invoice_email: auth.email,
        invoice_company_name: '',
        invoice_company_tax: '',
    }
    const [formData, setFormData] = useState(initFormData);
    const [errorMsgs, setErrorMsgs] = useState({
        'order_name': '',
        'order_tel': '',
        'order_email': '',
        'order_city': '',
        'order_area': '',
        'order_road': '',
    });
    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas)


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
        var data = await getCheckoutAPI();
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
        // 當縣市id有改變時，要產生該縣市的區域
        if (formData.order_city > 0 && formData.order_area > 0) {
            setAreaFromCity(formData.order_city)
        }

        if (!isLoading && !isSubmit) {
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
        var params = {}
        var isPass = true;
        // const gateway = gatways.filter(item => item.active === true);
        // if (gateway.length === 0) {
        //     isPass = false;
        //     warning("請先選擇付款方式");
        // }
        // const shipping = shippings.filter(item => item.active === true);
        // if (shipping.length === 0) {
        //     isPass = false;
        //     warning("請先選擇到貨方式")
        // }
        //params = {...params, {gateway: gateway[0].value, shipping: shipping[0].value}};
        if (formData.order_name.trim().length === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_name: getOrderNameEmptyError().msg}
            ));
            isPass = false
        }

        if (formData.order_tel.trim().length === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_tel: getOrderTelEmptyError().msg}
            ));
            isPass = false
        }

        if (formData.order_email.trim().length === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_email: getOrderEmailEmptyError().msg}
            ));
            isPass = false
        }

        if (formData.order_city === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_city: getOrderCityEmptyError().msg}
            ));
            isPass = false
        }

        if (formData.order_area.trim().length === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_area: getOrderAreaEmptyError().msg}
            ));
            isPass = false
        }

        if (formData.order_road.trim().length === 0) {
            setErrorMsgs((prev) => (
                {...prev, order_road: getOrderRoadEmptyError().msg}
            ));
            isPass = false
        }



        if (isPass) {
            var data = await getOrderToNewebpayAPI(auth.accessToken, params);
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

    function setAreaFromCity(city) {
        //將區域的值放入selectedAreas
        selectedAreas = [{city: 0, id: 0, name: "無"}]
        for (var i = 0; i < areas.length; i++) {
            const area = areas[i]
            if (parseInt(area.city) === parseInt(city)) {
                selectedAreas.push(area)
            }
        }
        setCityAreas(selectedAreas)
    }
    const onChange = (e) => {
        //console.info(e.target.id);
        if (e.target.id === 'order_city') {
            setAreaFromCity(parseInt(e.target.value));
        } else {
            setFormData((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
            setErrorMsgs((prev) => ({
                ...prev, [e.target.id]: ''
            }));
        }
    }

    const handleClear = (id) => {
        const e = {target: {id: id, value: ''}};
        onChange(e);
    }

    if (isLoading || imBusy) { return <div className="text-MyWhite">loading</div>}
    else {
        return (
            <div>
                <div className="mx-auto max-w-7xl">
                    <main className="isolate px-1">
                        <Breadcrumb items={breadcrumbs}/>
                        <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">結帳</h2>
                        {(isEmpty) ?
                            <div className='flex justify-center text-xl font-bold text-MyWhite'>購物車中無商品</div>
                            :

                            <div className="w-full bg-Menu border border-PrimaryBlock-800 px-2 lg:p-6 rounded-lg">
                                <div
                                    className='flex flex-row items-center justify-end bg-blockColor my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                                    <PrimaryButton type="button" className="lg:w-60 mr-4"
                                                   onClick={handleCheckout}>付款</PrimaryButton>
                                    <span className='text-xs mr-2'>總額：NT$</span>
                                    <span
                                        className='text-xl text-Warning-400'>{formattedWithSeparator(grandTotal)}</span>
                                </div>
                                <CardWithTitle title='付款與到貨方式' mainClassName='mb-6'>
                                    <div className="">
                                        <Radio
                                            label="付款方式"
                                            id="gateway"
                                            items={gatways}
                                            setChecked={setGateways}
                                            setStatus={setFormData}
                                            isIcon={true}
                                        />
                                    </div>
                                    <div className="my-12">
                                        <Radio
                                            label="到貨方式"
                                            id="shipping"
                                            items={shippings}
                                            setChecked={setShippings}
                                            setStatus={setFormData}
                                        />
                                    </div>
                                </CardWithTitle>
                                <CardWithTitle title='收貨資訊' mainClassName='mb-6'>
                                    <div className='grid sm:grid-cols-2 gap-4 my-12'>
                                        <div className=''>
                                            <Input
                                                label="收貨者"
                                                type="text"
                                                name="order_name"
                                                value={formData.order_name || ''}
                                                id="order_name"
                                                placeholder="王大明"
                                                errorMsg={errorMsgs.order_name}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                        <div className=''>
                                            <Input
                                                label="聯絡電話"
                                                type="number"
                                                name="order_tel"
                                                value={formData.order_tel || ''}
                                                id="order_tel"
                                                placeholder="0988234345"
                                                errorMsg={errorMsgs.order_tel}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                        <div className='sm:col-span-2'>
                                            <Input
                                                label="聯絡email"
                                                type="text"
                                                name="order_email"
                                                value={formData.order_email || ''}
                                                id="order_tel"
                                                placeholder="david@gmail.com"
                                                errorMsg={errorMsgs.order_email}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                        <div className=''>
                                            <SelectCity
                                                citys={citys}
                                                id="order_city"
                                                value={formData.order_city || 0}
                                                errorMsg={errorMsgs.order_city}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                        <div className=''>
                                            <SelectArea
                                                areas={cityAreas}
                                                id="order_area"
                                                value={formData.order_area || 0}
                                                errorMsg={errorMsgs.order_area}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                        <div className='sm:col-span-2'>
                                            <Input
                                                label="路名、街道巷弄等"
                                                type="text"
                                                name="order_road"
                                                value={formData.order_road || ''}
                                                id="order_road"
                                                placeholder="中正路50號6F"
                                                errorMsg={errorMsgs.order_road}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                    </div>
                                </CardWithTitle>
                                <CardWithTitle title='收貨資訊' mainClassName='mb-6'>

                                </CardWithTitle>
                                <CardWithTitle title='商品' mainClassName='mb-6'>
                                    <div className="mt-12">
                                        {rows.map((row, idx) =>
                                            <div key={row.id}
                                                 className='py-4 lg:p-4 text-white flex flex-row gap-2 mb-4 pb-4 items-center'>
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
                                </CardWithTitle>
                                <div
                                    className='flex flex-row items-center justify-end bg-blockColor my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                                    <PrimaryButton type="button" className="lg:w-60 mr-4"
                                                   onClick={handleCheckout}>付款</PrimaryButton>
                                    <span className='text-xs mr-2'>總額：NT$</span>
                                    <span
                                        className='text-xl text-Warning-400'>{formattedWithSeparator(grandTotal)}</span>
                                </div>
                            </div>
                        }
                    </main>
                </div>
                {isSubmit ?
                    <form action="https://ccore.newebpay.com/MPG/mpg_gateway" method='post' ref={orderFormRef}>
                        <input type='hidden' name='MerchantID' value={newebpay.MerchantID}/>
                        <input type='hidden' name='TradeInfo' value={newebpay.TradeInfo}/>
                        <input type='hidden' name='TradeSha' value={newebpay.TradeSha}/>
                        <input type='hidden' name='Version' value={newebpay.Version}/>
                    </form>
                    : <div></div>
                }
            </div>
        )
    }
}