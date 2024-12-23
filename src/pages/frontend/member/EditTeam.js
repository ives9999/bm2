import { useContext, useReducer, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import {toast} from "react-toastify"
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../component/Breadcrumb'
import Input from "../../../component/form/Input";
import Checkbox from "../../../component/form/Checkbox";
import Radio from "../../../component/form/Radio";
import SearchBar from "../../../component/form/SearchBar";
import { TimePickerFor2 } from "../../../component/form/timePicker/TimePicker";
import TextArea from "../../../component/form/TextArea";
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import UseHr from "../../../component/UseHr";
import {PrimaryButton, CancelButton} from '../../../component/MyButton';
import { filterKeywordAPI } from "../../../context/arena/ArenaAction";
import { arrayMove } from '@dnd-kit/sortable'
import { postUpdateAPI, getOneAPI } from "../../../context/team/TeamAction";
import { noSec } from "../../../functions/date";
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
} from "../../../errors/TeamError"
import { 
    INSERTFAIL,
} from "../../../errors/Error"


var initData = {
    // name: "最好羽球團",
    // weekday: "1,2",
    // play_start: "19:00:00",
    // play_end: "21:00:00",
    // arena: {
    //     id: 44,
    //     token: 'VkcPYFJeCwUPAbaLbTcYOH1e7bWnDUN',
    //     name: 'TOPPRO 高手羽球館',
    //     value: 'TOPPRO 高手羽球館',
    //     isShowArenasList: false,
    // },
    // leader: "張大春",
    // mobile: "0933123456",
    // email: "david@gmail.com",
    // number: 16,
    // ball: 'YY-AS50',
    // degree: "new,soso",
    // block: 2,
    // people_limit: 4,
    // temp_fee_M: 250,
    // temp_fee_F: 200,
    // temp_content: '請準時到場，報名後請務必來參加並繳費，無故不到者，列入黑名單',
    // line: 'badminton',
    // fb: 'https://www.facebook.com',
    // youtube: 'https://youtube.com',
    // website: 'https://bm2.sportpassword.com',
    // content: '我們是一群享受打球快樂的羽球人，歡迎大家加入',
    // charge: '球隊採季繳方式，每季每人繳費3000元',
    // temp_status: 'online',
    // status: 'online',
}

const EditTeam = () => {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext)
    const initBreadcrumb = [
        { name: '會員', href: '/member', current: false },
        { name: '球隊', href: '/member/team', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)

    // const {token} = memberData
    const {token} = useParams()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '新增球隊',
        leader: '',
        arena: null,
        //images: [],
        status: 'online',
        temp_status: 'offline'
    });
    const [statuses, setStatuses] = useState([]);
    const [tempStatuses, setTempStatuses] = useState([]);

    const renderStatuses = (statuses, status) => {
        setStatuses(() => {
            let allStatuses = [];
            Object.keys(statuses).forEach(key => {
                const value = statuses[key];
                const active = (status === key) ? true : false
                const obj = {key: key, text: value, value: key, active: active};
                allStatuses.push(obj)
            });
            return allStatuses
        })
    }

    const renderTempStatuses = (status) => {
        // console.info(status);
        const statuses = {online: "上線", offline: '下線'};
        setTempStatuses(() => {
            let allTempStatuses = [];
            Object.keys(statuses).forEach(key => {
                const value = statuses[key];
                const active = (status === key) ? true : false;
                const obj = {key: key, text: value, value: key, active: active};
                allTempStatuses.push(obj);
            })
            return allTempStatuses;
        })
    };

    const renderWeekdays = (weekdays) => {
        // ["1", "2"]
        setWeekdayObj((prev) => {
            const newWeekdayObj = prev.map((item) => {
                if (weekdays.includes(item.key.toString())) {
                    item.active = true
                }
                return item
            })
            return newWeekdayObj
        });
    }
    const renderDegrees = (degrees) => {
        setDegreeObj((prev) => { 
            const newDegreeObj = prev.map((item) => {
                if (degrees.includes(item.key)) {
                    item.active = true
                }
                return item
            })
            return newDegreeObj
        })
    }

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        if (data.status === 200) {
            data = data.data
            setFormData(data)

            setBreadcrumbs(() => {
                const name = (data.name) ? data.name : '新增球隊';
                return [...initBreadcrumb, { name: name, href: '/member/team/editTeam', current: true }]
            })
            renderStatuses(data.statuses, data.status);
            renderTempStatuses(data.temp_status);
            const weekdays = (data.weekdays !== undefined && data.weekdays !== null) ? data.weekdays.split(',') : []
            renderWeekdays(weekdays);
            const degrees = (data.degree !== undefined && data.degree !== null) ? data.degree.split(',') : []
            renderDegrees(degrees);
            
            // 設定打球時間
            setTime((prev) => ({...prev, startTime: noSec(data.play_start), endTime: noSec(data.play_end)}))

            //console.info(data.images)
            if (data.images !== undefined && data.images !== null && data.images.length > 0) {
                setFiles((prev) => {
                    var count = prev.length
                    const temp = data.images.map(image => {
                        var file = {}
                        file.name = image.path
                        // 圖片加入索引值
                        file.id = count + 1
                        file.upload_id = image.upload_id
                        file.isFeatured = image.isFeatured
        
                        count++

                        return file
                    })
                    //console.info(temp)
                    return [...prev, ...temp]
                })

                setAllImages((prev) => {
                    const temp = data.images.map(image => {
                        const oneImage = {
                            name: image.path, 
                            upload_id: image.upload_id,
                            sort_order: image.sort_order,
                            isFeatured: image.isFeatured,
                            status: "online",
                        }
                        return oneImage
                    })
                    return [...prev, ...temp]
                })
            }
        }
        return data;
    }

    useEffect(() => {
        if (token !== undefined && token.length > 0) {
            getOne(token, 'update');
        } else {
            setFormData(initData);
            getOne('', 'create');
            setBreadcrumbs((prev) => {
                return [...prev, { name: '新增球隊', href: '/member/editTeam', current: true }]
            })
        }
        
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

    // 球隊上傳圖片，是一個js File物件的陣列
    // [{
    //      id:1
    //      name:"2015-08-13 23.24.26-1 _Recovered_-01.png"
    // }]
    const [files, setFiles] = useState([])

    // 球隊上傳圖片管理陣列，是一個單純物件的陣列
    // [{
    //      name: "2015-08-13 23.24.26-1 _Recovered_-01.png"
    //      upload_id: 4053，資料庫圖片的編號，如果是本地端選擇則為0
    //      sort_order: 174356，數字越大排序越前面，資料庫圖片則為資料庫中的數字，
    //                          如果是本地端選擇則為由本地端產生，當使用者拖曳改變位置排序時，必須更新此數值，已更新排序
    //      isFeatured: true表示是代表圖，false表示不是
    //      status: online表示正常圖片，create表示新建的圖片，delete表示刪除的圖片
    // }]
    const [allImages, setAllImages] = useState([])

    // 新增圖片
    const addFiles = (acceptedFiles) => {
        setFiles((prev) => {
            var count = prev.length
            const temp = acceptedFiles.map(file => {
                // 圖片加入索引值
                file.id = count + 1
                file.upload_id = 0
                file.isAdd = true;
                count++
                return file
            })
            return [...prev, ...temp]
        })

        // files 是針對本地端上傳圖片更改介面的物件陣列，並用該陣列的資料來傳送上傳的圖片檔案
        // 後端根據files的資料來做檔案處理
        // allImages 是針對圖片所有的操作，例如新增、刪除、更換位置與設定代表圖等資訊的陣列
        // 後端根據allImages的資料來做更新與刪除
        setAllImages((prev) => {
            var sort_order = Math.floor(Date.now() / 10000000)
            prev.map(item => (sort_order = item.sort_order))
            sort_order -= 100
            const temp = acceptedFiles.map(file => {
                const oneImage = {
                    name: file.name, 
                    upload_id: 0,
                    sort_order: sort_order,
                    isFeatured: false,
                    status: "create",
                }
                sort_order -= 100
                return oneImage
            })
            return [...prev, ...temp]
        })
    }

    // 刪除圖片
    const deleteFiles = (name) => {
        setFiles((prev) => {
            return prev.filter(item => item.name !== name)
        })

        setAllImages((prev) => {
            const temp = prev.map(item => {
                if (item.name === name) {
                    item.status = "delete"
                }
                return item
            })
            return temp
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

        setAllImages((prev) => {
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
        var oldIndex = 0
        var newIndex = 0
        setFiles((prev) => {
            // 被拖曳的那一個
            oldIndex = prev.findIndex(item => item.id === active.id)
            // 放開的那一個
            newIndex = prev.findIndex(item => item.id === over.id)
            
            return arrayMove(prev, oldIndex, newIndex);
        });

        setAllImages((prev) => {
            const oldSortOrder = prev[oldIndex].sort_order
            const newSortOrder = prev[newIndex].sort_order
            prev[oldIndex].sort_order = newSortOrder
            prev[newIndex].sort_order = oldSortOrder
            return arrayMove(prev, oldIndex, newIndex)
        })
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
        {key: 1, text: '一', value: 1, active: false},
        {key: 2, text: '二', value: 2, active: false},
        {key: 3, text: '三', value: 3, active: false},
        {key: 4, text: '四', value: 4, active: false},
        {key: 5, text: '五', value: 5, active: false},
        {key: 6, text: '六', value: 6, active: false},
        {key: 7, text: '日', value: 7, active: false},
    ]

    const [weekdayObj, setWeekdayObj] = useState(initWeekdays)

    // 球隊程度
    var initDegrees = [
        {key: 'new', text: '新手', value:'new', active: false},
        {key: 'soso', text: '普通', value:'soso', active: false},
        {key: 'high', text: '高手', value:'high', active: false},    
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
        if (mobile === undefined || mobile === null || mobile.length === 0) {
            dispatch({type: TEAMMOBILEBLANK})
			return
        }
        if (email === undefined || email === null || email.length === 0) {
            dispatch({type: TEAMEMAILBLANK})
			return
        }
        if (arena === undefined || arena.length === 0) {
            dispatch({type: ARENABLANK})
			return
        }
        if (leader === undefined || leader === null || leader.length === 0) {
			dispatch({type: LEADERBLANK})
			return
        }

        const postFormData = new FormData()
        Object.keys(formData).map(key => {
            if (key !== 'featured' && key !== 'images[]' && key !== 'images') {
                const value = formData[key]
                postFormData.append(key, value)
            }
            return key
        })
        // for (var pair of postFormData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }

        // 如果是從遠端來，則圖片的json如下
        // [
        //     {
        //       "path": "http://bm.sportpassword.localhost/uploads/11/a7/11a7fda68935b44c36d67bd003692b5c.jpg",
        //       "name": "http://bm.sportpassword.localhost/uploads/11/a7/11a7fda68935b44c36d67bd003692b5c.jpg",
        //       "upload_id": "4753",  // 資料庫upload id
        //       "id": 1,
        //       "isFeatured": true
        //     },
        //     {
        //       "path": "http://bm.sportpassword.localhost/uploads/b8/04/b80470bdd7f8cd9c6c735b0b24d1c040.jpg",
        //       "name": "http://bm.sportpassword.localhost/uploads/b8/04/b80470bdd7f8cd9c6c735b0b24d1c040.jpg",
        //       "id": 2,
        //       "upload_id": "4752",
        //       "isFeatured": false
        //     }
        //   ]

        // 如果是從使用者端選擇，則圖片json如下，每一個json都是File物件
        // [
        //     {
        //       "path": "IMG_20190705_155518.jpg",
        //       "id": 1,
        //       "upload_id": 0,
        //       "isFeatured": false
        //     },
        //     {
        //       "path": "line_2268553639150796.jpg",
        //       "id": 2,
        //       "upload_id": 0,
        //       "isFeatured": false
        //     }
        //   ]

        // 設定圖片
        files.map((file) => {
            if (file.upload_id === 0) {
                postFormData.append("images[]", file)
            }
            return file
        })
        postFormData.set("allImages", JSON.stringify(allImages))

        postFormData.set('arena_id', arena.id)
        postFormData.delete('arena')
        //postFormData.append("manager_token", auth.token)
        postFormData.delete('statuses');
        postFormData.delete('status_text');
        postFormData.delete('_links');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');
        postFormData.delete('member');
        postFormData.delete('token');
        postFormData.delete('sort_order');
        postFormData.delete('pv');
        postFormData.delete('slug');
        postFormData.delete('channel');
        // Display the key/value pairs
        
        setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("team_token", token)
        }
        for (var pair of postFormData.entries()) {
            console.log(pair[0]+ ':' + pair[1]); 
        }
        const data = await postUpdateAPI(auth.accessToken, postFormData)

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
            const message = "恭喜您建立球隊成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
                //onOK: navigate('/member/team'),
            }
            setAlertModal(obj)
        }
    }

    const onCancel = () => {
        navigate('/member/team');
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{name ? name : '新增球隊'}</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="flex items-end justify-end mb-4 mr-4 lg:mr-0">
                    <PrimaryButton type="submit" className="w-40 lg:w-60 mt-6">送出</PrimaryButton>
                </div>
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
                            <OutlineButton type="button" className="w-full" onClick={onSelect}>選擇</OutlineButton>
                            <CancelButton className="w-full" onClick={onClearImage}>清除</CancelButton>
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
                            rows={arenas.list}
                            handleChange={onChange}
                            onClear={handleClear}
                            setSelected={setArena}
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
                            id="weekdays"
                            items={weekdayObj}
                            setChecked={setWeekdayObj}
                            setStatus={setFormData}
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
                            id="degree"
                            items={degreeObj}
                            setChecked={setDegreeObj}
                            setStatus={setFormData}
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
                        <Radio
                            label="臨打狀態"
                            id="temp_status"
                            items={tempStatuses}
                            setChecked={setTempStatuses}
                            setStatus={setFormData}
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
                        <Radio
                            label="球隊狀態"
                            id="status"
                            items={statuses}
                            setChecked={setStatuses}
                            setStatus={setFormData}
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
                    
                    <div className="sm:col-span-2 flex flex-col lg:flex-row gap-4 justify-center">
                        <PrimaryButton type="submit" className="w-full lg:w-60">送出</PrimaryButton>
                        <CancelButton type="button" onClick={onCancel} className="w-full lg:w-60">取消</CancelButton>
                    </div>

                </div>
            </form>
        </div>
    )
}
export default EditTeam
