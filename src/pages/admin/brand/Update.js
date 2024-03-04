import {useContext, useState, useEffect, useReducer} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI, postUpdateAPI } from '../../../context/brand/BrandAction'
import Input from "../../../component/form/Input";
import Radio from '../../../component/form/Radio';
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import { arrayMove } from '@dnd-kit/sortable'
import { PrimaryButton } from '../../../component/MyButton'
import {
    BRANDNAMEBLANK,
    ALIASBLANK,
    GetBrandNameBlankError,
    GetAliasBlankError,
} from '../../../errors/BrandError'
import { INSERTFAIL } from '../../../errors/Error'

const initData = {
    name: '李寧',
    alias: 'lining',
}

function UpdateBrand() {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext)
    const {token} = useParams()
    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '品牌列表', href: '/admin/brand', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [formData, setFormData] = useState({});

    const {name, alias, status} = formData
    const [statuses, setStatuses] = useState([])
    // 商品上傳圖片，是一個js File物件的陣列
    // [{
    //      id:1
    //      name:"2015-08-13 23.24.26-1 _Recovered_-01.png"
    // }]
    const [files, setFiles] = useState([])

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        aliasError: obj,
    }

    const errorReducer = (state=initalError, action) => {
        var [newState, nameState, aliasState] = [{}, {}, {}]
        switch (action.type) {
            case BRANDNAMEBLANK:
                nameState = {code: BRANDNAMEBLANK, message: GetBrandNameBlankError().msg}
                newState = {loading: false, nameError: nameState}
                return {...state, ...newState}
            case ALIASBLANK:
                aliasState = {code: ALIASBLANK, message: GetAliasBlankError().msg}
                newState = {loading: false, unitError: aliasState}
                return {...state, ...newState}
            case "CLEAR_ERROR":
                return {...state, ...action.payload}
            default:
                return state
        }
    }

    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        clearError(e.target.id)
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'name') {
			error = {nameError:{message: ''}}
        } else if (id === 'alias') {
            error = {aliasError:{message: ''}}
        }
        dispatch({type: 'CLEAR_ERROR', payload: error})
    }
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

    useEffect(() => {
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

        const getOne = async (token, scenario) => {
            let data = await getOneAPI(token, scenario);
            data = data.data
            if (scenario === 'create') {
                data = {...data, ...initData};
            }
            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '/admon/brand/update', current: true }]
            })
            setFormData((prev) => {
                return {...prev, ...data}
            })

            renderStatuses(data.statuses, data.status);

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

        if (token !== undefined && token.length > 0) {
            getOne(token, 'update');
        } else {
            setFormData(initData);
            getOne('', 'create');
            setBreadcrumbs((prev) => {
                return [...prev, { name: '新增品牌', href: '/admon/brand/update', current: true }]
            })
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault()

        let isPass = true
        // 偵測姓名沒有填的錯誤
        if (name === undefined || name.length === 0) {
			dispatch({type: BRANDNAMEBLANK})
			isPass = false
        }
        if (alias === undefined || alias.length === 0) {
			dispatch({type: ALIASBLANK})
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
        })
        postFormData.delete('token')
        postFormData.delete('statuses')
        postFormData.delete('status_text')
        postFormData.delete('sort_order');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');

        const statusSelected = statuses.filter((item) => item.active === true)
        if (statusSelected.length > 0) {
            postFormData.delete('status')
            postFormData.append('status', statusSelected[0].value)
        }

        // 設定圖片
        files.map((file) => {
            if (file.upload_id === 0) {
                postFormData.append("images[]", file)
            }
            return file
        })
        postFormData.set("allImages", JSON.stringify(allImages))

        setIsLoading(true)
        if (token !== undefined && token !== null && token.length > 0) {
            postFormData.append("product_token", token)
        }
        const data = await postUpdateAPI(auth.accessToken, postFormData)
        setIsLoading(false)

        for (var pair of postFormData.entries()) {
            console.log(pair[0]+ ':' + pair[1]); 
        }

        //console.info(data)
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
            const message = "恭喜您建立品牌成功！！"
            var obj = {
                modalType: 'success',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
                //onOK: toProductRead,
            }
            setAlertModal(obj)
        }
    }

    return (
        <div className='p-4'>
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{formData.name}</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                    <div className='mt-6 lg:mx-0 grid gap-4 sm:grid-cols-2'>
                        <div className="sm:col-span-2">
                            <Input 
                                label="品牌名稱"
                                type="text"
                                name="name"
                                value={name || ''}
                                id="name"
                                placeholder="李寧"
                                isRequired={true}
                                errorMsg={errorObj.nameError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="別名"
                                type="text"
                                name="alias"
                                value={alias || ''}
                                id="alias"
                                placeholder="lining"
                                isRequired={true}
                                errorMsg={errorObj.orderMinError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Dropzone
                                label="上傳品牌圖片"
                                files={files}
                                addFiles={addFiles}
                                deleteFiles={deleteFiles}
                                setFeatured={setFeatured}
                                onDragDrop={onDragDrop}
                                name="images"
                                onChange={onChange}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Radio
                                label="狀態"
                                id="status"
                                items={statuses}
                                setChecked={setStatuses}
                                setStatus={setFormData}
                            />
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

export default UpdateBrand
