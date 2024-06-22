import {useContext, useState, useEffect, useReducer} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI, postUpdateAPI } from '../../../context/order/OrderAction'
import { filterKeywordAPI } from '../../../context/member/MemberAction';
import { filterKeywordAPI as filterCashierAPI } from '../../../context/cashier/CashierAction';
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import Radio, {renderRadio, renderRadioCustom} from '../../../component/form/Radio'
import Checkbox from '../../../component/form/Checkbox';
import SearchBar from '../../../component/form/searchbar/SearchBar'
import { PrimaryButton } from '../../../component/MyButton'
import {
    PRODUCTNAMEBLANK,
    ORDERMINBLANK,
    ORDERMAXBLANK,
    UNITBLANK,
    GetProductNameBlankError,
    GetOrderMinBlankError,
    GetOrderMaxBlankError,
    GetUnitBlankError,
} from '../../../errors/ProductError'
import { INSERTFAIL } from '../../../errors/Error'

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
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const {token} = useParams();
    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '訂單列表', href: '/admin/order', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [tabs, setTabs] = useState([
        {key: 'data', name: '基本資訊', to: 'data', active: true},
        {key: 'image', name: '圖片設定', to: 'image', active: false},
        {key: 'attribute', name: '屬性設定', to: 'attribute', active: false},
        {key: 'price', name: '價格設定', to: 'price', active: false},
        {key: 'detail', name: '詳細介紹', to: 'detail', active: false},
    ])
    const [formData, setFormData] = useState({})

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        unitError: obj,
        orderMinError: obj,
        orderMaxError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, unitState, orderMinState, orderMaxState] = [{}, {}, {}, {}, {}]
        switch (action.type) {
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
        if (e.target.id === "member_id") {
            setFormData({...formData,member_nickname: e.target.value});
            if (e.target.value.length > 2) {
                fetchMembers(e.target.value);
            }
        } else if (e.target.id === "cashier_id") {
            setFormData({...formData,cashier_name: e.target.value});
            if (e.target.value.length > 2) {
                fetchCashiers(e.target.value)
            }
        } else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
            clearError(e.target.id)
        }
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}));
        if (id === "member_id") {
            var e = {target: {id: "member_nickname", value: ""}};
            onChange(e)
            e = {target: {id: "member_id", value: ""}};
            onChange(e)
            //setFormData((prev) => ({...prev, ...{member_nickname: ""}}));
            setMembers({
                isShowMembersList: false,
                list: [],
            });
        } else if (id === "cashier_id") {
            e = {target: {id: "cashier_name", value: ""}};
            onChange(e)
            e = {target: {id: "cashier_id", value: ""}};
            onChange(e)
            //setFormData((prev) => ({...prev, ...{member_nickname: ""}}));
            setCashiers({
                isShowCashiersList: false,
                list: [],
            });
        }
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'name') {
			error = {nameError:{message: ''}}
        } else if (id === 'order_min') {
            error = {orderMinError:{message: ''}}
        } else if (id === 'order_max') {
            error = {orderMaxError:{message: ''}}
        } else if (id === 'unit') {
            error = {unitError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }

    const initInvalid = {"1": "正常", "0": "取消"};

    const [invalid, setInvalid] = useState(initInvalid);

    const getOne = async (accessToken, token, scenario) => {
        let data = await getOneAPI(accessToken, token, scenario);
        data = data.data
        console.info(data);
        if (scenario === 'create') {
            data = {...data, ...initData};
        }
        setBreadcrumbs(() => {
            const name = (data.name) ? data.name : '新增訂單';
            return [...initBreadcrumb, { name: name, href: '/admon/order/update', current: true }]
        })
        setFormData((prev) => {
            return {...prev, ...data}
        })

        renderRadio(initInvalid, data.invalid, setInvalid);
        setImBusy(false);
    }

    useEffect(() => {
        if (token !== undefined && token.length > 0) {
            getOne(auth.accessToken, token, 'update');
        } else {
            setFormData(initData);
            getOne(auth.accessToken, '', 'create');
            setBreadcrumbs((prev) => {
                return [...prev, { name: '新增訂單', href: '/admin/order/update', current: true }]
            })
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
            let res = prev.map((item, idx1) => {
                (idx === idx1) ? item.active = true : item.active = false
                return item
            })
            return res
        })
    }

    // 選擇訂購者列表的資料
    const [members, setMembers] = useState({
        isShowMembersList: false,
        list: [],
    })

    // 將選擇的會員填入formData中
    const setMember = (member) => {
        setMembers({
            ...member, isShowMemberList: false,
        })
        setFormData({
            ...formData,
            ...{member_id: member.id, member_nickname: member.nickname, member_token: member.token}
        })
    }

    // 用關鍵字從後台取得會員資料列表
    const fetchMembers = async (k) => {
        setIsLoading(true)
        const data = await filterKeywordAPI(k)
        setMembers({
            isShowMembersList: true,
            list: data,
        })
        setIsLoading(false)
    }   
    
    // 選擇訂購者列表的資料
    const [cashiers, setCashiers] = useState({
        isShowCashiersList: false,
        list: [],
    })

    // 將選擇的會員填入formData中
    const setCashier = (cashier) => {
        setCashiers({
            ...cashier, isShowCashiersList: false,
        })
        setFormData({
            ...formData,
            ...{cashier_id: cashier.id, cashier_name: cashier.name}
        })
    }

    // 用關鍵字從後台取得會員資料列表
    const fetchCashiers = async (k) => {
        setIsLoading(true)
        const data = await filterCashierAPI(k)
        setCashiers({
            isShowCashiersList: true,
            list: data,
        })
        setIsLoading(false)
    }   


    const onSubmit = async (e) => {
        e.preventDefault()

        let isPass = true
        // 偵測姓名沒有填的錯誤
        if (!isPass) {
            return
        }

        const postFormData = new FormData()
        // Object.keys(formData).map(key => {
        //     if (key !== 'images' && key !== 'attributes' && key !== 'prices') {
        //         let value = formData[key]
        //         value = (value === null) ? '' : value
        //         postFormData.append(key, value)
        //     }
        //     return key
        // });
        postFormData.delete('token')
        postFormData.delete('statuses')
        postFormData.delete('status_text')
        postFormData.delete('slug');
        postFormData.delete('pv');
        postFormData.delete('sort_order');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');

        setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("product_token", token)
        }
        console.info(JSON.stringify(formData));

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
            const message = "恭喜您建立訂單成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
                onOK: toGetOne,
                params: {token: token, scenario: 'update'},
            }
            setAlertModal(obj)
        }
    }

    const toGetOne = (params) => {
        getOne(params.token, params.scenario);
    }

    if (imBusy) { return <div className="text-MyWhite">loading</div>}
    else {
    return (
        <div className='p-4'>
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{formData.order_no}</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <Tab items={tabs} to={handleTab} />
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-4' : 'hidden'}`}>
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
                                readOnly={true}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-span-2 mt-4">
                            <SearchBar 
                                label="訂購者"
                                name="member_id" 
                                value={formData.member_nickname}
                                placeholder="請輸入訂購者名稱"
                                isShowList={members.isShowMembersList}
                                list={members.list}
                                handleChange={onChange}
                                onClear={handleClear}
                                setResult={setMember}
                                isRequired={true}
                            />
                        </div>
                        <div className="col-span-2 mt-4">
                            <SearchBar 
                                label="收銀員"
                                name="cashier_id" 
                                value={formData.cashier_name}
                                placeholder="請輸入收銀者名稱"
                                isShowList={cashiers.isShowCashiersList}
                                list={cashiers.list}
                                handleChange={onChange}
                                onClear={handleClear}
                                setResult={setCashier}
                                isRequired={true}
                            />
                        </div>
                        <div className="col-span-4 mt-4">
                            <Radio
                                label="狀態"
                                id="invalid"
                                items={invalid}
                                setChecked={setInvalid}
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
                        <div className="col-span-4 mt-4">
                            <Radio
                                label="訂單階段"
                                id="process"
                                items={invalid}
                                setChecked={setInvalid}
                                setStatus={setFormData}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="sm:col-span-2">
                            
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[2].active ? '' : 'hidden'}`}>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[3].active ? '' : 'hidden'}`}>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[4].active ? '' : 'hidden'}`}>
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

