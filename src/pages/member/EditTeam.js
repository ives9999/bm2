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
import {PrimaryButton, OutlineButton, CancelButton} from '../../component/MyButton';
import { filterKeywordAPI } from "../../context/arena/ArenaAction";
import { arrayMove } from '@dnd-kit/sortable'

var data = {
    name: "最好羽球團",
    weekday: "1,2",
    play_start: "19:00:00",
    play_end: "21:00:00",
}

const EditTeam = () => {
    const {memberData, setAlertModal, setIsLoading} = useContext(BMContext)
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '球隊', href: '/member/editTeam', current: false },
        { name: '新增球隊', href: '/member/editTeam', current: true },
    ]
    const {token} = memberData

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

        setFormData(data)
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
        weekday,
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
    } = formData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        leaderError: obj,
    }

    const errorReducer = (state=initalError, action) => {

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
        }
    }    

    const handleClear = (id) => {
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
    const setFeature = (e) => {
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
    const degrees = (degree !== undefined && degree !== null) ? degree.split(',') : []
    const [degreeObj, setDegreeObj] = useState([
        {key: 'new', value: '新手', checked: (degrees.filter((item) => item === 'new').length > 0) ? true : false},
        {key: 'soso', value: '普通', checked: (degrees.filter((item) => item === 'new').length > 0) ? true : false},
        {key: 'high', value: '高手', checked: (degrees.filter((item) => item === 'new').length > 0) ? true : false},
    ])

    const onSubmit = (e) => {
        e.preventDefault()
        //toast.success('錯誤的輸入!!')
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary text-center text-4xl font-bold mb-8">登錄球隊</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="mx-4 lg:mx-0 grid gap-4 sm:grid-cols-2 bg-MenuBG border border-MenuBorder p-8 rounded-lg">
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
                            setFeature={setFeature}
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
                        <SearchBar 
                            name="arena" 
                            value={(arena !== null && arena !== undefined && arena.value !== null && arena.value !== undefined) ? arena.value : ''} 
                            placeholder="請輸入球館名稱"
                            isShowList={arenas.isShowArenasList}
                            list={arenas.list}
                            handleChange={onChange} 
                            setResult={setArena}
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
                        <Input 
                            label="聯絡行動電話"
                            type="number"
                            name="mobile"
                            value={mobile || ''}
                            id="mobile"
                            placeholder="0934234876"
                            errorMsg={errorObj.nameError.message}
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
                            errorMsg={errorObj.nameError.message}
                            onChange={onChange}
                            onClear={handleClear}
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2"><UseHr /></div>
                    <div className="w-full mt-4">
                        <Input 
                            label="臨打人數(請填數字)"
                            type="text"
                            name="people_limit"
                            value={people_limit || ''}
                            id="people_limit"
                            placeholder="4"
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
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
                            errorMsg={errorObj.leaderError.message}
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