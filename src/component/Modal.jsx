import { useContext } from 'react'
import BMContext from '../context/BMContext'
import { Modal, Button } from 'flowbite-react'
import { ExclamationCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { CancelButton, OKButton } from './MyButton'

export function AlertModal() {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const {modalType, modalTitle, modalText, isModalShow, onClose} = alertModal

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
        <div className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isModalShow ? "opacity-80" : "opacity-0 hidden"}`}></div>
        {/* overlay */}
        <div className={`w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center ${isModalShow ? "" : "hidden"}`}>
            <div tabIndex="-1" id=":r2:" role="dialog" className="h-full w-full p-4 md:h-auto max-w-2xl" aria-labelledby=":ru:">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]">
                    <div className="flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5">
                        <ExclamationCircleIcon className='w-8 mr-4 text-Warning-400' />
                        <h3 id=":ru:" className="text-xl font-medium text-gray-900 dark:text-white">Terms of Service</h3>
                        <button aria-label="Close" onClick={close} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                            <XMarkIcon className='h-5 w-5' />
                            {/* <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg> */}
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        <div className="space-y-6">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t">
                        <OKButton>確定</OKButton>
                        <CancelButton onClick={onClose}>關閉</CancelButton>
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

