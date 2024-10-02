import {useState} from 'react'
import { PrimaryOutlineButton, EditButton, DeleteButton, OKButton, CancelButton } from '../MyButton'
import Overlay from '../Overlay'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Input from '../form/Input';

function ProductPrice({
    product_id,
    prices,
    setPrices,
    alert,
}) {

    const initFormData = {
        id: 0,
        product_id: product_id,
        price_title: '',
        price_title_alias: '',
        price_member: '',
        price_nonmember: '',
        buyPrice: '',
        price_desc: '',
        shipping_fee: 0,
        shipping_fee_unit: 1,
        shipping_fee_desc: '',
        tax: 0,
    }

    // 編輯屬性說明資料
    const [formData, setFormData] = useState(initFormData)
    // 是否顯示編輯屬性對話盒
    const [isModalShow, setIsModalShow] = useState(false)

    const {id, price_title, price_title_alias, price_member, price_nonmember, buyPrice, price_desc, shipping_fee, shipping_fee_unit, shipping_fee_desc, tax} = formData


    const editPrice = (idx) => {
        setIsModalShow(true)
        if (idx < 0) {
            setFormData(initFormData)
        } else {
            const price = prices.filter((_, idx1) => idx === idx1)
            if (price.length > 0) {
                setFormData(price[0])
            }
        }
    }

    const handleEdit = () => {
        setIsModalShow(false)
        if (id <= 0) { // 表示新增
            setPrices((prev) => ([...prev, formData]))
        } else {  // 修改
            setPrices((prev) => {
                const next = prev.map((item) => {
                    if (item.id === id) {
                        return {...item, ...formData}
                    } else {
                        return item
                    }
                })
                return next
            })
        }
    }
    // 刪除價格時顯示是否刪除的詢問對話盒
    const deletePrice = (idx) => {
        alert({
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定要刪除？',
            isModalShow: true,
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDeletePrice,
            params: {idx: idx}
        })
    }
    // 刪除屬性
    const onDeletePrice = (params) => {
        const idx = params.idx
        setPrices((prev) => {
            const next = prev.filter((_, idx1) => idx !== idx1)
            return next
        })
    }

    // 編輯屬性時輸入框值改變後的呼叫函式
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    // 編輯屬性時清除輸入框的呼叫函式
    const onClear = (id) => {
        setFormData((prev) => ({...prev, ...{[id]: ""}}))
    }

    // 關閉屬性編輯對話盒
    const closeModal = () => {
        setIsModalShow(false)
    }

    return (
        <>
        <div className="flex">
            <PrimaryOutlineButton type='button' className='ml-auto mr-4 md:mr-0' onClick={() => editPrice(-1)}>新增價格</PrimaryOutlineButton>
        </div>
        <div className='mt-4 grid grid-cols-1 lg:grid-cols-3 justify-center gap-4'>
            {prices.map((price, idx) => (
                <div key={price.price_title} className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">價格 {idx+1} ：{price.price_title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">價格別名：{price.price_alias}</p>
                    <div className='text-lg mb-3 font-bold'>
                        <div className='flex text-lg gap-4'>
                            <p className="text-gray-700 dark:text-gray-400">售價：<span className='text-Warning-500'>{price.price_member}</span></p>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400">進貨價：<span className='text-Warning-500'>{price.buyPrice}</span></p>
                    </div>
                    <div className='flex text-lg gap-4 mb-3'>
                        <p className="text-gray-700 dark:text-gray-400">運費：{price.shipping_fee}</p>
                        <p className="text-gray-700 dark:text-gray-400">運費單位：{price.shipping_unit}</p>
                    </div>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">價格描述：{price.price_desc}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">運費描述：{price.shipping_desc}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">稅額：{price.tax}</p>
                    <div className='flex flex-row gap-4 mt-12'>
                        <EditButton type="button" onClick={() => editPrice(idx)}>編輯</EditButton>
                        <DeleteButton type="button" onClick={() => deletePrice(idx)}>刪除</DeleteButton>
                    </div>
                </div>
            ))}
        </div>

        <Overlay isHidden={!isModalShow} />
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
                                    name="price_title"
                                    value={price_title || ''}
                                    id="price_title"
                                    placeholder="一支、一件、一雙等等"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="名稱別名"
                                    type="text"
                                    name="price_title_alias"
                                    value={price_title_alias || ''}
                                    id="price_title_alias"
                                    placeholder="一支、一件、一雙等等"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="售價"
                                    type="text"
                                    name="price_member"
                                    value={price_member || ''}
                                    id="price_member"
                                    placeholder="399"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="進貨價"
                                    type="text"
                                    name="buyPrice"
                                    value={buyPrice || ''}
                                    id="buyPrice"
                                    placeholder="899"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="原價"
                                    type="text"
                                    name="price_nonmember"
                                    value={price_nonmember || ''}
                                    id="price_nonmember"
                                    placeholder="599"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="價格預設説明文字"
                                    type="text"
                                    name="price_desc"
                                    value={price_desc}
                                    id="price_desc"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="運費"
                                    type="text"
                                    name="shipping_fee"
                                    value={shipping_fee || ''}
                                    id="shipping_fee"
                                    placeholder="30"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="運費單位"
                                    type="text"
                                    name="shipping_fee_unit"
                                    value={shipping_fee_unit || ''}
                                    id="shipping_fee_unit"
                                    placeholder="1"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="運費預設説明文字"
                                    type="text"
                                    name="shipping_fee_desc"
                                    value={shipping_fee_desc}
                                    id="shipping_fee_desc"
                                    placeholder="滿千免運費"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="稅額"
                                    type="text"
                                    name="tax"
                                    value={tax}
                                    id="tax"
                                    placeholder="20"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                        <OKButton onClick={handleEdit}>確定</OKButton>
                        <CancelButton onClick={closeModal}>取消</CancelButton>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductPrice
