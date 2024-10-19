import React, {useContext, useState} from 'react'
import BMContext from '../context/BMContext'
import {Modal, Button} from 'flowbite-react'
import {ExclamationCircleIcon, CheckCircleIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {RiAlarmWarningLine} from "react-icons/ri"
import {CancelButton, OKButton} from './MyButton'
import Overlay from './Overlay'
import {useSpring, animated} from "@react-spring/web";
import {Animated} from 'react-animated-css';

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

