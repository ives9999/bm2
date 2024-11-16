import React, {useContext, useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import BMContext from '../../../context/BMContext';
import Breadcrumb from '../../../component/Breadcrumb';
import {formattedWithSeparator} from '../../../functions/math';
import {PrimaryButton} from '../../../component/MyButton';
import {postOrderToNewebpayAPI, getOneAPI} from '../../../context/order/OrderAction';
import {
    getGatewayMethodEmptyError,
    getInvoiceCompanyEmptyError, getInvoiceEmailEmptyError, getInvoiceTaxEmptyError, getInvoiceTypeEmptyError,
    getOrderAreaEmptyError,
    getOrderCityEmptyError,
    getOrderEmailEmptyError,
    getOrderNameEmptyError, getOrderRoadEmptyError,
    getOrderTelEmptyError, getShippingMethodEmptyError
} from '../../../errors/OrderError';
import {getCartAPI} from "../../../context/member/MemberAction";
import {getCheckoutAPI} from "../../../context/order/OrderAction";
import Radio from "../../../component/form/Radio";
import Input from "../../../component/form/Input";
import SelectCity from "../../../component/form/SelectCity";
import {citys, areas} from "../../../zone";
import SelectArea from "../../../component/form/SelectArea";
import {CardWithTitle} from "../../../component/Card";
import {useSpring, animated} from "@react-spring/web";

import Validate from "../../../functions/validate"
import {empty} from "../../../functions/other";
import {toLogin} from "../../../context/to";

export default function Checkout() {
    const {auth, setIsLoading, setAlertModal, isLoading, warning} = useContext(BMContext);
    const navigate = useNavigate();
    const {accessToken} = auth;
    const [imBusy, setImBusy] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const {token} = useParams();
    //console.info(token);

    // for cart
    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    // for order checkout
    const [orderData, setOrderData] = useState({});
    // for payment
    const [gatways, setGateways] = useState([]);
    const [shippings, setShippings] = useState([]);

    const initFormData = {
        gateway_method: '',
        shipping_method: '',
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
        isPush: true,
    }
    const [formData, setFormData] = useState(initFormData);
    const [errorMsgs, setErrorMsgs] = useState({
        'gateway_method': '',
        'shipping_method': '',
        'order_name': '',
        'order_tel': '',
        'order_email': '',
        'order_city': '',
        'order_area': '',
        'order_road': '',
        'invoice_type': '',
        'invoice_email': '',
        'invoice_company_name': '',
        'invoice_company_tax': '',
    });
    const props = useSpring({
        from: formData.invoice_type === 'personal' ? {y: 0, opacity: 0} : 0,
        to: formData.invoice_type === 'company' ? {y: 300, opacity: 1} : 0,
        config: {duration: 1000},
    })
    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas);
    const [invoiceType, setInvoiceType] = useState([]);


    const breadcrumbs = [
        {name: '會員', href: '/member', current: false},
        {name: '購物車', href: '/member/cart', current: false},
        {name: '結帳', href: '/member/payment', current: true},
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
        if (empty(auth.email) || empty(auth.city_id) || empty(auth.area_id) || empty(auth.road)) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "您註冊資料不完整，請先註冊聯絡資料再進行結帳",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: navigate('/member/contactData')
            });
            setImBusy(false);
            return;
        }

        const validate = {
            email: 1,
            mobile: 2
        }
        console.info(auth.validate);
        if ((auth.validate & validate.email) === 0) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "您還未通過email認證，請先通過再進行結帳",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: navigate('/member/validate/email')
            });
            setImBusy(false);
            return;
        }
        if ((auth.validate & validate.mobile) === 0) {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "您還未通過手機認證，請先通過再進行結帳",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: navigate('/member/validate/mobile')
            });
            setImBusy(false);
            return;
        }

        //const data = await getCartAPI(accessToken, page, perpage);
        // 取得付款方式跟配送方式的所有選項
        var orderData = null;
        if (token) {
            orderData = await getOneAPI(accessToken, token, 'one');
            orderData = orderData.data;
            //setOrderData(data.data);
        }
        var data = await getCheckoutAPI();
        //console.info(data);

        var invoiceTypes = [];
        data.invoiceTypes.forEach((invoiceType) => {
            const active = invoiceType.key === 'personal';
            const tmp = {...invoiceType, active: active};
            invoiceTypes.push(tmp);
        });

        setInvoiceType(invoiceTypes);

        const initGateways = [];
        for (const key in data.gateways) {
            var active = false;
            if (orderData !== null) {
                active = (key === orderData.gateway.method);
            }
            const item = {key: key, text: data.gateways[key], value: key, active: active}
            initGateways.push(item);
            if (active) {
                setFormData((prev) => {
                    return {...prev, ...{gateway_method: key}};
                })
            }
        }
        setGateways(initGateways);

        const initShippings = [];
        for (const key in data.shippings) {
            var active = false;
            if (orderData !== null) {
                active = (key === orderData.shipping.method);
            }
            const item = {key: key, text: data.shippings[key], value: key, active: active}
            initShippings.push(item);
            if (active) {
                setFormData((prev) => {
                    return {...prev, ...{shipping_method: key}};
                })
            }
        }
        setShippings(initShippings);

        if (!token) {
            data = await getCartAPI(accessToken, 1, 20);
            data = data.data
            //console.info(data);
        } else {
            data = orderData
        }
        if (!Object.hasOwn(data, 'items')) {
            setIsEmpty(true);
        } else {
            const grand_total = data.items.reduce((acc, row) => acc + row.total_amount, 0);
            setGrandTotal(grand_total);
            setRows(data.items);
            //const meta = data.data.meta;
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            //setMeta(meta);
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
        //var params = {}
        const rules = [
            ['gateway_method', 'required', {message: getGatewayMethodEmptyError().msg}],
            ['shipping_method', 'required', {message: getShippingMethodEmptyError().msg}],
            ['order_name', 'required', {message: getOrderNameEmptyError().msg}],
            ['order_email', 'required', {message: getOrderEmailEmptyError().msg}],
            ['order_tel', 'required', {message: getOrderTelEmptyError().msg}],
            ['order_city', 'required', {message: getOrderCityEmptyError().msg}],
            ['order_area', 'required', {message: getOrderAreaEmptyError().msg}],
            ['order_road', 'required', {message: getOrderRoadEmptyError().msg}],
            ['invoice_type', 'required', {message: getInvoiceTypeEmptyError().msg}],
            ['invoice_email', 'required', {message: getInvoiceEmailEmptyError().msg}],
            ['invoice_company_name', 'required', {
                'when': () => {
                    return formData.invoice_type === 'company';
                }
            }, {message: getInvoiceCompanyEmptyError().msg}],
            ['invoice_company_tax', 'required', {
                'when': () => {
                    return formData.invoice_type === 'company';
                }
            }, {message: getInvoiceTaxEmptyError().msg}],
        ];

        var validate = new Validate(formData, rules);
        const isPass = validate.validate();
        if (!isPass) {
            //console.info(validate.errors);
            validate.showErrors(setErrorMsgs);
        }

        if (isPass) {
            console.info(formData);
            var data = await postOrderToNewebpayAPI(auth.accessToken, formData);
            console.info(data);
            if (data.status === 200) {
                if (data.data.gateway_method === 'remit' || data.data.gateway_method === 'cash') {
                    navigate('/member/order/show/' + data.data.token);
                } else {
                    setNewebpay({
                        MerchantID: data.data.formData.MerchantID,
                        TradeInfo: data.data.formData.TradeInfo,
                        TradeSha: data.data.formData.TradeSha,
                        Version: data.data.formData.Version,
                        url: data.data.url
                    });
                }

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
                var messages = [];
                Object.keys(data['message']).forEach((key) => {
                    //console.info(key);
                    // 如果錯誤是發生在輸入項當中，就用輸入項的錯誤來顯示
                    if (key in errorMsgs) {
                        setErrorMsgs((prev) => ({
                            ...prev, [key]: data['message'][key]
                        }));
                        // 如果錯誤不是發生在輸入項當中，就用錯誤對話盒來顯示
                    } else {
                        messages.push(data['message'][key]);
                    }
                })
                if (messages.length > 0) {
                    warning(messages);
                }
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
        if (e.target.id === 'order_city') {
            setFormData((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
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

    if (isLoading || imBusy) {
        return <div className="text-MyWhite">loading</div>
    } else {
        return (
            <div>
                <div className="mx-auto max-w-7xl">
                    <main className="isolate px-1">
                        <Breadcrumb items={breadcrumbs}/>
                        <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">結帳</h2>
                        {(isEmpty) ?
                            <div className='flex justify-center text-xl font-bold text-MyWhite'>無此訂單</div>
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
                                            id="gateway_method"
                                            items={gatways}
                                            setChecked={setGateways}
                                            setStatus={setFormData}
                                            isRequired={true}
                                            errorMsg={errorMsgs.gateway_method}
                                            isIcon={false}
                                        />
                                    </div>
                                    <div className="my-12">
                                        <Radio
                                            label="到貨方式"
                                            id="shipping_method"
                                            items={shippings}
                                            setChecked={setShippings}
                                            setStatus={setFormData}
                                            isRequired={false}
                                            errorMsg={errorMsgs.shipping_method}
                                        />
                                    </div>
                                </CardWithTitle>
                                <CardWithTitle title='訂購者資訊' mainClassName='mb-6'>
                                    <div className='grid sm:grid-cols-2 gap-4 my-12'>
                                        <div className=''>姓名：<span className='text-MyWhite'>{auth.name}</span></div>
                                        <div className=''>電話：<span className='text-MyWhite'>{auth.mobile}</span></div>
                                        <div className=''>Email：<span className='text-MyWhite'>{auth.email}</span></div>
                                    </div>
                                </CardWithTitle>
                                <CardWithTitle title='收貨者資訊' mainClassName='mb-6'>
                                    <div className='grid sm:grid-cols-2 gap-4 my-12'>
                                        <div className=''>
                                            <Input
                                                label="姓名"
                                                type="text"
                                                name="order_name"
                                                value={formData.order_name || ''}
                                                id="order_name"
                                                placeholder="王大明"
                                                isRequired={true}
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
                                                isRequired={true}
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
                                                id="order_email"
                                                placeholder="david@gmail.com"
                                                isRequired={true}
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
                                                isRequired={true}
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
                                                isRequired={true}
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
                                                isRequired={true}
                                                errorMsg={errorMsgs.order_road}
                                                onChange={onChange}
                                                onClear={handleClear}
                                            />
                                        </div>
                                    </div>
                                </CardWithTitle>
                                <CardWithTitle title='備註' mainClassName='mb-6'>
                                    <Input
                                        label="備註"
                                        type="text"
                                        name="memo"
                                        value={formData.memo || ''}
                                        id="memo"
                                        placeholder="請於上班時間送達"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                </CardWithTitle>
                                {/*<CardWithTitle title='發票資訊' mainClassName='mb-6'>*/}
                                {/*    <div className='grid sm:grid-cols-2 gap-4 my-12'>*/}
                                {/*        <div className="mb-4">*/}
                                {/*            <Radio*/}
                                {/*                label="發票類型"*/}
                                {/*                id="invoice_type"*/}
                                {/*                items={invoiceType}*/}
                                {/*                setChecked={setInvoiceType}*/}
                                {/*                setStatus={setFormData}*/}
                                {/*                errorMsg={errorMsgs.invoice_type}*/}
                                {/*                isRequired={true}*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*        <div className=''>*/}
                                {/*            <Input*/}
                                {/*                label="發票寄送Email"*/}
                                {/*                type="text"*/}
                                {/*                name="invoice_email"*/}
                                {/*                value={formData.invoice_email || ''}*/}
                                {/*                id="invoice_email"*/}
                                {/*                placeholder="david@gmail.com"*/}
                                {/*                isRequired={true}*/}
                                {/*                errorMsg={errorMsgs.invoice_email}*/}
                                {/*                onChange={onChange}*/}
                                {/*                onClear={handleClear}*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*        <animated.div className='relative top-[-300px] left-0 opacity-0' style={props}>*/}
                                {/*            <Input*/}
                                {/*                label="公司名稱"*/}
                                {/*                type="text"*/}
                                {/*                name="invoice_company_name"*/}
                                {/*                value={formData.invoice_company_name || ''}*/}
                                {/*                id="invoice_company_name"*/}
                                {/*                placeholder="羽球密碼"*/}
                                {/*                isRequired={true}*/}
                                {/*                errorMsg={errorMsgs.invoice_company_name}*/}
                                {/*                onChange={onChange}*/}
                                {/*                onClear={handleClear}*/}
                                {/*            />*/}
                                {/*            <Input*/}
                                {/*                label="公司統編"*/}
                                {/*                type="text"*/}
                                {/*                name="invoice_company_tax"*/}
                                {/*                value={formData.invoice_company_tax || ''}*/}
                                {/*                id="invoice_company_tax"*/}
                                {/*                placeholder="53830194"*/}
                                {/*                isRequired={true}*/}
                                {/*                errorMsg={errorMsgs.invoice_company_tax}*/}
                                {/*                onChange={onChange}*/}
                                {/*                onClear={handleClear}*/}
                                {/*            />*/}
                                {/*        </animated.div>*/}
                                {/*    </div>*/}
                                {/*</CardWithTitle>*/}
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
                {
                    isSubmit ?
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