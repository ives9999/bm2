import { useContext, useReducer, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import SelectCity from "../../../component/form/SelectCity";
import SelectArea from "../../../component/form/SelectArea";
import {citys, areas} from "../../../zone.js"
import Radio from "../../../component/form/Radio";
import { TimePickerFor2 } from "../../../component/form/timePicker/TimePicker";
import UseHr from "../../../component/UseHr.js";
import TextArea from "../../../component/form/TextArea.jsx";
import {PrimaryButton, CancelButton} from '../../../component/MyButton';
// import SearchResultsList from "../../../component/form/searchbar/SearchResultsList";
// import { filterKeywordAPI } from "../../../context/arena/ArenaAction";
import { arrayMove } from '@dnd-kit/sortable'
import { postUpdateAPI, getOneAPI } from "../../../context/arena/ArenaAction";
import { noSec } from "../../../functions/date";
import {
    ARENANAMEBLANK,
    ARENATELBLANK,
    ARENACITYBLANK,
    ARENAAREABLANK,
    ARENAROADBLANK,
    GetArenaNameBlankError,
    GetArenaTelBlankError,
    GetArenaCityBlankError,
    GetArenaAreaBlankError,
    GetArenaRoadBlankError,
} from "../../../errors/ArenaError"
import { 
    INSERTFAIL,
} from "../../../errors/Error"

var initData = {}

const EditArena = () => {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext)
    const initBreadcrumb = [
        { name: '會員', href: '/member', current: false },
        { name: '球館', href: '/member/editArena', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);
    const {token} = useParams()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '新增球館',
        status: 'online',
    });
    const {open_time, close_time} = formData;
    const [statuses, setStatuses] = useState([]);

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        telError: obj,
        cityError: obj,
        areaError: obj,
        roadError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, telState, cityState, areaState, roadState] = [{}, {}, {}, {}, {}, {}, {}, {}]
        switch (action.type) {
            case ARENANAMEBLANK:
                nameState = {code: ARENANAMEBLANK, message: GetArenaNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case ARENATELBLANK:
                telState = {code: ARENATELBLANK, message: GetArenaTelBlankError().msg}
                newState = {loading: false, telError: telState}
                return {...state, ...newState}    
            case ARENACITYBLANK:
                cityState = {code: ARENACITYBLANK, message: GetArenaCityBlankError().msg}
                newState = {loading: false, cityError: cityState}
                return {...state, ...newState}
            case ARENAAREABLANK:
                areaState = {code: ARENAAREABLANK, message: GetArenaAreaBlankError().msg}
                newState = {loading: false, areaError: areaState}
                return {...state, ...newState}
            case ARENAROADBLANK:
                roadState = {code: ARENAROADBLANK, message: GetArenaRoadBlankError().msg}
                newState = {loading: false, roadError: roadState}
                return {...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

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

    // 要設定球館開關時間的物件
    const [time, setTime] = useState({
        openTime: open_time,
        closeTime: close_time,
        isShowOpen: false,
        isShowClose: false,
    });

    var selectedAreas = [{city: 0, id: 0, name: "無"}];
    const [cityAreas, setCityAreas] = useState(selectedAreas);
    const [bathroom, setBathroom] = useState([]);
    const [parking, setParking] = useState([]);
    const [airCondition, setAirCondition] = useState([]);

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

    const renderBathroom = (num) => {
        setBathroom(() => {
            let allBathroom = []
            for (let i = 0; i < 4; i++) {
                const active = (i === num) ? true : false
                const obj = {key: "bathroom_"+i, text: (i === 0) ? "無" : i, value: i, active: active}
                allBathroom.push(obj)
            }
            allBathroom.push({key: "bathroom_4", text: "4個以上", value: 4, active: num===4 ? true : false});
            return allBathroom
        })
    }

    const renderParking = (isParking) => {
        setParking(() => {
            let all = []
            all.push({key: "parking_1", text: "有", value: 1, active: isParking === 1 ? true : false});
            all.push({key: "parking_0", text: "無", value: 0, active: isParking === 0 ? true : false});
            return all
        })
    }

    const renderAirCondition = (isAirCondition) => {
        setAirCondition(() => {
            let all = []
            all.push({key: "ariCondition_1", text: "有", value: 1, active: isAirCondition === 1 ? true : false});
            all.push({key: "ariCondition_0", text: "無", value: 0, active: isAirCondition === 0 ? true : false});
            return all
        })
    }

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        if (data.status === 200) {
            data = data.data
            console.info(data);
            setFormData(data)

            setBreadcrumbs(() => {
                const name = (data.name) ? data.name : '新增球隊';
                return [...initBreadcrumb, { name: name, href: '/member/team/editTeam', current: true }]
            })

            // 當縣市id有改變時，要產生該縣市的區域
            if (data.city_id > 0 && data.area_id > 0) {
                setAreaFromCity(data.city_id)
            }
            renderStatuses(data.statuses, data.status);
            
            // 設定球館開關時間
            setTime((prev) => ({...prev, openTime: noSec(data.open_time), closeTime: noSec(data.close_time)}))
            renderBathroom(data.bathroom);
            renderParking(data.parking);
            renderAirCondition(data.parking);

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
                return [...prev, { name: '新增球場', href: '/member/editArena', current: true }]
            })
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        // 如果是變更縣市，則區域選擇改為"無“
        if (e.target.id === 'city_id') {
            setAreaFromCity(parseInt(e.target.value))
        }
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        clearError(e.target.id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'name') {
			error = {nameError:{message: ''}}
        } else if (id === 'tel') {
            error = {telError:{message: ''}}
        } else if (id === 'city_id') {
            error = {cityError:{message: ''}}
        } else if (id === 'area_id') {
            error = {areaError:{message: ''}}
        } else if (id === 'road') {
            error = {roadError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
		clearError(id)
        if (id === 'city_id') {
            //memberDispatch({type: 'UPDATE', payload: {area_id: ""}})
            setFormData((prev) => ({...prev, ...{area_id: ""}}));

        }
    }


    const onSubmit = async (e) => {
        e.preventDefault()
        if (formData.name === undefined || formData.name.length === 0) {
			dispatch({type: ARENANAMEBLANK})
			return
        }
        if (formData.tel === undefined || formData.tel === null || formData.tel.length === 0) {
            dispatch({type: ARENATELBLANK})
			return
        }
        if (formData.city_id <= 0) {
            dispatch({type: ARENACITYBLANK})
			return
        }
        if (formData.area_id <= 0) {
            dispatch({type: ARENAAREABLANK})
			return
        }
        if (formData.road === undefined || formData.road === null || formData.road.length === 0) {
			dispatch({type: ARENAROADBLANK})
			return
        }

        const postFormData = new FormData()
        Object.keys(formData).map(key => {
            if (key !== 'featured' && key !== 'images[]' && key !== 'images') {
                const value = formData[key]
                postFormData.append(key, value)
            }
            return key
        });

        // 設定圖片
        files.map((file) => {
            if (file.upload_id === 0) {
                postFormData.append("images[]", file)
            }
            return file
        })
        postFormData.set("allImages", JSON.stringify(allImages))

        postFormData.delete('statuses');
        postFormData.delete('status_text');
        postFormData.delete('_links');
        postFormData.delete('created_id');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');
        postFormData.delete('member');
        postFormData.delete('token');
        postFormData.delete('sort_order');
        postFormData.delete('pv');
        postFormData.delete('slug');
        postFormData.delete('channel');
        postFormData.delete('zone');
        postFormData.delete('manager_id');

        setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("arena_token", token)
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
            const message = "恭喜您建立球館成功！！"
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
        navigate('/member/arena');
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{formData.name ? formData.name : '新增球館'}</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="flex items-end justify-end mb-4 mr-4 lg:mr-0">
                    <PrimaryButton type="submit" className="w-40 lg:w-60 mt-6">送出</PrimaryButton>
                </div>
                <div className="mx-4 lg:mx-0 grid gap-4 sm:grid-cols-2 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <div className="sm:col-span-2">
                        <Input 
                            label="球館名稱"
                            type="text"
                            name="name"
                            value={formData.name || ''}
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
                            label="上傳球館圖片"
                            files={files}
                            addFiles={addFiles}
                            deleteFiles={deleteFiles}
                            setFeatured={setFeatured}
                            onDragDrop={onDragDrop}
                            name="images"
                            onChange={onChange}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="聯絡電話"
                            type="number"
                            name="tel"
                            value={formData.tel || ''}
                            id="tel"
                            placeholder="0235882456"
                            isRequired={true}
                            errorMsg={errorObj.telError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Input 
                            label="聯絡Email"
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            id="email"
                            placeholder="david@gmail.com"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="sm:col-span-2 flex flex-col xl:flex-row gap-4">
                        <SelectCity
                            citys={citys}
                            value={formData.city_id || 0}
                            errorMsg={errorObj.cityError.message}
                            isRequired={true}
                            container_className={'w-full xl:w-[20%]'}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                        <SelectArea
                            areas={cityAreas}
                            value={formData.area_id || 0}
                            errorMsg={errorObj.areaError.message}
                            isRequired={true}
                            container_className={'w-full xl:w-[20%]'}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                        <Input 
                            label="路名、街道巷弄等"
                            type="text"
                            name="road"
                            value={formData.road || ''}
                            id="road"
                            placeholder="中正路50號6F"
                            isRequired={true}
                            errorMsg={errorObj.roadError.message}
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mt-4 mb-4">
                        <TimePickerFor2 
                            label="營業時間"
                            startName="open_time"
                            startPlaceholder="開始時間"
                            endName="close_time"
                            endPlaceholder="結束時間"
                            startTime="09:00"
                            endTime="22:00"
                            step="30"
                            time={time}
                            setTime={setTime}
                            handleChange={onChange} 
                        />
                    </div>
                    <div className="w-full mt-4 mb-4">
                        <Input 
                            label="場地幾塊"
                            type="text"
                            name="block"
                            value={formData.block || ''}
                            id="block"
                            placeholder="6"
                            onChange={onChange}
                            onClear={handleClear}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <Radio
                            label="浴室幾間"
                            id="bathroom"
                            items={bathroom}
                            setChecked={setBathroom}
                            setStatus={setFormData}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <Radio
                            label="停車場"
                            id="parking"
                            items={parking}
                            setChecked={setParking}
                            setStatus={setFormData}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <Radio
                            label="空調"
                            id="airCondition"
                            items={airCondition}
                            setChecked={setAirCondition}
                            setStatus={setFormData}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <Radio
                            label="球館狀態"
                            id="status"
                            items={statuses}
                            setChecked={setStatuses}
                            setStatus={setFormData}
                        />
                    </div>
                    <div className="sm:col-span-2"><UseHr /></div>
                    <div className="sm:col-span-2 mt-4">
                        <TextArea
                            label="球館詳細說明"
                            name="content"
                            value={formData.content || ''}
                            id="content"
                            placeholder="請輸入球館的詳細說明，例如收費方式等等..."
                            onChange={onChange}
                        />
                    </div>
                    
                    <div className="sm:col-span-2 flex flex-col lg:flex-row gap-4 justify-center mt-8">
                        <PrimaryButton type="submit" className="w-full lg:w-60">送出</PrimaryButton>
                        <CancelButton type="button" onClick={onCancel} className="w-full lg:w-60">取消</CancelButton>
                    </div>

                </div>
            </form>
        </div>
    )
}
export default EditArena