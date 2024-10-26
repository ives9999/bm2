import {useContext, useState, useEffect, useReducer, useRef} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../component/Breadcrumb'
import { getOneAPI, postUpdateAPI } from '../../../context/member/MemberAction'
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import Password from '../../../component/form/Password.js'
import {DateSingle} from "../../../component/form/DateSingle";
import SelectCity from "../../../component/form/SelectCity";
import SelectArea from "../../../component/form/SelectArea";
import Sex from "../../../component/form/Sex";
import Radio, {renderRadio} from '../../../component/form/Radio'
import Checkbox, {renderCheckboxCustom} from '../../../component/form/Checkbox';
import JustLabel from '../../../component/form/JustLabel.jsx';
import { PrimaryButton, PrimaryOutlineButton, DeleteOutlineButton } from '../../../component/MyButton'
import {citys, areas} from "../../../zone.js"
import {
    NAMEBLANK,
    NICKNAMEBLANK,
    EMAILBLANK,
    MOBILEBLANK,
    PASSWORDNOTMATCH,
    GetNameBlankError,
    GetEmailBlankError,
    GetNicknameBlankError,
    GetMobileBlankError,
    GetPasswordNotMatchError,
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
        {key: 'social', name: '社群設定', to: 'social', active: false},
        {key: 'auth', name: '權限設定', to: 'auth', active: false},
        {key: 'system', name: '系統資訊', to: 'system', active: false}
        // {key: 'cart', name: '購物車', to: 'cart', active: false},
        // {key: 'order', name: '訂單', to: 'order', active: false}
    ]);

    // 頭貼的input field
    const inputFileRef = useRef(null);
    // 預設沒有頭貼的顯示網址
    const noAvatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png";
    // 選擇頭貼的初始設定值
    const initSelectedImage = {src: null, file: null};
    const [selectedImage, setSelectedImage] = useState(initSelectedImage)

    // 選擇頭貼動作例如是新增還是刪除的初始設定值
    const initAvatarProcess = {name: noAvatar, statuse: 'localhost'};
    const avatarProcess = useRef(initAvatarProcess);

    const onSelect = () => {
        inputFileRef.current.click()
    }

    // 頭貼選擇後觸發此函式
    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // const src = URL.createObjectURL(e.target.files[0])
            setSelectedImage((prev) => {
                return {...prev, file: e.target.files[0], src: null}
            })

            avatarProcess.current = {
                name: e.target.files[0].name,
                status: 'create',
            }
            //console.info(avatarProcess.current)
        }
    }

    // 頭貼刪除後觸發此函式
    // This functin will be triggered when the "Remove This Image" button is clicked
    const onClearImage = () => {
        setSelectedImage((prev) => {
            return {...prev, file: null, src: noAvatar}
        })
        avatarProcess.current.status = "delete"
        //console.info(avatarProcess.current)
    }

    const AvatarPreview = () => {
        var src = null;
        if (selectedImage.file !== null) {
            src = URL.createObjectURL(selectedImage.file)
        } else if (selectedImage.src !== null) {
            src = selectedImage.src
        } else {
            src = formData.avatar
        }
        return (
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                <img className="absolute w-64 h-64 object-cover" src={src} alt={formData.nickname} />
            </div>
        )
    }

    const [formData, setFormData] = useState({
        city_id: 0,
        dob: '2000/01/01',
        password: '',
        repassword: '',
        avatar: noAvatar,
    });

    // 區域選項初始值
    var initSelectedAreas = [{city: 0, id: 0, name: "無"}]
    // 該縣市的所有區域
    const [cityAreas, setCityAreas] = useState(initSelectedAreas)
    // 選擇縣市後，設定區域的選項
    function setAreaFromCity(city) {
        //將區域的值放入selectedAreas
        let selectedAreas = initSelectedAreas;
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

    // 設定所有角色的選項
    const [roles, setRoles] = useState([]);
    // 設定所有訂閱的選項
    const [subscriptions, setSubscriptions] = useState([]);
    // 設定所有狀態的選項
    const [statuses, setStatuses] = useState([]);
    // 設定所有認證的選項
    const [validates, setValidates] = useState([]);

    // 更新認證後執行的函式
    // id: validate, value: email is 1 or mobile is 2, checked: true or false
    function setValidateCB(id, value, checked) {
        setFormData((prev) => {
            if (checked) {
                return {...prev, ...{validate: prev.validate | value}}
            } else {
                return {...prev, ...{validate: prev.validate ^ value}}
            }
        })
    };

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        nicknameError: obj,
        emailError: obj,
        mobileError: obj,
        passwordError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, nicknameState, emailState, mobileState, passwordState] = [{}, {}, {}, {}, {}, {}]
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
            case PASSWORDNOTMATCH:
                passwordState = {code: PASSWORDNOTMATCH, message: GetPasswordNotMatchError().msg}
                newState = {loading: false, passwordError: passwordState}
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

    let initRoles = [];
    const getOne = async (accessToken, member_token, scenario) => {
        let data = await getOneAPI(accessToken, member_token, scenario);
        data = data.data
        console.info(data);
        if (scenario === 'create') {
            data = {...data, ...initData};
        }
        setBreadcrumbs(() => {
            const name = (data && data.name) ? data.name : '新增會員';
            return [...initBreadcrumb, { name: name, href: '/admon/member/update', current: true }]
        })
        // setFormData(data);
        data.password = '';
        setFormData((prev) => {
            return {...prev, ...data}
        })

        // 當縣市id有改變時，要產生該縣市的區域
        if (data.city_id > 0 && data.area_id > 0) {
            setAreaFromCity(formData.city_id)
        }
        // 當從資料庫取得生日時，透過此設定才能顯示在頁面上
        setDob1({startDate: formData.dob, endDate: formData.dob})

        //console.info(data.roles);
        // const obj = {key: type1, text: types[type1], value: type1, active: active}
        Object.keys(data.roles).forEach(key => {
            initRoles.push({key: key, text: key, value: data.roles[key], active: false});
        })
        console.info(initRoles);
        // 將後端資料庫的會員角色選擇顯示到網頁上
        //renderRadio(roles, data.role, setRoles);
        // 將後端資料庫的會員訂閱選擇顯示到網頁上
        renderRadio(data.subscriptions, data.subscription, setSubscriptions);
        // 將後端資料庫的會員驗證選擇顯示到網頁上
        renderCheckboxCustom(data.validates, data.validate, (validates, validate) => {
            setValidates(() => {
                let all = [];
                Object.keys(validates).forEach((key) => {
                    const value = validates[key];
                    const active = ((validate & value) > 0)
                    const obj = {key: "validate_"+key, text: key, value: value, active: active};
                    all.push(obj)
                });
                // console.info(all);
                return all
            })
        });
        //renderValidates(data.validates, data.validate);
        renderRadio(data.statuses, data.status, setStatuses);

        setImBusy(false);
    }

    useEffect(() => {        
        // console.info(token);
        // 表示修改資料
        if (token !== undefined && token.length > 0) {
            getOne(accessToken, token, 'update');
        // 表示新增資料
        } else {
            getOne(accessToken, '', 'create');
            // setBreadcrumbs((prev) => {
            //     return [...prev, { name: '新增會員', href: '/admin/member/update', current: true }]
            // })
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

        // 如果form data的密碼欄位值有填入時，表示修改密碼，就必須檢查新密碼與再填一次新密碼是否相同，通過相同檢驗，才能將要更新的密碼傳到後端
        if (formData.password && formData.password.length > 0) {
            if (formData.password !== formData.repassword) {
                dispatch({type: PASSWORDNOTMATCH})
			    isPass = false
            }
        }
        if (!isPass) {
            return
        }

        // 將修改後的formData放置到新的要傳到後端的form data
        const postFormData = new FormData()
        Object.keys(formData).map(key => {
            let value = formData[key]
            value = (value === null) ? '' : value

            // 如果是更新認證值，則必須將例如是0,1,2改為[0,1,2]再改為3來傳到後端
            if (key === 'validate' && value.length > 0 && value.search(',') > 0) {
                let items = value.split(',');
                items = items.map(item => parseInt(item));
                value = items.reduce((acc, curr) => {
                    return acc + curr;
                }, 0);
            }

            // 如果頭貼是維持沒有設定的話，必須刪除預設值，以面後端資料庫存進預設沒有頭貼的網址
            if (key === 'avatar' && value.length > 0 && value.search('noavatar') > 0) {
                value = '';
            }

            postFormData.append(key, value)
            return key
        });

        // 將設定頭貼的檔案放入post form data的image欄位中
        if (selectedImage.file !== null) {
            postFormData.append('image', selectedImage.file)
        }
        // 如果頭貼來源跟預設值不一樣時，表示有修改，則將頭貼設定值，放入post form data中
        if (avatarProcess.current.status !== initAvatarProcess.src) {
            postFormData.append('avatarProcess', JSON.stringify(avatarProcess.current));
        } else {
            // 如果一樣，表示頭貼沒有更新，則刪除頭貼的值，避免後端修改
            postFormData.delete('avatar');
        }

        // 刪除不需修改的參數
        postFormData.delete('id');
        postFormData.delete('uid');
        postFormData.delete('token');
        postFormData.delete('channel');
        postFormData.delete('statuses')
        postFormData.delete('status_text')
        postFormData.delete('slug');
        postFormData.delete('sort_order');
        postFormData.delete('zip');
        postFormData.delete('social');
        postFormData.delete('email_validate');
        postFormData.delete('player_id');
        postFormData.delete('mobile_validate');
        postFormData.delete('device_type');
        postFormData.delete('device_token');
        postFormData.delete('subscriptions');
        postFormData.delete('roles');
        postFormData.delete('validates');
        postFormData.delete('ip');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');        

        // 如果密碼欄位長度為0表示沒有更改密碼，所以就不能傳密碼值，避免後端修改
        if (formData.password.length === 0) {
            postFormData.delete('password');
            postFormData.delete('repassword');
        }

        // 如果密碼欄位長度大於0表示更改密碼，刪除檢查密碼是否填隊的新密碼
        if (formData.password.length > 0 && formData.repassword.length > 0 && formData.password === formData.repassword) {
            postFormData.delete('repassword');
        }

        // 修改會員狀態
        const statusSelected = statuses.filter((item) => item.active === true)
        if (statusSelected.length > 0) {
            postFormData.delete('status')
            postFormData.append('status', statusSelected[0].value)
        }

        // setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("member_token", token)
        }
        //console.info(JSON.stringify(postFormData));
        for (var pair of postFormData.entries()) {
            console.log(pair[0]+ ':' + pair[1]); 
        }

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
            const message = "恭喜您建立/修改會員成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
                onOK: toGetOne,
                params: {token: data.data.token, scenario: 'update'},
            }
            setAlertModal(obj)
        }
    }

    const toGetOne = (params) => {
        getOne(accessToken, params.token, params.scenario);
        setSelectedImage(initSelectedImage);
        avatarProcess.current= {initAvatarProcess};
    }

    if (imBusy) { return <div className="text-MyWhite">loading</div>}
    else {
    return (
        <div className='p-4'>
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{(formData.name) ? formData.name : '新增會員'}</h2>
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
                        <div className="">
                            <Radio
                                label="狀態"
                                id="status"
                                items={statuses}
                                setChecked={setStatuses}
                                setStatus={setFormData}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="sm:col-span-2">
                            <input 
                                ref={inputFileRef}
                                type="file"
                                accept="image/*" // only accept image file types
                                onChange={imageChange}
                                className="hidden"
                            />
                        
                            <div className="flex justify-center mb-6">
                                <AvatarPreview />
                            </div>
                    
                            <div className="flex justify-stretch mb-8 h-12 gap-4">
                                <PrimaryOutlineButton type="button" className="w-full" onClick={onSelect}>選擇</PrimaryOutlineButton>
                                <DeleteOutlineButton type="button" className="w-full" onClick={onClearImage}>清除</DeleteOutlineButton>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[2].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">
                            <Password 
                                label="新密碼"
                                name="password"
                                value={formData.password || ''}
                                id="password"
                                placeholder="請填新密碼"
                                errorMsg={errorObj.passwordError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div>
                            <Password 
                                label="確認密碼"
                                name="repassword"
                                value={formData.repassword || ''}
                                id="repassword"
                                placeholder="請填確認新密碼"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[3].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">
                            <Input 
                                label="line"
                                type="text"
                                name="line"
                                value={formData.line || ''}
                                id="line"
                                placeholder="badminton-code"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="fb"
                                type="text"
                                name="fb"
                                value={formData.fb || ''}
                                id="fb"
                                placeholder="https://www.facebook.com/100064670472280/"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[4].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="">
                            <Checkbox
                                label="角色"
                                id="role"
                                items={initRoles}
                                setChecked={setRoles}
                                setStatus={setFormData}
                            />
                        </div>
                        <div className="">
                            <Radio
                                label="訂閱"
                                id="subscription"
                                items={subscriptions}
                                setChecked={setSubscriptions}
                                setStatus={setFormData}
                            />
                        </div>
                        {/*<div className="">*/}
                        {/*    <Checkbox*/}
                        {/*        label="認證"*/}
                        {/*        id="validate"*/}
                        {/*        items={validates}*/}
                        {/*        setChecked={setValidates}*/}
                        {/*        setStatus={setValidateCB}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div className={`mt-6 lg:mx-0 text-rabbit-200 ${tabs[5].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <JustLabel label="金鑰">{formData.token}</JustLabel>
                        <JustLabel label="device type">{formData.device_type}</JustLabel>
                        <JustLabel label="device token" containerClass="sm:col-span-2" className='text-nowrap text-ellipsis overflow-hidden ...'>{formData.device_token}</JustLabel>
                        <JustLabel label="email認證碼">{formData.email_validate}</JustLabel>
                        <JustLabel label="手機認證碼">{formData.mobile_validate}</JustLabel>
                        <JustLabel label="建立時間">{formData.created_at}</JustLabel>
                        <JustLabel label="最後一次修改時間">{formData.updated_at}</JustLabel>
                    </div>
                    {/* <div className={`mt-6 lg:mx-0 ${tabs[6].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="text-white">購物車</div>
                    </div> */}
                    <div className="sm:col-span-2 flex flex-col lg:flex-row gap-4 justify-center">
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    )}
}

export default UpdateMember

