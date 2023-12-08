import { useState, useContext } from 'react'
import BMContext from '../context/BMContext'
import { Modal, Button } from 'flowbite-react'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

export function AlertModal() {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const close = () => {
        if (alertModal.onClose !== null) {
            alertModal.onClose()
        } else {
            setAlertModal({
                isModalShow: false,
            })
        }
    }
	return (
		<>
		<Modal
			show={alertModal.isModalShow}
			size="sm"
			onClose={close}
			popup
		>
			<Modal.Header />
			<Modal.Body>
			<div className="text-center">
				<ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-Warning" />
				<h3 className="mb-5 text-lg font-normal text-MyWhite">
				{alertModal.modalText}
				</h3>
				<div className="flex justify-center gap-4">
				<Button color="failure" onClick={close}>
					{"關閉"}
				</Button>
				</div>
			</div>
			</Modal.Body>
		</Modal>
		</>
	)
}

export function SuccessModal({ show, text }) {
    const {alertModal, setAlertModal} = useContext(BMContext)
    const close = () => {
        if (alertModal.onClose !== null) {
            alertModal.onClose()
        } else {
            setAlertModal({
                isModalShow: false,
            })
        }
    }

	return (
		<>
		<Modal
			show={alertModal.isModalShow}
			size="sm"
			onClose={close}
			popup
		>
			<Modal.Header />
			<Modal.Body>
			<div className="text-center">
				<CheckCircleIcon className="mx-auto mb-4 h-14 w-14 text-Success" />
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

