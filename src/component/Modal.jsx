import { useContext } from 'react'
import BMContext from '../context/BMContext'
import { Modal, Button } from 'flowbite-react'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

export function AlertModal() {
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
        <div class="w-full h-full fixed block top-0 left-0 bg-BG-800 opacity-80 z-40"></div>
        <div class="w-full h-full fixed block top-0 left-0 z-50">
            <div className='bg-MyBlack text-green-500 top-1/3 my-0 mx-auto block relative w-[480px] h-[300px] transition-all "'>
                <div className='w-full h-[80px] text-Warning-500 flex items-center justify-center'>
                    <ExclamationCircleIcon className='w-16' />
                    <span className='text-3xl ml-2'>警告</span>
                </div>
                <div>

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

