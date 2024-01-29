import {useContext, useState, useEffect, useReducer} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction'
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import Radio from '../../../component/form/Radio'
import Checkbox1 from '../../../component/form/Checkbox1'
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import { arrayMove } from '@dnd-kit/sortable'
import { PrimaryOutlineButton, OKButton, CancelButton } from '../../../component/MyButton'
import Overlay from '../../../component/Overlay'
import { XMarkIcon } from '@heroicons/react/20/solid'


function UpdateProduct() {
    const {memberData, setAlertModal, setIsLoading} = useContext(BMContext)
    const {token} = useParams()
    const [breadcrumbs, setBreadcrumbs] = useState([
            { name: '後台首頁', href: '/admin', current: false },
            { name: '商品列表', href: '/admin/product', current: false },
    ])
    const [tabs, setTabs] = useState([
        {key: 'data', name: '基本資訊', to: 'data', active: true},
        {key: 'image', name: '圖片設定', to: 'image', active: false},
        {key: 'attribute', name: '屬性設定', to: 'attribute', active: false},
        {key: 'price', name: '價格設定', to: 'price', active: false},
        {key: 'detail', name: '詳細介紹', to: 'detail', active: false},
    ])
    const [formData, setFormData] = useState({
        name: '新增商品',
        status: 'online',
    })

    const {name, unit, order_min, order_max, invoice_name} = formData
    const [types, setTypes] = useState([])
    const [gateways, setGateways] = useState([])
    const [shippings, setShippings] = useState([])
    const [statuses, setStatuses] = useState([])
    const [isModalShow, setIsModalShow] = useState(false)
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
        unitError: obj,
        orderMinError: obj,
        orderMaxError: obj,
    }

    const errorReducer = (state=initalError, action) => {
    }

    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        if (e.target.id === 'gateway') {
        } else if (e.target.id === 'shipping') {
        
        } else if (e.target.id === 'type') {
        } else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }

        //clearError(e.target.id)
    }

    const handleClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
		clearError(id)
    }

    const clearError = (id) => {
        var error = {}
		if (id === 'name') {
			error = {nameError:{message: ''}}
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
        const getOne = async (token) => {
            var data = await getOneAPI(token, 'update')
            setBreadcrumbs((prev) => {
                return [...prev, { name: data.data.name, href: '/admon/product/update', current: true }]
            })
            setFormData((prev) => {
                return {...prev, ...data.data}
            })
            setTypes(() => {
                const types = data.data.types
                let allTypes = []
                for (const type1 in types) {
                    const active = (data.data.type === type1) ? true : false
                    const obj = {key: type1, text: types[type1], value: type1, active: active}
                    allTypes.push(obj)
                }
                return allTypes
            })
            setGateways(() => {
                const gateways = data.data.gateway.split(',')
                let allGateways = []
                for (const gateway1 in data.data.gateways) {
                    let active = false
                    for (const idx in gateways) {
                        active = (gateways[idx] === gateway1) ? true : false
                    }
                    const obj = {key: gateway1, text: data.data.gateways[gateway1], value: gateway1, active: active}
                    allGateways.push(obj)
                }
                return allGateways
            })
            setShippings(() => {
                const shippings = data.data.shipping.split(',')
                let allShippings = []
                for (const shipping1 in data.data.shippings) {
                    let active = false
                    for (const idx in shippings) {
                        active = (shippings[idx] === shipping1) ? true : false
                    }
                    const obj = {key: shipping1, text: data.data.shippings[shipping1], value: shipping1, active: active}
                    allShippings.push(obj)
                }
                return allShippings
            })
            setStatuses(() => {
                const statuses = data.data.statuses
                let allStatuses = []
                for (const status1 in statuses) {
                    const active = (data.data.status === status1) ? true : false
                    const obj = {key: status1, text: statuses[status1], value: status1, active: active}
                    allStatuses.push(obj)
                }
                return allStatuses
            })
        }

        if (token !== undefined && token.length > 0) {
            getOne(token)
        } else {
            setBreadcrumbs((prev) => {
                return [...prev, { name: '新增商品', href: '/admon/product/update', current: true }]
            })
        }
    }, [token])

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

    const editAttribute = () => {
        setIsModalShow(true)
    }

    const close = () => {
        setIsModalShow(false)
    }

    const onSubmit = async () => {

    }

    return (
        <div className='p-4'>
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{formData.name}</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                <Tab items={tabs} to={handleTab} />
                    <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
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
                            <Radio
                                label="類型"
                                id="type"
                                items={types}
                                setChecked={setTypes}
                                setStatus={setFormData}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="最小訂購數量"
                                type="text"
                                name="order_min"
                                value={order_min || ''}
                                id="order_min"
                                placeholder="1"
                                isRequired={true}
                                errorMsg={errorObj.orderMinError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="最大訂購數量"
                                type="text"
                                name="order_max"
                                value={order_max || ''}
                                id="order_max"
                                placeholder="5"
                                isRequired={true}
                                errorMsg={errorObj.orderMaxError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Checkbox1
                                label="付款方式"
                                id="gateway"
                                items={gateways}
                                setChecked={setGateways}
                                setStatus={setFormData}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Checkbox1
                                label="配送方式"
                                id="shipping"
                                items={shippings}
                                setChecked={setShippings}
                                setStatus={setFormData}
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
                        <div className="">
                            <Input 
                                label="商品單位"
                                type="text"
                                name="unit"
                                value={unit || ''}
                                id="unit"
                                placeholder="件"
                                isRequired={true}
                                errorMsg={errorObj.unitError.message}
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                        <div className="">
                            <Input 
                                label="發票上商品名稱"
                                type="text"
                                name="invoice_name"
                                value={invoice_name || ''}
                                id="invoice_name"
                                placeholder="球拍，若無特殊，可不填"
                                onChange={onChange}
                                onClear={handleClear}
                            />
                        </div>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
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
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[2].active ? '' : 'hidden'}`}>
                        <div className="flex">
                            <PrimaryOutlineButton type='button' className='ml-auto mr-4 md:mr-0' onClick={editAttribute}>新增屬性</PrimaryOutlineButton>
                        </div>
                        <div className='mt-4 pt-8 pb-2 bg-MenuBGLight grid grid-cols-2 lg:grid-cols-4 gap-2 justify-center'>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <Overlay isHidden={!isModalShow} />
            <div className={`w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center ${isModalShow ? "" : "hidden"}`}>
                <div tabIndex="-1" id=":r2:" role="dialog" className="h-full w-full p-4 md:h-auto max-w-2xl" aria-labelledby=":ru:">
                    <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
                            <h3 id=":ru:" className={`text-xl font-medium  dark:text-Primary-400`}>編輯屬性</h3>
                            <button aria-label="Close" onClick={close} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                                <XMarkIcon className='h-6 w-6 text-Primary-400' />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-auto">
                            <div className="space-y-6">
                                <div className="">
                                    <Input 
                                        label="名稱"
                                        type="text"
                                        name="attribute_name"
                                        value=''
                                        id="name"
                                        placeholder="尺寸、顏色...等等"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                </div>
                                <div className="">
                                    <Input 
                                        label="英文代號"
                                        type="text"
                                        name="attribute_alias"
                                        value=''
                                        id="name"
                                        placeholder="size, color...等等"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                </div>
                                <div className="">
                                    <Input 
                                        label="預設説明文字"
                                        type="text"
                                        name="attribute_desc"
                                        value=''
                                        id="name"
                                        placeholder="M, L, 天空藍、蘋果紅...等等"
                                        onChange={onChange}
                                        onClear={handleClear}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                            <OKButton onClick={close}>確定</OKButton>
                            <CancelButton onClick={close}>取消</CancelButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateProduct
