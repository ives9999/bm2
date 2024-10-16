import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";
import React, {useState} from "react";
import {PrimaryButton} from "../component/MyButton";
import Overlay from "../component/Overlay";
import {ImSpinner6} from "react-icons/im";
import Tab from "../component/Tab";

const Invoice = () => {
    const [formData, setFormData] = useState({member_nickname: ''});
    const onChange = (e) => {
        setFormData(prev => {
            return {...prev, [e.target.id]: e.target.value}
        })
        goList();
    }

    const handleClear = (id) => {
        setFormData(prev => {
            return {...prev, [id]: ''}
        })
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isShow, setIsShow] = useState(false);

    const [tabs, setTabs] = useState([
        {key: 'data', name: '訂單資訊', to: 'data', active: true},
        {key: 'contact', name: '收貨人資料', to: 'contact', active: false},
    ]);
    const handleTab = (idx) => {
        setTabs((prev) => {
            let res = prev.map((item, idx1) => {
                (idx === idx1) ? item.active = true : item.active = false
                return item
            })
            return res
        })
    }

    const goList = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsShow(prev => !prev);
            setIsLoading(false);
        }, 500);
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-between">
                <Tab items={tabs} to={handleTab}/>
            </div>
            <div className={`mt-6 lg:mx-0 ${tabs[0].active ? 'block' : 'hidden'}`}>
                <div className='w-[90%] h-[800px] px-16 my-16 m-auto bg-gray-600'></div>
                <div className="relative w-[50%] mx-auto">
                    <div className='rounded-md shadow-sm flex flex-row gap-2'>
                        <MagnifyingGlassIcon
                            className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>
                        <input
                            className={`w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}
                            placeholder='請輸入關鍵字...'
                            name='member_nickname'
                            value={formData.member_nickname}
                            id='member_nickname'
                            onChange={onChange}
                        />
                        <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <span className="cursor-pointer" onClick={() => handleClear('member_id')}>
                            <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>
                        </span>
                        </div>
                        <PrimaryButton className='w-1/3' onClick={goList}>按我下拉!!!</PrimaryButton>
                    </div>
                    <div
                        className={`absolute bdivide-y z-10 bg-white divide-y divide-gray-100 w-44 dark:bg-PrimaryBlock-950 ${isShow ? 'block' : 'hidden'}`}>
                        <ul id="autocomplete-list"
                            className="mt-2 py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow"
                            role="listbox">
                            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>apple</li>
                            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>banana</li>
                            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>orange</li>
                            <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>orange</li>
                        </ul>
                    </div>
                </div>
                <div className='mt-[480px]'></div>
            </div>
            <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'block' : 'hidden'}`}>
                <div className='w-[90%] h-[800px] px-16 my-16 m-auto bg-Warning-800'></div>
            </div>
            {isLoading && (
                <Overlay isShow={isLoading}>
                    <div
                        className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isLoading ? "opacity-80" : "opacity-0 hidden"}`}>
                        <div role="status"
                             className='w-full h-full flex flex-col items-center justify-center gap-2'>
                            <ImSpinner6
                                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-Primary-300"/>
                            <div className="text-Primary-300 text-base">載入中...</div>
                        </div>
                    </div>
                </Overlay>)}
        </>
            )}
            export default Invoice;