import React, {useContext, useEffect, useRef, useState} from 'react'
import BMContext from '../context/BMContext'
import {Modal, Button} from 'flowbite-react'
import { ExclamationCircleIcon, CheckCircleIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {RiAlarmWarningLine} from "react-icons/ri"
import { CancelButton, OKButton, PrimaryButton } from './MyButton'
import Overlay from './Overlay'
import {useSpring, animated} from "@react-spring/web";
import {Animated} from 'react-animated-css';
import { Featured } from './image/Images'

export function AllModal() {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const {
        isModalShow,
        modalType,
        modalTitle,
        modalText,
        isShowOKButton,
        isShowCancelButton,
        onOK,
        onClose,
        params
    } = alertModal

    const {icon} = getTypeChinesd(modalType)

    const ok = () => {
        if (onOK !== undefined && onOK !== null) {
            if (params) {
                onOK(params)
            } else {
                onOK()
            }
        }
        setAlertModal({
            isModalShow: false,
        })
    }

    const close = () => {
        if (onClose !== undefined && onClose !== null) {
            alertModal.onClose()
        } else {
            setAlertModal({
                isModalShow: false,
            })
        }
    }
    return isModalShow && (
        <Overlay isShow={isModalShow}>
            <div tabIndex="-1" id=":r2:" role="dialog" className="animated fadeInUp fixed shadow-inner max-w-md md:relative bottom-0 inset-x-0 align-top m-auto justify-end md:justify-center p-8 bg-gray-700 md:rounded w-full md:h-auto md:shadow flex flex-col"
                 aria-labelledby=":ru:">
                <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
                    {icon}
                    <h3 id=":ru:"
                        className={`text-xl font-medium  dark:text-white ${getTitleColor(modalType)}`}>{modalTitle}</h3>
                    <button aria-label="Close" onClick={close}
                            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                            type="button">
                        <XMarkIcon className='h-5 w-5'/>
                    </button>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            {modalText}
                        </p>
                    </div>
                </div>
                <div
                    className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                    {isShowOKButton ? <OKButton onClick={ok}>確定</OKButton> : ''}
                    {isShowCancelButton ? <CancelButton onClick={close}>關閉</CancelButton> : ''}
                </div>
            </div>
        </Overlay>
    )
}

export function BlueModal({isModalShow = true, children, width = 'w-[600px]'}) {

    // const props = useSpring({
    //     from: {y: isModalShow ? 0 : 200, opacity: isModalShow ? 0 : 1},
    //     to: {y: isModalShow ? 200 : 0, opacity: isModalShow ? 1 : 0},
    // })

    return (
        <Overlay isShow={isModalShow}>
            <Animated animationIn="fadeInDown" animationOut="fadeOutUp" animationInDuration={1000} animationOutDuration={1000} isVisible={isModalShow} id="modal"
                 className={`fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center overflow`}>
                <div tabIndex="-1" id=":r2:" role="dialog" className={`h-auto m-auto p-4 ${width}`}>
                    <div className={`relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col`}>
                        {children}
                    </div>
                </div>
            </Animated>
        </Overlay>
    )
}

BlueModal.Header = function ({children, setIsModalShow}) {

    return (
        <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
            <h3 className="text-xl font-medium  dark:text-white">
                {children}
            </h3>
            <button aria-label="Close" onClick={() => setIsModalShow(false)}
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    type="button">
                <XMarkIcon className='h-5 w-5'/>
            </button>
        </div>
    )
}

BlueModal.Body = function ({children, height = 'auto'}) {

    return (
        <div className="p-6 overflow-auto">
            <div className={`space-y-6 ${height === 'auto' ? '' : height}`}>
                <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {children}
                </div>
            </div>
        </div>
    )
}

BlueModal.Footer = function ({children, isShowCancelButton = false, handleCancelButton = null, cancelButtonText = "關閉"}) {

    return (
        <div
            className={`flex flex-row flex-grow items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t ${isShowCancelButton ? "justify-between" : ""}`}>
            <div className='flex flex-row gap-6 items-center'>
                {children}
            </div>
            {isShowCancelButton && handleCancelButton !== null ? <CancelButton onClick={handleCancelButton}>{cancelButtonText}</CancelButton> : ''}
        </div>
    )
}

export function BlueOK({
    handleClose,
    title="成功",
    content,
    okButtonTitle="關閉",
    Icon=CheckCircleIcon
}) {
    const OKIcon = () => {
        return (
            <Icon className='w-10 h-10 mr-2' />
        )
    }
    return (
        <BlueModal isModalShow={true}>
            <BlueModal.Header setIsModalShow={handleClose}>
                <div className='flex flex-row items-center'>
                    <OKIcon />
                    {title}
                </div>
            </BlueModal.Header>
            <BlueModal.Body>{content}</BlueModal.Body>
            <BlueModal.Footer isShowCancelButton={false} handleCancelButton={handleClose}>
                <OKButton onClick={handleClose}>{okButtonTitle}</OKButton>
            </BlueModal.Footer>
        </BlueModal>
    )
}

export function BlueWarning({
   handleClose,
   title="警告",
   content,
   okButtonTitle="關閉",
   Icon=ExclamationCircleIcon
}) {
    const OKIcon = () => {
        return (
            <Icon className='w-10 h-10 mr-2' />
        )
    }
    return (
        <BlueModal isModalShow={true}>
            <BlueModal.Header setIsModalShow={handleClose}>
                <div className='flex flex-row items-center text-Warning-500'>
                    <OKIcon />
                    {title}
                </div>
            </BlueModal.Header>
            <BlueModal.Body>{content}</BlueModal.Body>
            <BlueModal.Footer isShowCancelButton={false} handleCancelButton={handleClose}>
                <OKButton onClick={handleClose}>{okButtonTitle}</OKButton>
            </BlueModal.Footer>
        </BlueModal>
    )
}

function getTypeChinesd(type) {
    switch (type) {
        case "success":
            return {chinese: "成功", icon: <CheckCircleIcon className='w-8 h-8 mr-4 text-Success-500'/>}
        case "warning":
            return {chinese: "警告", icon: <RiAlarmWarningLine className='w-8 h-8 mr-4 text-Warning-400'/>}
        case "info":
            return {chinese: "訊息", icon: <ExclamationCircleIcon className='w-8 h-8 mr-4 text-Primary-400'/>}
        default:
            return {chinese: "成功", icon: <CheckCircleIcon className='w-8 mr-4 text-Success-500'/>}
    }
}

function getTitleColor(type) {
    switch (type) {
        case "success":
            return '!text-Success-500'
        case "warning":
            return '!text-Warning-400'
        case "info":
            return '!text-Primary-400'
        default:
            return '!text-Success-500'
    }
}

export function AutoCompleteModal({
                                      toggleModalShow,
                                      setToggleModalShow,
                                      title,
                                      placeholder,
                                      setSelected,
                                      getReadAPI,
                                  }) {
    const [keyword, setKeyword] = useState('');

    // 設定focus使用
    const keywordRef = useRef();

    const scrollRef = useRef();
    const currentPageRef = useRef(1);
    const isFetching = useRef(false);

    const initPage = {
        meta: {
            totalCount: 0,
            totalPage: 0,
            currentPage: 0,
            offset: 0,
            perPage: process.env.REACT_APP_PERPAGE,
        },
        rows: [],
    }
    const [page, setPage] = useState(initPage);

    useEffect(() => {
        keywordRef.current.focus();
    }, [toggleModalShow]);

    const handleChange = async (e) => {
        if (e.target.id === 'product') {
            const k = e.target.value
            setKeyword(k);

            setPage(initPage);

            if (k.length > 0) {
                await getList(currentPageRef.current, [{k: k}]);
            }
        }
    }

    const handleScroll = async () => {
        if (scrollRef.current && keyword.length > 0) {
            const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
            // console.info("scroll:" + (scrollTop + clientHeight));
            // console.info("contentHeight:" + scrollHeight);
            if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching.current) {
                isFetching.current = true;
                if (currentPageRef.current < page.meta.totalPage) {
                    const params = {k: keyword};
                    await getList(currentPageRef.current + 1, params);
                    currentPageRef.current++;
                }
            }
        }
    }

    const getList = async (currentPage, params) => {
        //setIsLoading(true);
        const data = await getReadAPI(currentPage, page.meta.perPage, params);

        setPage(prev => {
            return {...prev, rows: prev.rows.concat(data.data.rows), meta: data.data.meta}
        });
        isFetching.current = false;
    }

    const onClear = () => {
        setKeyword('');
        setPage(initPage);
        isFetching.current = false;
        currentPageRef.current = 1;
    }

    const onSelected = (idx) => {
        const row = page.rows[idx];
        setSelected(row);
    }

    return (
        <BlueModal isModalShow={toggleModalShow}>
            <BlueModal.Header setIsModalShow={setToggleModalShow}>
                {title}
            </BlueModal.Header>
            <BlueModal.Body height='h-[300px]'>
                <div className={`flex justify-between mb-2`}>
                    <label className="block text-MyWhite font-medium leading-6 ml-1">
                        {placeholder}
                    </label>
                </div>
                <div className="">
                    <div className='relative rounded-md shadow-sm'>
                        <MagnifyingGlassIcon
                            className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>
                        <input
                            ref={keywordRef}
                            className={`
                            w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] 
                            focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}
                            placeholder={'請輸入關鍵字...'}
                            name='product'
                            value={keyword}
                            id='product'
                            onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                                <span className="cursor-pointer" onClick={() => onClear('product')}>
                                    <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>
                                </span>
                        </div>
                    </div>
                </div>
                <div ref={scrollRef} className='h-[200px] overflow-y-auto mt-4' onScroll={handleScroll}>
                    <ul className='text-base text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow'>
                        {page.rows.length > 0 && page.rows.map((row, idx) => (
                            <li key={row.token} onClick={() => onSelected(idx)} className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                                <p>{idx+1}.</p>
                                <Featured row={row} className='w-12' />
                                {row.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </BlueModal.Body>
            <BlueModal.Footer>
                <PrimaryButton onClick={() => setToggleModalShow(false)}>
                    關閉
                </PrimaryButton>
            </BlueModal.Footer>
        </BlueModal>
    )
}

