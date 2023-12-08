import { React, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from '../../layout/Breadcrumb'
import BMContext from '../../context/BMContext';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import Button from '../../component/MyButton';
import {loginAPI} from "../../context/member/MemberAction"
import toCookie from '../../api/toCookie';
import {
    EMAILBLANK,
    GetEmailBlankError,
    EMAILINVALID,
    PASSWORDBLANK,
    GetPasswordBlankError,
    PASSWORDERROR,
} from "../../errors/MemberError"

const Login = () => {
    //const {cookieDispatch} = useContext(BMContext);
    const navigate = useNavigate();
    const breadcrumbs = [
        { name: '登入', href: '/member', current: true },
    ]

    const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const {email, password} = formData

    const [error, setError] = useState({
		emailErrorMsg: '',
		passwordErrorMsg: '',
	})
    const {emailErrorMsg, passwordErrorMsg} = error

    //當email值改變時，偵測最新的值
    const onChange = (e) => {

        setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))

		clearError(e.target.id)
    }

    //當按下清除email文字按鈕後，清除email
    const handleClear = (id) => {
        setFormData((prevState) => ({
			...prevState,
			[id]: ""
		}))
		clearError(id)
    }

    const clearError = (id) => {
		if (id === 'email') {
			const err = {emailErrorMsg: ''}
			setError((prevState) => ({
				...prevState, ...err
			}))
		} else if (id === 'password') {
			const err = {passwordErrorMsg: ''}
			setError((prevState) => ({
				...prevState, ...err
			}))
		}
	}

    //按下送出後的動作
    const onSubmit = async (e) => {
		e.preventDefault()

		let isPass = true
        // 本地端檢查
		if (email.trim().length === 0) {
			const err = {emailErrorMsg: GetEmailBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
		}
		if (password.trim().length === 0) {
			const err = {passwordErrorMsg: GetPasswordBlankError().msg}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
		}

		if (isPass) {
            const data = await loginAPI(email, password)
            callback(data)
		}
	}

    const callback = (data) => {
        // 登入成功
        //console.info(data["status"])
        if (data["status"] >= 200 && data["status"] < 300) {
            toCookie('LOGIN', {token: data.data.token})
            window.location.href = document.referrer
        // 登入失敗
        } else {
            var err = {}
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                if (id === EMAILBLANK || id === EMAILINVALID) {
                    err["emailErrorMsg"] = data["message"][i].message
                } else if (id === PASSWORDBLANK || id === PASSWORDERROR) {
                    err["passwordErrorMsg"] = data["message"][i].message
                }
            }
            setError((prevState) => ({
                ...prevState, ...err
            }))
        }
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
						value={email || ''}
						id="email"
						placeholder="you@example.com"
						isRequired={true}
						errorMsg={emailErrorMsg}
						onChange={onChange}
						onClear={handleClear}
                        />
                        <Password 
						label="密碼"
						name="password"
						value={password}
						id="password"
						placeholder="請填密碼"
						isRequired={true}
						errorMsg={passwordErrorMsg}
						onChange={onChange}
						onClear={handleClear}
					    />
                        
                        <a href="/member/forget_password" className="text-Primary text-sm">忘記密碼？</a>

                        <div className='mt-12'><Button type="submit">送出</Button></div>
                        <div className="text-menuTextWhite text-sm mt-3">還沒有帳號，請<a className="text-Primary text-sm" href="/member/register">註冊</a></div>
                    </div>
                </form>  
            </main>
        </div>
        </>
    );
}

export default Login