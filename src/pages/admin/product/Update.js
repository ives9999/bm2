import {useContext, useState, useEffect, useReducer} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI, postUpdateAPI } from '../../../context/product/ProductAction'
import Tab from '../../../component/Tab'
import Input from "../../../component/form/Input";
import Radio from '../../../component/form/Radio'
import Checkbox from '../../../component/form/Checkbox'
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import { arrayMove } from '@dnd-kit/sortable'
import ProductAttribute from '../../../component/product/ProductAttribute'
import ProductPrice from '../../../component/product/ProductPrice'
import ProductContent from '../../../component/product/ProductContent'
import { PrimaryButton } from '../../../component/MyButton'
import { toProductRead} from '../../../context/to'
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
    name: '球拍',
    type: 'clothes',
    order_min: 1,
    order_max: 10,
    gateway: 'coin',
    shipping: 'direct',
    status: 'offline',
    unit: '件',
}

function UpdateProduct() {
    const {auth, setAlertModal, setIsLoading} = useContext(BMContext)
    const {token} = useParams()
    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '商品列表', href: '/admin/product', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [tabs, setTabs] = useState([
        {key: 'data', name: '基本資訊', to: 'data', active: true},
        {key: 'image', name: '圖片設定', to: 'image', active: false},
        {key: 'attribute', name: '屬性設定', to: 'attribute', active: false},
        {key: 'price', name: '價格設定', to: 'price', active: false},
        {key: 'detail', name: '詳細介紹', to: 'detail', active: false},
    ])
    const [formData, setFormData] = useState({
        id: 0,
        name: '新增商品',
        status: 'online',
    })

    const {id, name, unit, order_min, order_max, invoice_name} = formData
    const [types, setTypes] = useState([])
    const [gateways, setGateways] = useState([])
    const [shippings, setShippings] = useState([])
    const [statuses, setStatuses] = useState([])
    const [attributes, setAttributes] = useState([])
    const [prices, setPrices] = useState([])
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
        } else if (id === 'order_min') {
            error = {orderMinError:{message: ''}}
        } else if (id === 'order_max') {
            error = {orderMaxError:{message: ''}}
        } else if (id === 'unit') {
            error = {unitError:{message: ''}}
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
        const renderTypes = (types, type) => {
            setTypes(() => {
                //const types = data.types
                let allTypes = []
                for (const type1 in types) {
                    const active = (type === type1) ? true : false
                    //const active = (data.type === type1) ? true : false
                    const obj = {key: type1, text: types[type1], value: type1, active: active}
                    allTypes.push(obj)
                }
                return allTypes
            })
        }

        // gateways: [{credit: '信用卡'}, ...]
        // gateway: credit,cash
        const renderGateways = (gateways, gateway) => {
            setGateways(() => {
                const gatewayArr = (gateway) ? gateway.split(',') : '';
                let allGateways = [];
                Object.keys(gateways).forEach(key => {
                    const value = gateways[key];
                    //console.info(item);
                    let active = false;
                    for (const method of gatewayArr) {
                        active = (method === key) ? true : false;
                    }
                    const obj = {key: key, text: value, value: key, active: active};
                    allGateways.push(obj);
                });
                return allGateways
            })
        }

        const renderShippings = (shippings, shipping) => {
            setShippings(() => {
                const shippingArr = (shipping) ? shipping.split(',') : '';
                let allShippings = [];
                Object.keys(shippings).forEach(key => {
                    const value = shippings[key];
                    let active = false;
                    for (const method of shippingArr) {
                        active = (method === key) ? true : false
                    }
                    const obj = {key: key, text: value, value: key, active: active};
                    allShippings.push(obj)
                });
                return allShippings
            })
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

        const getOne = async (token, scenario) => {
            let data = await getOneAPI(token, scenario);
            data = data.data
            if (scenario === 'create') {
                data = {...data, ...initData};
            }
            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '/admon/product/update', current: true }]
            })
            setFormData((prev) => {
                return {...prev, ...data}
            })

            renderTypes(data.types, data.type);
            renderGateways(data.gateways, data.gateway);
            renderShippings(data.shippings, data.shipping);
            renderStatuses(data.statuses, data.status);
            
            

            if (data.attributes) {
                const attributes = data.attributes
                // "attributes": [
                //     {
                //         "id": 24,
                //         "product_id": 44,
                //         "attribute": "{\"藍色\",\"粉色\",\"黑色\",\"白色\"}",
                //         "name": "顏色",
                //         "alias": "color",
                //         "placeholder": "藍色"
                //     }
                // ],
                attributes.forEach((attribute, idx) => {
                    const x = attribute.attribute.replace('}', '').replace('{', '').replaceAll('"', '')
                    const xs = x.split(',')
                    attributes[idx]['attribute'] = xs
                })
                setAttributes(attributes)
                // attributes: [
                //     {
                //         "id": 24,
                //         "product_id": 44,
                //         "attribute": ["藍色","粉色","黑色","白色"],
                //         "name": "顏色",
                //         "alias": "color",
                //         "placeholder": "藍色"
                //     }
                // ],
            }
            if (data.prices) {
                setPrices(data.prices)
            }

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
                return [...prev, { name: '新增商品', href: '/admon/product/update', current: true }]
            })
        }
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

    

    // const editAttribute = () => {
    //     setIsModalShow(true)
    // }

    // const close = () => {
    //     setIsModalShow(false)
    // }

    const onSubmit = async (e) => {
        e.preventDefault()

        let isPass = true
        // 偵測姓名沒有填的錯誤
        if (name === undefined || name.length === 0) {
			dispatch({type: PRODUCTNAMEBLANK})
			isPass = false
        }
        if (order_min === undefined || order_min.length === 0) {
			dispatch({type: ORDERMINBLANK})
			isPass = false
        }
        if (order_max === undefined || order_max.length === 0) {
			dispatch({type: ORDERMAXBLANK})
			isPass = false
        }
        if (unit === undefined || unit.length === 0) {
			dispatch({type: UNITBLANK})
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
        postFormData.delete('types')
        postFormData.delete('type_text')
        postFormData.delete('statuses')
        postFormData.delete('status_text')
        postFormData.delete('gateways')
        postFormData.delete('shippings')
        postFormData.delete('attributes')
        postFormData.delete('prices')
        postFormData.delete('slug');
        postFormData.delete('pv');
        postFormData.delete('sort_order');
        postFormData.delete('created_at');
        postFormData.delete('updated_at');

        const typeSelected = types.filter((item) => item.active === true)
        if (typeSelected.length > 0) {
            postFormData.delete('type')
            postFormData.append('type', typeSelected[0].value)
        }

        const statusSelected = statuses.filter((item) => item.active === true)
        if (statusSelected.length > 0) {
            postFormData.delete('status')
            postFormData.append('status', statusSelected[0].value)
        }

        const gatewaysSelected = gateways.filter((item) => item.active === true)
        postFormData.delete('gateway')
        let res = []
        gatewaysSelected.map((item) => res.push(item.value))
        postFormData.append('gateway', res.join(','))

        const shippingsSelected = shippings.filter((item) => item.active === true)
        postFormData.delete('shipping')
        res = []
        shippingsSelected.map((item) => res.push(item.value))
        postFormData.append('shipping', res.join(','))

        attributes.map((item) => {
            console.info(item.attribute);
            let x = item.attribute.join(',')
            item.attribute = x
            return item
        })
        postFormData.delete('attribute')
        postFormData.append('attribute', JSON.stringify(attributes))

        postFormData.delete('price')
        postFormData.append('price', JSON.stringify(prices))

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
            const message = "恭喜您建立商品成功！！"
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
                        <Tab items={tabs} to={handleTab} />
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                        <div className="sm:col-span-2">
                            <Input 
                                label="商品名稱"
                                type="text"
                                name="name"
                                value={name || ''}
                                id="name"
                                placeholder="球拍"
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
                            <Checkbox
                                label="付款方式"
                                id="gateway"
                                items={gateways}
                                setChecked={setGateways}
                                setStatus={setFormData}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Checkbox
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
                        <ProductAttribute 
                            product_id={id}
                            attributes={attributes} 
                            setAttributes={setAttributes} 
                            alert={setAlertModal}
                        />
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[3].active ? '' : 'hidden'}`}>
                        <ProductPrice 
                            product_id={id}
                            prices={prices} 
                            setPrices={setPrices} 
                            alert={setAlertModal}
                        />
                    </div>
                    <div className={`mt-6 lg:mx-0 ${tabs[4].active ? '' : 'hidden'}`}>
                        <ProductContent
                            formData={formData} 
                            setFormData={setFormData} 
                        />
                    </div>
                    <div className="sm:col-span-2 flex flex-col lg:flex-row gap-4 justify-center">
                        <PrimaryButton type="submit" className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateProduct
