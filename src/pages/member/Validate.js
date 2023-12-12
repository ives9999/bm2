import {useContext, useState, useReducer, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import BMContext from '../../context/BMContext';
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import {PrimaryButton, SecondaryButton} from '../../component/MyButton';
import { Button } from 'flowbite-react';

function Validate() {
    const {type} = useParams()
    const title_type = (type === 'email') ? "Email" : "手機"
    const {memberData, setAlertModal, alertModal} = useContext(BMContext);
    const {email, mobile} = memberData

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: title_type + '認證', href: '/member/validate', current: true },
    ]
    //const value_type = (type === 'email') ? memberData.email : memberData.mobile

    const [formData, setFormData] = useState({
		code: '',
	})
    const {code} = formData

    const initalError = {
        loading: false,
        code: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {

    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = (e) => {
        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
		clearError(e.target.id)
    }

    const handleClear = () => {
        setFormData((prevState) => ({
			...prevState,
			[code]: ""
		}))
		clearError()
    }

    const clearError = () => {
        const error = {code:{message: ''}}
        dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    const onSubmit = () => {
    
    }

    useEffect(() => {
        console.info("validate")
        //memberDispatch({type: 'GET'})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-8">{title_type}認證</h2>
                <form onSubmit={onSubmit}>
                    <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                        <div className='text-MyWhite mb-8'>{type==='email' ? email: mobile}</div>
                        <Input 
                        label="認證碼"
						type="text"
						name="code"
						value={code || ''}
						id="code"
						isRequired={true}
						errorMsg={errorObj.code.message}
						onChange={onChange}
						onClear={handleClear}
                        />
                        <div className='mt-12 grid grid-flow-col gap-6'>
                            <PrimaryButton extraClassName='' type="submit">送出</PrimaryButton>
                            <SecondaryButton type="button">重新發送</SecondaryButton>
                        </div>
                        <div className="mb-8"></div>
                        <SecondaryButton type="button">重新發送</SecondaryButton>
                    </div>
                </form>
            </main>
        </div>
        </>
    )
}

export default Validate
