import {useState} from 'react'
import { PrimaryOutlineButton, EditButton, DeleteButton, OKButton, CancelButton } from './MyButton'
import { MdClose, MdModeEditOutline } from "react-icons/md";
import Overlay from './Overlay'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Input from './form/Input';

function ProductAttribute({
    attributes,
    handleEdit,
    handleDelete,
}) {
    const [isModalShow, setIsModalShow] = useState(false)
    const editAttribute = () => {
        setIsModalShow(true)
    }
    const close = () => {
        setIsModalShow(false)
    }

    return (
        <>
        <div className="flex">
            <PrimaryOutlineButton type='button' className='ml-auto mr-4 md:mr-0' onClick={editAttribute}>新增屬性</PrimaryOutlineButton>
        </div>
        <div className='mt-4 grid grid-cols-1 lg:grid-cols-3 justify-center gap-4'>
            {attributes.map((attribute, idx) => (
                <div key={attribute.alias} className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">屬性 {idx+1} ：{attribute.name}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">代碼：{attribute.alias}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">預設説明文字：{attribute.placeholder}</p>
                    <div>
                        <ul className='flex flex-wrap gap-3 mt-4'>
                            {attribute.attribute.map((row) => (
                                <li key={row} className=''>
                                    <div id="badge-dismiss-default" className="flex items-center px-2 2xl:px-4 py-1 text-base 2xl:text-xl font-medium text-blue-800 bg-blue-100 rounded-md dark:bg-Success-300 dark:text-Success-900">
                                        <div>{row}</div>
                                        <div className='flex ml-4 gap-1'>
                                            <button type="button" className="p-0.5 text-sm text-Primary-800 bg-transparent hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-Success-900 dark:hover:text-Success-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                <MdModeEditOutline className='w-4 h-4' />
                                                <span className="sr-only">編輯</span>
                                            </button>
                                            <button type="button" className="p-0.5 text-sm text-Primary-800 bg-transparent hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-Success-900 dark:hover:text-Success-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                <MdClose className='w-4 h-4' />
                                                <span className="sr-only">刪除</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='flex flex-row gap-4 mt-12'>
                        <EditButton onClick={() => handleEdit(idx)}>編輯</EditButton>
                        <DeleteButton onClick={() => handleDelete(idx)}>刪除</DeleteButton>
                    </div>
                </div>
            ))}
        </div>

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
                                    nChange={onChange}
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
        </>
    )
}

export default ProductAttribute
