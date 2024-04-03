import {useContext, useState, useEffect, useReducer} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI, postUpdateAPI } from '../../../context/member/MemberAction'
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import DateSingle from "../../../component/form/DateSingle";
import SelectCity from "../../../component/form/SelectCity";
import SelectArea from "../../../component/form/SelectArea";
import Sex from "../../../component/form/Sex";
import Radio from '../../../component/form/Radio'
import Checkbox from '../../../component/form/Checkbox'
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import { arrayMove } from '@dnd-kit/sortable'
import { PrimaryButton } from '../../../component/MyButton'
import {citys, areas} from "../../../zone.js"
import {
    NAMEBLANK,
    NICKNAMEBLANK,
    EMAILBLANK,
    MOBILEBLANK,
    GetNameBlankError,
    GetEmailBlankError,
    GetNicknameBlankError,
    GetMobileBlankError,
} from '../../../errors/MemberError'
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

function UpdateMember() {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const {token} = useParams()
    const {accessToken} = auth;
    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員列表', href: '/admin/member', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [tabs, setTabs] = useState([
        {key: 'data', name: '基本資訊', to: 'data', active: true},
        {key: 'image', name: '頭貼設定', to: 'avatar', active: false},
        {key: 'password', name: '密碼設定', to: 'password', active: false},
        {key: 'auth', name: '權限設定', to: 'auth', active: false},
        {key: 'system', name: '系統資訊', to: 'system', active: false},
    ])
    const [formData, setFormData] = useState({
        city_id: 0,
        dob: '2000/01/01',
    });

    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas)
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

    // 由於calendar的元件，在設定時需要startDate與endDate的字串，所以另外用一個useState來處理
    const startDate = (formData && formData.dob) ? formData.dob : '2000/01/01';
    const endDate = (formData && formData.dob) ? formData.dob : '2000/01/01';
    const [dob1, setDob1] = useState({startDate: startDate, endDate: endDate,})

    const [statuses, setStatuses] = useState([])

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        nicknameError: obj,
        emailError: obj,
        mobileError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, nicknameState, emailState, mobileState] = [{}, {}, {}, {}, {}]
        switch (action.type) {
            case NAMEBLANK:
                nameState = {code: NAMEBLANK, message: GetNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case NICKNAMEBLANK:
                nicknameState = {code: NICKNAMEBLANK, message: GetNicknameBlankError().msg}
                newState = {loading: false, nicknameError: nicknameState}
                return {...state, ...newState}
            case EMAILBLANK:
                emailState = {code: EMAILBLANK, message: GetEmailBlankError().msg}
                newState = {loading: false, emailError: emailState}
                return {...state, ...newState}
            case MOBILEBLANK:
                mobileState = {code: MOBILEBLANK, message: GetMobileBlankError().msg}
                newState = {loading: false, mobileError: mobileState}
                return {...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }

    const [errorObj, dispatch] = useReducer(errorReducer, initalError);

    const onChange = (e) => {
         // 如果是生日改變
         if ('startDate' in e) {
            //memberDispatch({type: 'UPDATE', payload: {dob: e.startDate}})
            setFormData((prev) => ({...prev, ...{dob: e.startDate}}));
            setDob1({startDate: e.startDate, endDate: e.endDate})
        } else {
            // 如果是變更縣市，則區域選擇改為"無“
            if (e.target.id === 'city_id') {
                setAreaFromCity(parseInt(e.target.value))
            // 如果是性別改變
            } else if (e.target.id === 'sex_M' || e.target.id === 'sex_F') {
                e.target.id = "sex"
            }
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
            clearError(e.target.id)
        }
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'name') {
			error = {nameError:{message: ''}}
        } else if (id === 'email') {
            error = {emailError:{message: ''}}
        } else if (id === 'nickname') {
            error = {nicknameError:{message: ''}}
        } else if (id === 'mobile') {
            error = {mobileError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        data = data.data
        console.info(data);
        if (scenario === 'create') {
            data = {...data, ...initData};
        }
        setBreadcrumbs(() => {
            const name = (data && data.name) ? data.name : '新增會員';
            return [...initBreadcrumb, { name: name, href: '/admon/member/update', current: true }]
        })
        setFormData(data);
        // setFormData((prev) => {
        //     return {...prev, ...data}
        // })
        setImBusy(false);
    }

    useEffect(() => {
        // 當縣市id有改變時，要產生該縣市的區域
        if (formData.city_id > 0 && formData.area_id > 0) {
            setAreaFromCity(formData.city_id)
        }

        // 當從資料庫取得生日時，透過此設定才能顯示在頁面上
        setDob1({startDate: formData.dob, endDate: formData.dob})
        
        // console.info(token);
        if (token !== undefined && token.length > 0) {
            getOne(accessToken, token, 'update');
        } else {
            getOne(accessToken, '', 'create');
            // setBreadcrumbs((prev) => {
            //     return [...prev, { name: '新增會員', href: '/admin/member/update', current: true }]
            // })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.city_id]);

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

    const onSubmit = async (e) => {
        e.preventDefault();

        let isPass = true
        // 偵測姓名沒有填的錯誤
        if (formData.name === undefined || formData.name.length === 0) {
			dispatch({type: NAMEBLANK})
			isPass = false
        }
        if (formData.nickname === undefined || formData.nickname.length === 0) {
			dispatch({type: NICKNAMEBLANK})
			isPass = false
        }
        if (formData.email === undefined || formData.email.length === 0) {
			dispatch({type: EMAILBLANK})
			isPass = false
        }
        if (formData.mobile === undefined || formData.mobile.length === 0) {
			dispatch({type: MOBILEBLANK})
			isPass = false
        }
        if (!isPass) {
            return
        }

        const postFormData = new FormData()
        Object.keys(formData).map(key => {
            if (key !== 'images' && key !== 'attributes' && key !== 'prices') {
                let value = formData[key]
                value = (value === null) ? '' : value
                postFormData.append(key, value)
            }
            return key
        });
        postFormData.delete('token')
        postFormData.delete('statuses')
        postFormData.delete('status_text')
        postFormData.delete('slug');
        postFormData.delete('sort_order');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');

        const statusSelected = statuses.filter((item) => item.active === true)
        if (statusSelected.length > 0) {
            postFormData.delete('status')
            postFormData.append('status', statusSelected[0].value)
        }

        setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("member_token", token)
        }
        console.info(JSON.stringify(formData));

        const data = await postUpdateAPI(auth.accessToken, postFormData)
        setIsLoading(false);

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
            const message = "恭喜您建立會員成功！！"
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
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{(formData.name) ? formData : '新增會員'}</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <Tab items={tabs} to={handleTab} />
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">
                            <Input 
                                label="姓名"
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                id="name"
                                placeholder="王大明"
                                isRequired={true}
                                errorMsg={errorObj.nameError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="暱稱"
                                type="text"
                                name="nickname"
                                value={formData.nickname || ''}
                                id="nickname"
                                placeholder="大頭"
                                isRequired={true}
                                errorMsg={errorObj.nicknameError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="Email"
                                type="text"
                                name="email"
                                value={formData.email || ''}
                                id="email"
                                placeholder="david@gmail.com"
                                isRequired={true}
                                errorMsg={errorObj.emailError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="身分證"
                                type="text"
                                name="pid"
                                value={formData.pid || ''}
                                id="pid"
                                placeholder="A123456789"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="行動電話"
                                type="text"
                                name="mobile"
                                value={formData.mobile || ''}
                                id="mobile"
                                placeholder="0923123456"
                                isRequired={true}
                                errorMsg={errorObj.mobileError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="市內電話"
                                type="text"
                                name="tel"
                                value={formData.tel || ''}
                                id="tel"
                                placeholder="0223445566"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div>
                            <SelectCity
                                citys={citys}
                                value={formData.city_id || 0}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div>
                            <SelectArea
                                areas={cityAreas}
                                value={formData.area_id || 0}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className='sm:col-span-2'>
                            <Input 
                                label="路名、街道巷弄等"
                                type="text"
                                name="road"
                                value={formData.road || ''}
                                id="road"
                                placeholder="中正路50號6F"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div>
                            <DateSingle
                                label="生日"
                                name="dob"
                                value={dob1}
                                id="dob"
                                minDate={new Date('1940-01-01')}
                                maxDate={new Date()}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <Sex
                                defaultChecked={formData.sex}
                                setFormData={setFormData}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">

                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[2].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">

                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[3].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">

                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[4].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">

                        </div>
                    </div>
                </div>
                
            </form>
        </div>
    )}
}

export default UpdateMember
