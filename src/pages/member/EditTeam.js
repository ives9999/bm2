import { useContext, useReducer, useState, useEffect } from "react";
import {toast} from "react-toastify"
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import {Checkbox, setCheckboxStatus, setCheckboxChecked} from "../../component/form/Checkbox";
import { Switch } from "../../component/form/Switch";
import SearchBar from "../../component/form/searchbar/SearchBar";
import { TimePickerFor2 } from "../../component/form/timePicker/TimePicker";
import TextArea from "../../component/form/TextArea";
import Dropzone from "../../component/form/Dropzone/Dropzone";
import UseHr from "../../component/UseHr";
import {PrimaryButton} from '../../component/MyButton';
import { filterKeywordAPI } from "../../context/arena/ArenaAction";
import { arrayMove } from '@dnd-kit/sortable'
import { postCreateAPI } from "../../context/team/TeamAction";
import { toMemberTeam } from "../../context/to";
import {
    TEAMNAMEBLANK,
    TEAMMOBILEBLANK,
    TEAMEMAILBLANK,
    ARENABLANK,
    LEADERBLANK,
    GetTeamNameBlankError,
    GetTeamMobileBlankError,
    GetTeamEmailBlankError,
    GetArenaBlankError,
    GetLeaderBlankError,
} from "../../errors/TeamError"
import { 
    INSERTFAIL,
} from "../../errors/Error"


var data = {
    name: "最好羽球團",
    weekday: "1,2",
    play_start: "19:00:00",
    play_end: "21:00:00",
    arena: {
        id: 44,
        token: 'VkcPYFJeCwUPAbaLbTcYOH1e7bWnDUN',
        name: 'TOPPRO 高手羽球館',
        value: 'TOPPRO 高手羽球館',
        isShowArenasList: false,
    },
    leader: "張大春",
    mobile: "0933123456",
    email: "david@gmail.com",
    number: 16,
    ball: 'YY-AS50',
    degree: "new,soso",
    block: 2,
    people_limit: 4,
    temp_fee_M: 250,
    temp_fee_F: 200,
    temp_content: '請準時到場，報名後請務必來參加並繳費，無故不到者，列入黑名單',
    line: 'badminton',
    fb: 'https://www.facebook.com',
    youtube: 'https://youtube.com',
    website: 'https://bm2.sportpassword.com',
    content: '我們是一群享受打球快樂的羽球人，歡迎大家加入',
    charge: '球隊採季繳方式，每季每人繳費3000元',
    temp_status: 'online',
    status: 'online',
}

const EditTeam = () => {
    const {memberData, setAlertModal, setIsLoading} = useContext(BMContext)
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '球隊', href: '/member/editTeam', current: false },
        { name: '新增球隊', href: '/member/editTeam', current: true },
    ]
    // const {token} = memberData

    const [formData, setFormData] = useState({
        name: '',
        leader: '',
        arena: null,
        //images: [],
        status: 'online',
        temp_status: 'offline'
    })

    useEffect(() => {
        const weekdays = (data.weekday !== undefined && data.weekday !== null) ? data.weekday.split(',') : []
        // ["1", "2"]
        setWeekdayObj((prev) => {
            const newWeekdayObj = prev.map((item) => {
                if (weekdays.includes(item.key.toString())) {
                    item.checked = true
                }
                return item
            })
            return newWeekdayObj
        })

        setTime((prev) => ({...prev, startTime: noSec(data.play_start), endTime: noSec(data.play_end)}))

        const degrees = (degree !== undefined && degree !== null) ? data.degree.split(',') : []
        setDegreeObj((prev) => { 
            const newDegreeObj = prev.map((item) => {
                if (degrees.includes(item.key)) {
                    item.checked = true
                }
                return item
            })
            return newDegreeObj
        })

        setFormData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
        name, 
        //images,
        leader, 
        arena, 
        email, 
        mobile, 
        play_start, 
        play_end, 
        number, 
        ball, 
        block, 
        degree,
        //weekday,
        temp_fee_M,
        temp_fee_F,
        people_limit,
        temp_status,
        status,
        line,
        fb,
        youtube,
        website,
        content,
        temp_content,
        charge,
    } = formData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        mobileError: obj,
        emailError: obj,
        leaderError: obj,
        arenaError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, mobileState, emailState, leaderState, arenaState] = [{}, {}, {}, {}, {}, {}, {}, {}]
        switch (action.type) {
            case TEAMNAMEBLANK:
                nameState = {code: TEAMNAMEBLANK, message: GetTeamNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case TEAMMOBILEBLANK:
                mobileState = {code: TEAMMOBILEBLANK, message: GetTeamMobileBlankError().msg}
                newState = {loading: false, mobileError: mobileState}
                return {...state, ...newState}    
            case TEAMEMAILBLANK:
                emailState = {code: TEAMEMAILBLANK, message: GetTeamEmailBlankError().msg}
                newState = {loading: false, emailError: emailState}
                return {...state, ...newState}
            case ARENABLANK:
                arenaState = {code: ARENABLANK, message: GetArenaBlankError().msg}
                newState = {loading: false, arenaError: arenaState}
                return {...state, ...newState}
            case LEADERBLANK:
                leaderState = {code: LEADERBLANK, message: GetLeaderBlankError().msg}
                newState = {loading: false, leaderError: leaderState}
                return {...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        //搜尋球館時，當輸入值改變時，偵測最新的值
        if (e.target.id === "arena") {
            const arena = {arena: {value: e.target.value}}
            setFormData({...formData, ...arena})
            if (e.target.value.length > 0) {
                fetchArenas(e.target.value)
            }
        // 選擇打球日期
        } else if (e.target.id === "1" || e.target.id === "2" || e.target.id === "3" || e.target.id === "4" || e.target.id === "5" || e.target.id === "6" || e.target.id === "7") {
            const key = parseInt(e.target.value)
            const checked = e.target.checked

            // 1.先把選擇的選項放入formData，格式為new,soso,high
            setCheckboxStatus(setFormData, "weekday", key, checked)

            // 2.設定網頁上選擇或取消的核取方框
            setCheckboxChecked(setWeekdayObj, key)
        // 使用者選擇球隊程度    
        } else if (e.target.id === "new" || e.target.id === "soso" || e.target.id === "high") {
            const key = e.target.value
            const checked = e.target.checked

            // 1.先把選擇的選項放入formData，格式為new,soso,high
            setCheckboxStatus(setFormData, "degree", key, checked)

            // 2.設定網頁上選擇或取消的核取方框
            setCheckboxChecked(setDegreeObj, key)
        } else {
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
        } else if (id === 'mobile') {
            error = {mobileError:{message: ''}}
        } else if (id === 'email') {
            error = {emailError:{message: ''}}
        } else if (id === 'arena') {
            error = {arenaError:{message: ''}}
        } else if (id === 'leader') {
            error = {leaderError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }

    // 球館代表圖
    // const inputFileRef = useRef(null)
    // const [selectedImage, setSelectedImage] = useState(null)
    // const onSelect = () => {
    //     inputFileRef.current.click()
    // }

    // // This function will be triggered when the file field change
    // const imageChange = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         // const src = URL.createObjectURL(e.target.files[0])
    //         setSelectedImage(e.target.files[0])
    //     }
    // }

    // // This functin will be triggered when the "Remove This Image" button is clicked
    // const onClearImage = () => {
    //     //setIsRemote(false)
    //     const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
    //     setSelectedImage(noavatar)
    //     //setIsNoAvatarHidden(false)
    // }

    // 球隊圖片
    // [{
    // path:"2015-08-13 23.24.26-1 _Recovered_-01.png"
    // id:1
    // isFeatured:false
    // }]
    const [files, setFiles] = useState([])

    // 新增圖片
    const addFiles = (acceptedFiles) => {
        setFiles((prev) => {
            var count = prev.length
            const temp = acceptedFiles.map(file => {
                // 圖片加入索引值
                file.id = count + 1

                // 加入是否為代表圖的變數
                file.isFeatured = false
                count++
                return file
            })
            return [...prev, ...temp]
        })
    }

    // 刪除圖片
    const deleteFiles = (name) => {
        setFiles((prev) => {
            return prev.filter(item => item.name !== name)
        })
    }

    // 設定代表圖
    const setFeatured = (e) => {
        setFiles((prev) => {
            return prev.map(file => {
                if (file.name === e.target.id) {
                    file.isFeatured = !file.isFeatured
                }
                return file
            })
        })
    }

    // 拖曳排序圖片位置
    const onDragDrop = (active, over) => {
        setFiles((prev) => {
            const oldIndex = prev.findIndex(item => item.id === active.id)
            const newIndex = prev.findIndex(item => item.id === over.id)
            
            return arrayMove(prev, oldIndex, newIndex);
        });
    }

    // 選擇球館時設定顯示球館列表的資料
    const [arenas, setArenas] = useState({
        isShowArenasList: false,
        list: [],
    })

    const setArena = (arena) => {
        //console.info(arena)
        setArenas({
            ...arena, isShowArenasList: false,
        })
        setFormData({
            ...formData,
            arena: arena
        })
    }

    const fetchArenas = async (k) => {
        setIsLoading(true)
        const data = await filterKeywordAPI(k)
        setArenas({
            isShowArenasList: true,
            list: data,
        })
        setIsLoading(false)
    }

    // 要設定球隊打球時間的物件
    const [time, setTime] = useState({
        startTime: play_start,
        endTime: play_end,
        isShowStart: false,
        isShowEnd: false,
    })

    // 球隊星期幾打球
    var initWeekdays = [
        // {key: 1, value: '一', checked: (weekdays.filter((item) => item === 1).length > 0) ? true : false},
        // {key: 2, value: '二', checked: (weekdays.filter((item) => item === 2).length > 0) ? true : false},
        // {key: 3, value: '三', checked: (weekdays.filter((item) => item === 3).length > 0) ? true : false},
        // {key: 4, value: '四', checked: (weekdays.filter((item) => item === 4).length > 0) ? true : false},
        // {key: 5, value: '五', checked: (weekdays.filter((item) => item === 5).length > 0) ? true : false},
        // {key: 6, value: '六', checked: (weekdays.filter((item) => item === 6).length > 0) ? true : false},
        // {key: 7, value: '日', checked: (weekdays.filter((item) => item === 7).length > 0) ? true : false},
        {key: 1, value: '一', checked: false},
        {key: 2, value: '二', checked: false},
        {key: 3, value: '三', checked: false},
        {key: 4, value: '四', checked: false},
        {key: 5, value: '五', checked: false},
        {key: 6, value: '六', checked: false},
        {key: 7, value: '日', checked: false},
    ]

    const [weekdayObj, setWeekdayObj] = useState(initWeekdays)

    // 球隊程度
    var initDegrees = [
        {key: 'new', value: '新手', checked: false},
        {key: 'soso', value: '普通', checked: false},
        {key: 'high', value: '高手', checked: false},    
    ]
    const [degreeObj, setDegreeObj] = useState(initDegrees)

    const onSubmit = async (e) => {
        e.preventDefault()
        //toast.success('錯誤的輸入!!')
        // 偵測姓名沒有填的錯誤
        if (name === undefined || name.length === 0) {
			dispatch({type: TEAMNAMEBLANK})
			return
        }
        if (mobile === undefined || mobile.length === 0) {
            dispatch({type: TEAMMOBILEBLANK})
			return
        }
        if (email === undefined || email.length === 0) {
            dispatch({type: TEAMEMAILBLANK})
			return
        }
        if (arena === undefined || arena.length === 0) {
            dispatch({type: ARENABLANK})
			return
        }
        if (leader === undefined || leader.length === 0) {
			dispatch({type: LEADERBLANK})
			return
        }


        const postFormData = new FormData()
        Object.keys(formData).map(key => {
            const value = formData[key]
            postFormData.append(key, value)
            return value
        })
        files.map((file) => (
            (file.isFeatured) ? postFormData.append("featured", file) : postFormData.append("images[]", file)
        ))
        postFormData.set('arena_id', arena.id)
        postFormData.delete('arena')
        postFormData.append("manager_token", memberData.token)
        

        setIsLoading(true)
        const data = await postCreateAPI(postFormData)
        setIsLoading(false)

        // console.info(data)
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
                        modalType: 'alert',
                        modalText: msg,
                        isModalShow: true,
                    })
                }
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'alert',
                    modalText: msgs1,
                    isModalShow: true,
                })
            }
        } else {
            const message = "恭喜您建立球隊成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                onClose: toMemberTeam,
            }
            setAlertModal(obj)
        }
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">登錄球隊</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="mx-4 lg:mx-0 grid gap-4 sm:grid-cols-2 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <div className="sm:col-span-2">
                        <Input 
                            label="球隊名稱"
                            type="text"
                            name="name"
                            value={name || ''}
                            id="name"
                            placeholder="羽球密碼"
                            isRequired={true}
                            errorMsg={errorObj.nameError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Dropzone
                            label="上傳球隊圖片"
                            files={files}
                            addFiles={addFiles}
                            deleteFiles={deleteFiles}
                            setFeatured={setFeatured}
                            onDragDrop={onDragDrop}
                            name="images"
                            onChange={onChange}
                        />
                    </div>
                    {/* <div className="w-full mt-4">
                        <div className="flex justify-between mb-2">
                            <label htmlFor="featured" className="block text-MyWhite font-medium leading-6 ml-1">
                                球隊代表圖
                            </label>
                        </div>
                        <input 
                            ref={inputFileRef}
                            type="file"
                            accept="image/*" // only accept image file types
                            onChange={imageChange}
                            className="hidden"
                        />
                        <div className="flex flex-wrap justify-center mt-8">
                            <div className="w-64 px-4">
                                <img className="shadow rounded-full max-w-full h-auto align-middle border-none"  src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg" alt="..." />
                            </div>
                        </div>
                        <div className="flex justify-stretch mt-8 h-12 gap-4">
                            <OutlineButton type="button" extraClassName="w-full" onClick={onSelect}>選擇</OutlineButton>
                            <CancelButton extraClassName="w-full" onClick={onClearImage}>清除</CancelButton>
                        </div>
                    </div> */}
                    <div className="w-full mt-4">
                        <Input 
                            label="聯絡行動電話"
                            type="number"
                            name="mobile"
                            value={mobile || ''}
                            id="mobile"
                            placeholder="0934234876"
                            isRequired={true}
                            errorMsg={errorObj.mobileError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="聯絡Email"
                            type="email"
                            name="email"
                            value={email || ''}
                            id="email"
                            placeholder="david@gmail.com"
                            isRequired={true}
                            errorMsg={errorObj.emailError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <SearchBar 
                            label="所在球館"
                            name="arena" 
                            value={(arena !== null && arena !== undefined && arena.value !== null && arena.value !== undefined) ? arena.value : ''} 
                            placeholder="請輸入球館名稱"
                            isShowList={arenas.isShowArenasList}
                            list={arenas.list}
                            handleChange={onChange}
                            onClear={handleClear}
                            setResult={setArena}
                            isRequired={true}
                            errorMsg={errorObj.arenaError.message}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="隊長姓名"
                            type="text"
                            name="leader"
                            value={leader || ''}
                            id="leader"
                            placeholder="王大明"
                            isRequired={true}
                            errorMsg={errorObj.leaderError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Checkbox
                            label="星期幾打球"
                            name="weekday"
                            items={weekdayObj}
                            onChange={onChange}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <TimePickerFor2 
                            label="打球時間"
                            startName="play_start"
                            startPlaceholder="開始時間"
                            endName="play_end"
                            endPlaceholder="結束時間"
                            startTime="07:00"
                            endTime="23:00"
                            step="30"
                            time={time}
                            setTime={setTime}
                            handleChange={onChange} 
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="球隊人數(請填數字)"
                            type="text"
                            name="number"
                            value={number || ''}
                            id="number"
                            placeholder="16"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="使用球種"
                            type="text"
                            name="ball"
                            value={ball || ''}
                            id="ball"
                            placeholder="YY-AS50"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Checkbox
                            label="球隊程度"
                            name="degree"
                            items={degreeObj}
                            onChange={onChange}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="使用幾塊球場(請填數字)"
                            type="text"
                            name="block"
                            value={block || ''}
                            id="block"
                            placeholder="2"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2"><UseHr /></div>
                    <div className="w-full mt-4">
                        <Switch
                            label="臨打狀態"
                            yesText="開"
                            noText="關"
                            yesValue="online"
                            noValue="offline"
                            id="temp_status"
                            value={temp_status}
                            onChange={onChange}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="臨打人數(請填數字)"
                            type="text"
                            name="people_limit"
                            value={people_limit || ''}
                            id="people_limit"
                            placeholder="4"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="臨打費用-男(請填數字)"
                            type="text"
                            name="temp_fee_M"
                            value={temp_fee_M || ''}
                            id="temp_fee_M"
                            placeholder="250"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="臨打費用-女(請填數字)"
                            type="text"
                            name="temp_fee_F"
                            value={temp_fee_F || ''}
                            id="temp_fee_F"
                            placeholder="200"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2 mt-4">
                        <TextArea
                            label="臨打詳細說明"
                            name="temp_content"
                            value={temp_content || ''}
                            id="temp_content"
                            placeholder="請輸入球隊臨打的詳細說明..."
                            onChange={onChange}
                        />
                    </div>
                    <div className="sm:col-span-2"><UseHr /></div>
                    <div className="w-full mt-4">
                        <Switch
                            label="球隊狀態"
                            yesText="上線"
                            noText="下線"
                            yesValue="online"
                            noValue="offline"
                            id="status"
                            value={status}
                            onChange={onChange}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="line"
                            type="text"
                            name="line"
                            value={line || ''}
                            id="line"
                            placeholder="badminton"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="FB"
                            type="text"
                            name="fb"
                            value={fb || ''}
                            id="fb"
                            placeholder="https://facebook.com"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="Youtube"
                            type="text"
                            name="youtube"
                            value={youtube || ''}
                            id="youtube"
                            placeholder="https://youtube.com"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="網站"
                            type="text"
                            name="website"
                            value={website || ''}
                            id="website"
                            placeholder="https://"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2"><UseHr /></div>
                    <div className="sm:col-span-2 mt-4">
                        <TextArea
                            label="繳費詳細說明"
                            name="charge"
                            value={charge || ''}
                            id="charge"
                            placeholder="請輸入球隊繳費的詳細說明..."
                            onChange={onChange}
                        />
                    </div>
                    <div className="sm:col-span-2 mt-4">
                        <TextArea
                            label="球隊詳細說明"
                            name="content"
                            value={content || ''}
                            id="content"
                            placeholder="請輸入球隊的詳細說明..."
                            onChange={onChange}
                        />
                    </div>
                    <div className="mb-6"></div>
                    
                    <div className="sm:col-span-2 flex justify-center"><PrimaryButton type="submit" extraClassName="w-full lg:w-60">送出</PrimaryButton></div>

                </div>
            </form>
        </div>
    )
}
export default EditTeam

function noSec(time) {
    const date = new Date('01 Jan 1970 ' + time)
    const h = (date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()
    const m = (date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()
    return h + ":" + m
}