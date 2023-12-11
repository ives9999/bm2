import {useContext, useState, useReducer} from 'react'
import { useParams } from 'react-router-dom'
import BMContext from '../../context/BMContext';
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import Button from '../../component/MyButton';

function Validate() {
    const {type} = useParams()
    const {setIsLoading, setAlertModal, alertModal} = useContext(BMContext);
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '認證', href: '/member/validate', current: true },
    ]

    const [formData, setFormData] = useState({
		code: '',
	})
    const {code} = formData

    const initalError = {
        loading: false,
        email: {
            code: 0,
            message: '',
        },
    }

    const errorReducer = (state = initalError, action) => {

    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    const onChange = () => {

    }

    const handleClear = () => {

    }

    const onSubmit = () => {
    
    }

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-8">歡迎回來 !</h2>
                <form onSubmit={onSubmit}>
                    <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                        <Input 
                        label="Email"
						type="email"
						name="email"
						value={code || ''}
						id="email"
						placeholder="you@example.com"
						isRequired={true}
						errorMsg={errorObj.email.message}
						onChange={onChange}
						onClear={handleClear}
                        />
                        <div className='mt-12'><Button type="submit">送出</Button></div>
                    </div>
                </form>
            </main>
        </div>
        </>
    )
}

export default Validate
