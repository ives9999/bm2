import { useContext } from 'react'
import BMContext from '../context/BMContext'
import { Modal, Button } from 'flowbite-react'
import { ExclamationCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { RiAlarmWarningLine } from "react-icons/ri"
import { CancelButton, OKButton } from './MyButton'
import Overlay from './Overlay'

export function AllModal() {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const {isModalShow, modalType, modalTitle, modalText, isShowOKButton, isShowCancelButton, onOK, onClose, params} = alertModal

    const {icon} = getTypeChinesd(modalType)

    const ok = () => {
        if (onOK !== undefined && onOK !== null) {
            onOK(params)
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
	return (
		<>
        <Overlay isHidden={!isModalShow} />
        {/* overlay */}
        <div className={`w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center ${isModalShow ? "" : "hidden"}`}>
            <div tabIndex="-1" id=":r2:" role="dialog" className="h-full w-full p-4 md:h-auto max-w-2xl" aria-labelledby=":ru:">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center rounded-t dark:border-gray-600 border-b p-5">
                        {icon}
                        <h3 id=":ru:" className={`text-xl font-medium  dark:text-white ${getTitleColor(modalType)}`}>{modalTitle}</h3>
                        <button aria-label="Close" onClick={close} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                            <XMarkIcon className='h-5 w-5' />
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        <div className="space-y-6">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                {modalText}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                        {isShowOKButton ? <OKButton onClick={ok}>確定</OKButton> : ''}
                        {isShowCancelButton ? <CancelButton onClick={close}>關閉</CancelButton> : ''}
                    </div>
                </div>
            </div>
        </div>
		{/* <Modal
			show={alertModal.isModalShow && alertModal.modalType === 'alert'}
			size="sm"
			onClose={close}
			popup
		>
			<Modal.Header />
			<Modal.Body>
			<div className="text-center">
				<ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-Warning-400" />
				<h3 className="mb-5 text-lg font-normal text-MyWhite">
				{alertModal.modalText.split('\n').map((item, i) => <p key={i}>{item}</p>)}
				</h3>
				<div className="flex justify-center gap-4">
				<Button color="failure" onClick={close}>
					{"關閉"}
				</Button>
				</div>
			</div>
			</Modal.Body>
		</Modal> */}
		</>
	)
}

export function SuccessModal({ show, text }) {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const close = () => {
        if (alertModal.onClose !== undefined && alertModal.onClose !== null) {
            alertModal.onClose()
        } else {
            setAlertModal({
                modalText: '',
                isModalShow: false,
            })
        }
    }

	return (
		<>
		<Modal
			show={alertModal.isModalShow && alertModal.modalType === 'success'}
			size="sm"
			//onClose={close}
			popup
		>
			<Modal.Header />
			<Modal.Body>
			<div className="text-center">
				<CheckCircleIcon className="mx-auto mb-4 h-14 w-14 text-Success-300" />
				<h3 className="mb-5 text-lg font-normal text-MyWhite">
				{alertModal.modalText}
				</h3>
				<div className="flex justify-center gap-4">
				<Button color="success" onClick={close}>
					{"關閉"}
				</Button>
				</div>
			</div>
			</Modal.Body>
		</Modal>
		</>
	)
}

function getTypeChinesd(type) {
    switch(type) {
        case "success":
            return {chinese: "成功", icon: <CheckCircleIcon className='w-8 h-8 mr-4 text-Success-500' />}
        case "warning":
            return {chinese: "警告", icon: <RiAlarmWarningLine className='w-8 h-8 mr-4 text-Warning-400' />}
        case "info":
            return {chinese: "訊息", icon: <ExclamationCircleIcon className='w-8 h-8 mr-4 text-Primary-400' />}
        default: 
            return {chinese: "成功", icon: <CheckCircleIcon className='w-8 mr-4 text-Success-500' />}
    }
}

function getTitleColor(type) {
    switch(type) {
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

