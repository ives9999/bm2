import {useState} from 'react'
import { PrimaryOutlineButton, EditButton, DeleteButton, OKButton, CancelButton } from '../MyButton'
import { MdClose, MdModeEditOutline } from "react-icons/md";
import Overlay from '../Overlay'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Input from '../form/Input';

function ProductAttribute({
    product_id,
    attributes,
    setAttributes,
    alert,
}) {
    // 編輯屬性說明資料
    const [formData, setFormData] = useState({
        index: 0,
        name: '',
        alias: '',
        placeholder: '',
    })
    // 編輯屬性中單一屬性值
    const [oneAttribute, setOneAttribute] = useState({
        alias: '',
        index: 0,
        value: '',
    })
    // 是否顯示編輯屬性對話盒
    const [isModalShow, setIsModalShow] = useState(false)
    // 是否顯示編輯單一屬性對話盒
    const [isSmallModalShow, setIsSmallModalShow] = useState(false)
    // 是否顯示遮罩
    const [isOverlayShow, setIsOverlayShow] = useState(false)

    // 編輯屬性時的formData
    const {index, name, alias, placeholder} = formData

    // 編輯單一屬性時輸入框值改變後的呼叫函式
    const onSmallInputChange = (e) => {
        setOneAttribute({
            ...oneAttribute,
            value: e.target.value
        })
    }

    // 編輯單一屬性時清除輸入框的呼叫函式
    const onSmallInputClear = () => {
        setOneAttribute((prev) => ({...prev, ...{value: ""}}))
    }

    // 編輯單一屬性時將單一屬性資料值放到對話盒的編輯框
    const editOneAttribute = (alias, idx) => {
        setIsOverlayShow(true)
        setIsSmallModalShow(true)
        const item = attributes.filter(item => item.alias === alias)
        const  value = (item.length > 0 && idx >= 0) ? item[0].attribute[idx] : ''
        setOneAttribute({
            alias: alias,
            index: idx,
            value: value,
        })
    }
    // 編輯單一屬性完成後按下送出的處理函式
    const handleSmallEdit = () => {
        const {alias, index, value} = oneAttribute
        setAttributes((prev) => {
            let next = []
            next = prev.map((item) => {
                // {id: 1, product_id: 1, attribute: Array(4), name: '顏色', alias: 'color', …}
                if (item.alias === alias) {
                    if (index >= 0) { // 修改
                        // 找出要修改的那個屬性，然後把值改為修改值
                        const s = item.attribute.map((item1, idx1) => {
                            return (idx1 === index) ? value : item1
                        })
                        item = {...item, ...{attribute: s}}
                    } else { // 新增
                        // 把新增的值放進屬性陣列中
                        item.attribute = [...item.attribute, value]
                    }
                }
                return item
            })
            return next

        })
        setIsOverlayShow(false)
        setIsSmallModalShow(false)
    }
    // 刪除單一屬性時顯示是否刪除的詢問對話盒
    const deleteOneAttribute = (alias, idx) => {
        alert({
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定要刪除？',
            isModalShow: true,
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeleteOneAttribute,
            params: {alias: alias, idx: idx}
        })
    }

    // 刪除單一屬性
    const onDeleteOneAttribute = (params)  => {
        const alias = params.alias
        const idx = params.idx

        setAttributes((prev) => {
            const next = prev.map((item) => {
                if (item.alias === alias) {
                    const s = item.attribute.filter((_, idx1) => idx1 !== idx)
                    return {...item, ...{attribute: s}}
                } else {
                    return item
                }
            })

            return next
        })
    }
    
    // 編輯屬性時將單一屬性資料值放到對話盒的編輯框
    const editAttribute = (idx) => {
        setIsOverlayShow(true)
        setIsModalShow(true)
        const name = (idx >= 0) ? attributes[idx]["name"] : ''
        const alias = (idx >= 0) ? attributes[idx]["alias"] : ''
        const placeholder = (idx >= 0) ? attributes[idx]["placeholder"] : ''
        setFormData({
            index: idx,
            name: name,
            alias: alias,
            placeholder: placeholder,
        })
    }
    // 刪除屬性時顯示是否刪除的詢問對話盒
    const deleteAttribute = (idx) => {
        alert({
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定要刪除？',
            isModalShow: true,
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeleteAttribute,
            params: {idx: idx}
        })
    }
    // 刪除屬性
    const onDeleteAttribute = (params) => {
        const idx = params.idx
        setAttributes((prev) => {
            const next = prev.filter((_, idx1) => idx !== idx1)
            return next
        })
    }

    // 編輯屬性時輸入框值改變後的呼叫函式
    const onInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    // 編輯屬性時清除輸入框的呼叫函式
    const onInputClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
    }

    // 編輯屬性完成後按下送出的處理函式
    const handleEdit = () => {
        setAttributes((prev) => {
            if (index < 0) {
                const newAttribute = {name: name, alias: alias, placeholder: placeholder, product_id: product_id, attribute:[], id: 0}
                return [...prev, newAttribute]
            } else {
                const next = prev.map((item, idx) => {
                    if (idx === index) {
                        return {...item, ...formData}
                    } else {
                        return item
                    }
                })
                return next
            }
        })
        setIsOverlayShow(false)
        setIsModalShow(false)
    }

    // 關閉屬性編輯對話盒
    const closeModal = () => {
        setIsOverlayShow(false)
        setIsModalShow(false)
    }
    // 關閉單一屬性編輯對話盒
    const closeSmallModal = () => {
        setIsOverlayShow(false)
        setIsSmallModalShow(false)
    }

    return (
        <>
        <div className="flex">
            <PrimaryOutlineButton type='button' className='ml-auto mr-4 md:mr-0' onClick={() => editAttribute(-1)}>新增屬性</PrimaryOutlineButton>
        </div>
        <div className='mt-4 grid grid-cols-1 lg:grid-cols-3 justify-center gap-4'>
            {attributes.map((attribute, idx) => (
                <div key={attribute.alias} className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">屬性 {idx+1} ：{attribute.name}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">代碼：{attribute.alias}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">預設説明文字：{attribute.placeholder}</p>
                    <div>
                        <ul className='flex flex-wrap gap-3 mt-4'>
                            {attribute && attribute.attribute && Array.isArray(attribute.attribute) && attribute.attribute.map((row, idx1) => (
                                <li key={row} className=''>
                                    <div id="badge-dismiss-default" className="flex items-center px-2 2xl:px-4 py-1 text-base 2xl:text-xl font-medium text-blue-800 bg-blue-100 rounded-md dark:bg-Success-300 dark:text-Success-900">
                                        <div>{row}</div>
                                        <div className='flex ml-4 gap-1'>
                                            <button type="button" onClick={() => editOneAttribute(attribute.alias, idx1)} className="p-0.5 text-sm text-Primary-800 bg-transparent hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-Success-900 dark:hover:text-Success-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                <MdModeEditOutline className='w-4 h-4' />
                                                <span className="sr-only">編輯</span>
                                            </button>
                                            <button type="button" onClick={() => deleteOneAttribute(attribute.alias, idx1)} className="p-0.5 text-sm text-Primary-800 bg-transparent hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-Success-900 dark:hover:text-Success-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                <MdClose className='w-4 h-4' />
                                                <span className="sr-only">刪除</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='mt-5 cursor-pointer' onClick={() => editOneAttribute(attribute.alias, -1)}>
                            <div id="badge-dismiss-default" className="flex justify-center items-center px-2 2xl:px-4 py-1 text-base 2xl:text-xl font-medium text-blue-800 bg-blue-100 rounded-md dark:bg-Success-300 dark:text-Success-900 hover:dark:bg-Success-400">新增</div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 mt-12'>
                        <EditButton type="button" onClick={() => editAttribute(idx)}>編輯</EditButton>
                        <DeleteButton type="button" onClick={() => deleteAttribute(idx)}>刪除</DeleteButton>
                    </div>
                </div>
            ))}
        </div>

        <Overlay isHidden={!isOverlayShow} />

        {/* 編輯單一屬性的對話盒 */}
        <div className={`w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center ${isSmallModalShow ? "" : "hidden"}`}>
            <div tabIndex="-1" id=":r2:" role="dialog" className="h-full w-full p-4 md:h-auto max-w-2xl" aria-labelledby=":ru:">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
                        <h3 id=":ru:" className={`text-xl font-medium  dark:text-Primary-400`}>編輯屬性</h3>
                        <button aria-label="Close" onClick={closeSmallModal} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                            <XMarkIcon className='h-6 w-6 text-Primary-400' />
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        <div className="space-y-6">
                            <div className="">
                                <Input 
                                    label="值"
                                    type="text"
                                    name="oneAttribute"
                                    value={oneAttribute.value || ''}
                                    id="oneAttribute"
                                    placeholder="尺寸、顏色...等等"
                                    onChange={onSmallInputChange}
                                    onClear={onSmallInputClear}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                        <OKButton onClick={handleSmallEdit}>確定</OKButton>
                        <CancelButton onClick={closeSmallModal}>取消</CancelButton>
                    </div>
                </div>
            </div>
        </div>
        
        {/* 編輯屬性內容的對話盒 */}
        <div className={`w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center ${isModalShow ? "" : "hidden"}`}>
            <div tabIndex="-1" id=":r2:" role="dialog" className="h-full w-full p-4 md:h-auto max-w-2xl" aria-labelledby=":ru:">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
                        <h3 id=":ru:" className={`text-xl font-medium  dark:text-Primary-400`}>編輯屬性</h3>
                        <button aria-label="Close" onClick={closeModal} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                            <XMarkIcon className='h-6 w-6 text-Primary-400' />
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        <div className="space-y-6">
                            <div className="">
                                <Input 
                                    label="名稱"
                                    type="text"
                                    name="name"
                                    value={name || ''}
                                    id="name"
                                    placeholder="尺寸、顏色...等等"
                                    onChange={onInputChange}
                                    onClear={onInputClear}
                                />
                            </div>
                            <div className="">
                                <Input 
                                    label="英文代號"
                                    type="text"
                                    name="alias"
                                    value={alias || ''}
                                    id="alias"
                                    placeholder="size, color...等等"
                                    onChange={onInputChange}
                                    onClear={onInputClear}
                                />
                            </div>
                            <div className="">
                                <Input 
                                    label="預設説明文字"
                                    type="text"
                                    name="placeholder"
                                    value={placeholder}
                                    id="placeholder"
                                    placeholder="M, L, 天空藍、蘋果紅...等等"
                                    onChange={onInputChange}
                                    onClear={onInputClear}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                        <OKButton onClick={handleEdit}>確定</OKButton>
                        <CancelButton onClick={closeModal}>取消</CancelButton>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductAttribute
