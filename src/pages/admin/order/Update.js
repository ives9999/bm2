import React, {useContext, useEffect, useReducer, useState} from 'react'
import BMContext from '../../../context/BMContext'
import {useNavigate, useParams} from 'react-router-dom'
import Breadcrumb from '../../../component/Breadcrumb'
import {getOneAPI, postUpdateAPI, postUpdateProcessAPI} from '../../../context/order/OrderAction'
import {getReadAPI} from '../../../context/member/MemberAction';
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import Radio from '../../../component/form/Radio'
import SearchBar from '../../../component/form/SearchBar'
import {DeleteButton, EditButton, PrimaryButton} from '../../../component/MyButton';
import {formattedWithSeparator} from '../../../functions/math'

import {
    GetOrderMaxBlankError,
    GetOrderMinBlankError,
    GetProductNameBlankError,
    GetUnitBlankError,
    ORDERMAXBLANK,
    ORDERMINBLANK,
    PRODUCTNAMEBLANK,
    UNITBLANK,
} from '../../../errors/ProductError'
import {INSERTFAIL} from '../../../errors/Error'
import Address from "../../../component/form/Address";
import {animated, useSpring} from "@react-spring/web";
import {FaCheck, FaXmark} from "react-icons/fa6";
import {collectErrorMsg} from "../../../functions";
import {
    GATEWAYMETHODEMPTY,
    getGatewayMethodEmptyError,
    getShippingMethodEmptyError,
    SHIPPINGMETHODEMPTY
} from "../../../errors/OrderError";
import {ImSpinner6} from "react-icons/im";

const initData = {
    // name: '球拍',
    // type: 'clothes',
    // order_min: 1,
    // order_max: 10,
    // gateway: 'coin',
    // shipping: 'direct',
    // status: 'offline',
    // unit: '件',
}

function UpdateOrder() {
    const {auth, setAlertModal, setIsLoading, isLoading, warning} = useContext(BMContext);
    const navigate = useNavigate()

    const [isGetOne, setIsGetOne] = useState(false);
    const {token} = useParams();
    const initBreadcrumb = [
        {name: '後台首頁', href: '/admin', current: false},
        {name: '訂單列表', href: '/admin/order', current: false},
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [tabs, setTabs] = useState([
        {key: 'data', name: '訂單資訊', to: 'data', active: true},
        {key: 'contact', name: '收貨人資料', to: 'contact', active: false},
        {key: 'invoice', name: '發票資訊', to: 'invoice', active: false},
        {key: 'product', name: '商品資料', to: 'product', active: false},
    ])
    const [formData, setFormData] = useState({});
    const [isMouseOverProcess, setIsMouseOverProcess] = useState([]);
    const [gatways, setGateways] = useState([]);
    const [shippings, setShippings] = useState([]);


    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        gatewayError: obj,
        shippingError: obj,
        nameError: obj,
        unitError: obj,
        orderMinError: obj,
        orderMaxError: obj,
    }

    const errorReducer = (state = initalError, action) => {
        var [newState, gatewayState, shippingState, nameState, unitState, orderMinState, orderMaxState] = [{}, {}, {}, {}, {}, {}, {}];
        switch (action.type) {
            case GATEWAYMETHODEMPTY:
                gatewayState = {code: GATEWAYMETHODEMPTY, message: getGatewayMethodEmptyError().msg}
                newState = {loading: false, gatewayError: gatewayState}
                return {...state, ...newState}
            case SHIPPINGMETHODEMPTY:
                shippingState = {code: SHIPPINGMETHODEMPTY, message: getShippingMethodEmptyError().msg}
                newState = {loading: false, shippingError: shippingState}
                return {...state, ...newState}
            case PRODUCTNAMEBLANK:
                nameState = {code: PRODUCTNAMEBLANK, message: GetProductNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case UNITBLANK:
                unitState = {code: UNITBLANK, message: GetUnitBlankError().msg}
                newState = {loading: false, unitError: unitState}
                return {...state, ...newState}
            case ORDERMINBLANK:
                orderMinState = {code: ORDERMINBLANK, message: GetOrderMinBlankError().msg}
                newState = {loading: false, orderMinError: orderMinState}
                return {...state, ...newState}
            case ORDERMAXBLANK:
                orderMaxState = {code: ORDERMAXBLANK, message: GetOrderMaxBlankError().msg}
                newState = {loading: false, orderMaxError: orderMaxState}
                return {...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }

    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        // if (e.target.id === "member_id") {
        //     setMembers(prev => {
        //         return {...prev, isShowMembersList: false, list: []};
        //     });
        //     setFormData(prev => {
        //         return {...formData, member_nickname: e.target.value};
        //     });
        //     if (e.target.value.length > 0) {
        //         //if (e.target.value.length > 2) {
        //         fetchMembers(e.target.value);
        //         //}
        //     }
        // } else if (e.target.id === "sale_id") {
        //     setSales(prev => {
        //         return {...prev, isShowMembersList: false, list: []};
        //     });
        //     setFormData({...formData, sale_name: e.target.value});
        //     //if (e.target.value.length > 2) {
        //     fetchSales(e.target.value)
        //     //}
        // } else {
        //     //setIsLoading(true);
        //     setFormData({
        //         ...formData,
        //         [e.target.id]: e.target.value
        //     });
        //     clearError(e.target.id);
        // }
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        clearError(e.target.id);
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}));
        // if (id === "member_id") {
        //     var e = {target: {id: "member_nickname", value: ""}};
        //     onChange(e)
        //     e = {target: {id: "member_id", value: ""}};
        //     onChange(e)
        //     //setFormData((prev) => ({...prev, ...{member_nickname: ""}}));
        //     setMembers({
        //         isShowMembersList: false,
        //         list: [],
        //     });
        // } else if (id === "sale_id") {
        //     e = {target: {id: "sale_name", value: ""}};
        //     onChange(e)
        //     e = {target: {id: "sale_id", value: ""}};
        //     onChange(e)
        //     //setFormData((prev) => ({...prev, ...{member_nickname: ""}}));
        //     setSales({
        //         isShowCashiersList: false,
        //         list: [],
        //     });
        // }
        clearError(id)
    }

    const clearError = (id) => {
        var error = {}
        if (id === 'name') {
            error = {nameError: {message: ''}}
        } else if (id === 'order_min') {
            error = {orderMinError: {message: ''}}
        } else if (id === 'order_max') {
            error = {orderMaxError: {message: ''}}
        } else if (id === 'unit') {
            error = {unitError: {message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }

    const [status, setStatus] = useState([]);
    const [invoiceType, setInvoiceType] = useState([]);

    const props = useSpring({
        from: formData.invoice_type === 'personal' ? {y: 0, opacity: 0} : 0,
        to: formData.invoice_type === 'company' ? {y: 300, opacity: 1} : 0,
        config: {duration: 1000},
    })

    const getOrder = async (k, currentPage, perpage) => {
        const params = {k: k};
        return await getReadAPI(auth.accessToken, currentPage, perpage, params);
    }

    const getSale = async (k, currentPage, perpage) => {
        const params = {k: k, isSale: true};
        return await getReadAPI(auth.accessToken, currentPage, perpage, params);
    }


    const getOne = async (accessToken, token, scenario) => {
        let active;
        let data = await getOneAPI(accessToken, token, scenario);
        data = data.data
        //console.info(data);
        if (scenario === 'create') {
            data = {...data, ...initData};
        }
        setBreadcrumbs(() => {
            const name = (data.order_no) ? data.order_no : '新增訂單';
            return [...initBreadcrumb, {name: name, href: '/admin/order/update', current: true}]
        })
        setFormData((prev) => {
            return {...prev, ...data}
        });


        var statuses = [];
        data.statuses.forEach((status) => {
            const active = data.status === status.value;
            const tmp = {...status, active: active};
            statuses.push(tmp);
        })
        //console.info(statuses);
        setStatus(statuses);
        //renderRadio(statuses, data.invoice_type, setStatus);

        const invoiceTypes = [];
        data.invoiceTypes.forEach((invoiceType) => {
            const active = data.invoice_type === invoiceType.value;
            const tmp = {...invoiceType, active: active};
            invoiceTypes.push(tmp);
        });
        setInvoiceType(invoiceTypes);

        setIsMouseOverProcess(() => {
            return data.processes.map(process => {return false});
        })

        const initGateways = [];
        for (const key in data.gateways) {
            active = false;
            active = (key === data.gateway.method);
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
            active = false;
            active = (key === data.shipping.method);
            const item = {key: key, text: data.shippings[key], value: key, active: active}
            initShippings.push(item);
            if (active) {
                setFormData((prev) => {
                    return {...prev, ...{shipping_method: key}};
                })
            }
        }
        setShippings(initShippings);

        setIsGetOne(true);
    }

    useEffect(() => {
        if (!isGetOne) {
            if (token !== undefined && token.length > 0) {
                getOne(auth.accessToken, token, 'update', true);
            } else {
                setFormData(initData);
                getOne(auth.accessToken, '', 'create');
                setBreadcrumbs((prev) => {
                    return [...prev, {name: '新增訂單', href: '/admin/order/update', current: true}]
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTab = (idx) => {
        // setTabs([
        //     {key: 'data', name: '基本資訊', to: 'data', active: false},
        //     {key: 'image', name: '圖片設定', to: 'image', active: false},
        //     {key: 'attribute', name: '屬性設定', to: 'attribute', active: false},
        //     {key: 'price', name: '價格設定', to: 'price', active: false},
        //     {key: 'ddtail', name: '詳細介紹', to: 'detail', active: true},
        // ])
        setTabs((prev) => {
            return prev.map((item, idx1) => {
                (idx === idx1) ? item.active = true : item.active = false
                return item
            })
        })
    }

    // 選擇訂購者列表的資料
    // const [members, setMembers] = useState({
    //     isShowMembersList: false,
    //     list: [],
    // })

    // 將選擇的會員填入formData中
    const setMember = (row) => {
        // setMembers({
        //     ...member, isShowMemberList: false,
        // })
        setFormData({
            ...formData,
            ...{member_id: row.id, member_nickname: row.nickname, member_token: row.token}
        })
    }

    // 用關鍵字從後台取得會員資料列表
    // const fetchMembers = async (k) => {
    //     //setIsLoading(true)
    //     const params = {k: k};
    //     const data = await getReadAPI(auth.accessToken, 1, 20, params);
    //
    //     setMembers({
    //         isShowMembersList: true,
    //         list: data.data.rows,
    //     })
    //     //setIsLoading(false)
    // }

    // 選擇訂購者列表的資料
    // const [sales, setSales] = useState({
    //     isShowSalesList: false,
    //     list: [],
    // })
    //
    // // 將選擇的會員填入formData中
    const setSale = (row) => {
        //console.info(row);
        setFormData({
            ...formData,
            sale_id: row.id
        });
        // setSales(prev => {
        //     return {...prev, isShowSalesList: false};
        // })
    }

    // 用關鍵字從後台取得會員資料列表
    // const fetchSales = async (k) => {
    //     //setIsLoading(true)
    //     const params = {isSale: true, k: k};
    //     const data = await getReadAPI(auth.accessToken, 1, 20, params);
    //     setSales({
    //         isShowSalesList: true,
    //         list: data.data.rows,
    //     })
    //     //setIsLoading(false)
    // }


    const onSubmit = async (e) => {
        e.preventDefault();

        let isPass = true
        // 偵測姓名沒有填的錯誤
        if (!isPass) {
            return
        }

        const postFormData = new FormData();
        Object.keys(formData).map(key => {
            if (key !== 'images' && key !== 'attributes' && key !== 'prices') {
                //console.info(key);
                let value = formData[key];
                if (key === 'gateway' || key === 'shipping' || key === 'items') {
                    value = JSON.stringify(value);
                    //console.info(value);
                }
                value = (value === null) ? '' : value
                postFormData.append(key, value);
            }
            return key
        });
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("order_token", token)
        }
        postFormData.delete('processes');
        postFormData.delete('process_show');
        postFormData.delete('channel');
        postFormData.delete('statuses');
        postFormData.delete('status_text');
        postFormData.delete('slug');
        postFormData.delete('pv');
        postFormData.delete('sort_order');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');
        postFormData.delete('all_invoice_type');
        postFormData.delete('invoice_type_show');
        postFormData.delete('invoiceTypes');
        postFormData.delete('gateways');
        postFormData.delete('shippings');
        postFormData.delete('remit');

        setIsLoading(true)
        //const gateway = postFormData.get('gateway');
        // Object.keys(gateway).forEach(key => {
        //     const value = gateway[key];
        //     console.info(key + "=>" + value);
        // })
        //console.info(JSON.stringify(gateway));
        //console.info(gateway);
        var object = {};
        postFormData.forEach((value, key) => object[key] = value);
        console.info(object);

        const data = await postUpdateAPI(auth.accessToken, postFormData)
        setIsLoading(false)

        //console.info(data)
        // 建立商品失敗
        if (data.status !== 200) {
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                dispatch({type: id})
            }

            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                const msg = data["message"][i].message

                //1.新增或修改資料庫時發生錯誤
                if (id === INSERTFAIL) {
                    setAlertModal({
                        modalType: 'warning',
                        modalTitle: '警告',
                        modalText: msg,
                        isModalShow: true,
                        isShowCancelButton: true,
                    })
                }
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                })
            }
        } else {
            const message = "恭喜您建立/修改訂單成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
                onOK: toGetOne,
                params: {data: data.data},
            }
            setAlertModal(obj)
        }
    }

    const toGetOne = (params) => {
        setFormData((prev) => {
            return {...prev, ...params.data}
        });
        //getOne(params.token, params.scenario);
    }

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    // 全選按鈕被按下
    const toggleChecked = (e) => {
        const checked = e.target.checked;
        let res = [];
        // if (checked) {
        //     rows.forEach((item) => {
        //         res.push(item.id);
        //     })
        // }
        // setIsCheck(res);
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
        //const token = params.token
        //setIsLoading(true)
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

    const toggleProcess = (idx) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定要更新訂單狀態？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onProcess,
            params: {idx: idx},
        });
    }

    const onProcess = async (params) => {
        const idx = params.idx;
        if (idx === 0) return;
        const processes = formData.processes[idx];
        const process = processes.value;
        const data = await postUpdateProcessAPI(auth.accessToken, formData.token, process);
        //console.info(data);
        if (data.status === 200) {
            setFormData(data.data);
        } else {
            const msgs = collectErrorMsg(data.message);
            warning(msgs);
        }
    }

    const toggleTooltip = (type, idx) => {
        //console.info(idx);
        //console.info(type);
        if (idx > 0) {
            setIsMouseOverProcess(prev => {
                return prev.map((item, idx1) => {
                    return idx === idx1 ? !item : item;
                })
            })
        }
    }

    const AutoCompleteRow = ({row, idx}) => {
        //console.info(row);
        return (
            <div className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                <p>{idx+1}.</p>
                <img src={row.avatar} alt={row.name} className='w-16' />
                <p>{row.name}</p>
                <p>{row.nickname}</p>
            </div>
        )
    }

    if (!isGetOne) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className='p-4'>
                <main className="isolate">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{formData.order_no}</h2>
                </main>

                <form onSubmit={onSubmit}>
                    <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            <Tab items={tabs} to={handleTab}/>
                            <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-4' : 'hidden'}`}>
                            <div className="col-span-4 my-4">
                                <div className={`flex justify-between mb-4`}>
                                    <label className="block text-MyWhite font-medium leading-6 ml-1">
                                        訂單階段
                                    </label>
                                </div>
                                <ol className='items-center sm:flex'>
                                    {formData.processes.map((process, idx) => (
                                        <li className={`relative mb-6 sm:mb-0 w-64 ${idx > 0 ? 'cursor-pointer' : ''}`}
                                            key={process.key} onClick={() => toggleProcess(idx)}
                                            onMouseEnter={() => toggleTooltip('over', idx)}
                                            onMouseLeave={() => toggleTooltip('out', idx)}>
                                            <div>
                                                <div className="flex items-center">
                                                    <div
                                                        className="z-10 flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full ring-0 ring-white dark:bg-Primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                                                        {process.time ?
                                                            <FaCheck className='w-5 h-5 text-Primary-300'/> :
                                                            <FaXmark className='w-5 h-5 text-gray-500'/>
                                                        }
                                                    </div>
                                                    <div
                                                        className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                                                </div>
                                                <div className="mt-3 sm:pe-8">
                                                    <h3 className={`text-lg font-semibold text-gray-900 ${process.time ? 'dark:text-MyWhite' : 'dark:text-gray-500'}`}>{process.text}</h3>
                                                    <div
                                                        className="block my-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-400">
                                                        {process.time ? process.time : <span>&nbsp;</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div role="tooltip"
                                                 className={`absolute z-10 inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 ${isMouseOverProcess[idx] ? 'opacity-1 visible' : 'opacity-0 invisible'}`}>
                                                <div className="px-3 py-2">
                                                    <p>按下後，可直接設定此階段的是否完成</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="訂單編號"
                                    type="text"
                                    name="order_no"
                                    value={formData.order_no || ''}
                                    id="order_no"
                                    placeholder=""
                                    readOnly={true}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="pos編號"
                                    type="text"
                                    name="posId"
                                    value={formData.posId || ''}
                                    id="posId"
                                    placeholder=""
                                    // readOnly={true}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="col-span-4">
                                <Radio
                                    label="付款方式"
                                    id="gateway_method"
                                    items={gatways}
                                    setChecked={setGateways}
                                    setStatus={setFormData}
                                    isRequired={true}
                                    errorMsg={errorObj.gatewayError.message}
                                    isIcon={false}
                                />
                            </div>
                            <div className="col-span-4">
                                <Radio
                                    label="到貨方式"
                                    id="shipping_method"
                                    items={shippings}
                                    setChecked={setShippings}
                                    setStatus={setFormData}
                                    isRequired={false}
                                    errorMsg={errorObj.shippingError.message}
                                />
                            </div>
                            <div className="col-span-2 mt-4">
                                {/*<div className={`flex justify-between mb-2`}>*/}
                                {/*    <label className="block text-MyWhite font-medium leading-6 ml-1">*/}
                                {/*        訂購者*/}
                                {/*    </label>*/}
                                {/*    <span*/}
                                {/*        className={`text-sm leading-6 mr-1 text-Warning-400`}>*必填*/}
                                {/*    </span>*/}
                                {/*</div>*/}
                                {/*<div className="relative">*/}
                                {/*    <div className='rounded-md shadow-sm'>*/}
                                {/*        <MagnifyingGlassIcon*/}
                                {/*            className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>*/}
                                {/*        <input*/}
                                {/*            className={`w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}*/}
                                {/*            placeholder='請輸入關鍵字...'*/}
                                {/*            name='member_id'*/}
                                {/*            value={formData.member_nickname}*/}
                                {/*            id='member_id'*/}
                                {/*            onChange={onChange}*/}
                                {/*        />*/}
                                {/*        <div className="absolute inset-y-0 right-0 items-center pr-3 flex">*/}
                                {/*            <span className="cursor-pointer" onClick={() => handleClear('member_id')}>*/}
                                {/*                <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>*/}
                                {/*            </span>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*    <div className={`absolute bdivide-y z-10 bg-white divide-y divide-gray-100 w-44 dark:bg-PrimaryBlock-950 ${members.isShowMembersList ? 'block' : 'hidden'}`}>*/}
                                {/*        <ul id="autocomplete-list"*/}
                                {/*            className="mt-2 py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow"*/}
                                {/*            role="listbox">*/}
                                {/*            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>apple</li>*/}
                                {/*            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>banana</li>*/}
                                {/*            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>orange</li>*/}
                                {/*            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>orange</li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <SearchBar
                                    label="訂購者"
                                    value={formData.member_nickname}
                                    placeholder="請輸入訂購者名稱"
                                    getReadAPI={getOrder}
                                    setSelected={setMember}
                                    isRequired={true}
                                    ResultRow={AutoCompleteRow}
                                />
                            </div>
                            <div className="col-span-2 mt-4">
                                <SearchBar
                                    label="收銀員"
                                    value={formData.sale_name || ''}
                                    placeholder="請輸入收銀者名稱"
                                    getReadAPI={getSale}
                                    setSelected={setSale}
                                    isRequired={true}
                                    ResultRow={AutoCompleteRow}
                                />
                            </div>
                            <div className="col-span-4 mt-4">
                                <Radio
                                    label="狀態"
                                    id="status"
                                    items={status}
                                    setChecked={setStatus}
                                    setStatus={setFormData}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="總售價"
                                    type="text"
                                    name="amount"
                                    value={formData.amount || ''}
                                    id="amount"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="折扣"
                                    type="text"
                                    name="discount"
                                    value={formData.discount || ''}
                                    id="discount"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="運費"
                                    type="text"
                                    name="shipping_fee"
                                    value={formData.shipping_fee || ''}
                                    id="shipping_fee"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="稅"
                                    type="text"
                                    name="tax"
                                    value={formData.tax || ''}
                                    id="tax"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="mt-4">
                                <Input
                                    label="淨總收入"
                                    type="text"
                                    name="grand_total"
                                    value={formData.grand_total || ''}
                                    id="grand_total"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="mt-4">
                                <Input
                                    label="盈利"
                                    type="text"
                                    name="profit"
                                    value={formData.profit || ''}
                                    id="profit"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-4' : 'hidden'}`}>
                            <div className="col-span-2 mt-4">
                                <Input
                                    label="收貨者姓名"
                                    type="text"
                                    name="order_name"
                                    value={formData.order_name || ''}
                                    id="order_name"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="col-span-2 mt-4">
                                <Input
                                    label="收貨者電話"
                                    type="text"
                                    name="order_tel"
                                    value={formData.order_tel || ''}
                                    id="order_tel"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="col-span-8 mt-4">
                                <Input
                                    label="收貨者Email"
                                    type="text"
                                    name="order_email"
                                    value={formData.order_email || ''}
                                    id="order_email"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="col-span-8 mt-4">
                                <Address
                                    city_id="order_city"
                                    area_id="order_area"
                                    road_id="order_road"
                                    city_value={formData.order_city || 0}
                                    area_value={formData.order_area || 0}
                                    road_value={formData.order_road || ''}
                                    onChange={onChange}
                                    handleClear={handleClear}
                                />
                            </div>
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[2].active ? 'grid gap-4 sm:grid-cols-4' : 'hidden'}`}>
                            <div className='col-span-2 mt-4'>
                                <Radio
                                    label="發票類型"
                                    id="invoice_type"
                                    items={invoiceType}
                                    setChecked={setInvoiceType}
                                    setStatus={setFormData}
                                />
                            </div>
                            <div className="col-span-2 mt-4">
                                <Input
                                    label="寄送email"
                                    type="text"
                                    name="order_email"
                                    value={formData.order_email || ''}
                                    id="order_email"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={handleClear}
                                />
                            </div>
                            <div className="col-span-4 mt-4">
                                <animated.div className='relative top-[-300px] left-0 opacity-0' style={props}>
                                    <Input
                                        label="公司名稱"
                                        type="text"
                                        name="invoice_company_name"
                                        value={formData.invoice_company_name || ''}
                                        id="invoice_company_name"
                                        placeholder="羽球密碼"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                    <Input
                                        label="公司統編"
                                        type="text"
                                        name="invoice_company_tax"
                                        value={formData.invoice_company_tax || ''}
                                        id="invoice_company_tax"
                                        placeholder="53830194"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                </animated.div>
                            </div>
                        </div>

                        <div className={`mt-6 lg:mx-0 ${tabs[3].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                            <div className="sm:col-span-2">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            #
                                        </th>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-all-search" type="checkbox"
                                                       onChange={(e) => toggleChecked(e)}
                                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor="checkbox-all-search"
                                                       className="sr-only">checkbox</label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            id
                                        </th>
                                        <th scope="col" width='20%' className="px-6 py-3">
                                            名稱
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            數量
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            銷售金額 / 利潤
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            功能
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {formData.items.map((row, idx) => (
                                        <tr key={idx}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {idx + 1}
                                            </th>
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input onChange={(e) => singleCheck(e, row.id)}
                                                           id="checkbox-table-search-1" type="checkbox"
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                           checked={isCheck.includes(row.id)}
                                                    />
                                                    <label htmlFor="checkbox-table-search-1"
                                                           className="sr-only">checkbox</label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.product_id}<br/>{row.product.posId}
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.quantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-row items-center gap-2'><span
                                                        className='text-xs'>NT$</span> <span
                                                        className='text-xl text-Warning-400'>{formattedWithSeparator(row.total_amount)}</span>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-2'><span
                                                        className='text-xs'>NT$</span> <span
                                                        className='text-xl text-Success-500'>{formattedWithSeparator(row.total_profit)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className='flex flex-col sm:flex-row gap-2'>
                                                    <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                                                    <DeleteButton
                                                        onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="sm:col-span-2 flex flex-col lg:flex-row gap-4 justify-center">
                            <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default UpdateOrder

