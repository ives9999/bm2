import { useContext, useReducer, useState, useRef } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import SearchBar from "../../component/form/searchbar/SearchBar";
import { TimePickerFor2 } from "../../component/form/timePicker/TimePicker";
import UseHr from "../../component/UseHr";
import {PrimaryButton, OutlineButton, CancelButton} from '../../component/MyButton';
import SearchResultsList from "../../component/form/searchbar/SearchResultsList";
import { filterKeywordAPI } from "../../context/arena/ArenaAction";

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
    })

    const {name, leader, arena, email, mobile, featured, play_start, play_end} = formData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        leaderError: obj,
    }

    const errorReducer = (state=initalError, action) => {

    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    //搜尋球館時，當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        if (e.target.id === "arena") {
            const arena = {arena: {value: e.target.value}}
            setFormData({...formData, ...arena})
            if (e.target.value.length > 0) {
                fetchArenas(e.target.value)
            }
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
    const inputFileRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const onSelect = () => {
        inputFileRef.current.click()
    }

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // const src = URL.createObjectURL(e.target.files[0])
            setSelectedImage(e.target.files[0])
        }
    }

    // This functin will be triggered when the "Remove This Image" button is clicked
    const onClearImage = () => {
        //setIsRemote(false)
        const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
        setSelectedImage(noavatar)
        //setIsNoAvatarHidden(false)
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

    const onSubmit = (e) => {
        e.preventDefault()
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
                    <div className="w-full mt-4">
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
                        {/* <div className="relative w-64 h-64 overflow-hidden bg-myWhite mt-8">
                            <img className="absolute mx-auto rounded-full w-64 h-64 object-cover" src={(selectedImage !== null)?URL.createObjectURL(selectedImage):featured} alt={name} />
                        </div> */}
                        <div className="flex justify-stretch mt-8 h-12 gap-4">
                            <OutlineButton type="button" extraClassName="w-full" onClick={onSelect}>選擇</OutlineButton>
                            <CancelButton extraClassName="w-full" onClick={onClearImage}>清除</CancelButton>
                        </div>

                    </div>
                    <div className="w-full mt-4">
                        <div className="flex justify-between mb-2">
                            <label htmlFor="weekend" className="block text-MyWhite font-medium leading-6 ml-1">
                                星期幾打球
                            </label>
                        </div>
                        <div className="mb-4 grid grid-cols-4 lg:grid-cols-7">
                            {["一","二","三","四","五","六","七"].map((weekday, idx) => (
                            <div key={weekday} className="mr-8">
                                <input id="inline-checkbox" type="checkbox" value={idx+1} name="weekday" className="w-4 h-4 bg-gray-100 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="inline-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{weekday}</label>
                            </div>
                            ))}
                        </div>
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
                        <TimePickerFor2 
                            label="打球時間"
                            startName="play_start"
                            startValue="09:00"
                            startPlaceholder="開始時間"
                            endName="play_end"
                            endValue="11:00"
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
                    <div className="mb-6"></div>
                    
                    <PrimaryButton type="submit" extraClassName="w-full">送出</PrimaryButton>

                </div>
            </form>
        </div>
    )
}
export default EditTeam