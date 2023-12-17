import { useContext, useReducer } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import UseHr from "../../component/UseHr";
import {PrimaryButton} from '../../component/MyButton';

function MoreData() {
    const {memberData, memberDispatch, setIsLoading, setAlertModel} = useContext(BMContext)
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '會員更多資訊', href: '/member/moreData', current: true },
    ]

    const {tel, dob, sex, city_id, area_id, road, fb, line, token} = memberData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        telError: obj,
    }
    const errorReducer = (state=initalError, action) => {
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    //當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        memberDispatch({type: 'UPDATE', payload: {[e.target.id]: e.target.value}})
		clearError(e.target.id)
    }

    //當按下清除按鈕後，清除欄位值
    const handleClear = (id) => {
        memberDispatch({type: 'UPDATE', payload: {[id]: ""}})
		clearError(id)
    }

    const clearError = (id) => {
        // var error = {}
		// if (id === 'email') {
		// 	error = {emailError:{message: ''}}
		// } else if (id === 'password') {
		// 	error = {passwordError:{message: ''}}
		// } else if (id === 'repassword') {
		// 	error = {repasswordError:{message: ''}}
		// } else if (id === 'name') {
		// 	error = {nameError:{message: ''}}
		// } else if (id === 'nickname') {
		// 	error = {nicknameError:{message: ''}}
		// } else if (id === 'mobile') {
		// 	error = {mobileError:{message: ''}}
		// } else if (id === 'privacy') {
        //     error = {privacyError:{message: ''}}
        // }
        // dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    const onSubmit = (e) => {

    }
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs} />
            <h2 className="text-Primary text-center text-4xl font-bold mb-8">會員更多資訊</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                    <Input 
                        label="tel"
                        type="tel"
                        name="市內電話"
                        value={tel || ''}
                        id="tel"
                        placeholder="0233445566"
                        errorMsg={errorObj.telError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />

                    <PrimaryButton type="submit" extraClassName="w-full">送出</PrimaryButton>
                </div>
            </form>
        </div>
    )
}

export default MoreData
