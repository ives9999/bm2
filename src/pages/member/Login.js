import Layout from '../../layout/Layout';
import { React, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from '../../layout/Breadcrumb'
import BMContext from '../../context/BMContext';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import Button from '../../component/Button';
import LoginAPI from "../../api/member/LoginAPI"
import {
    MEMBERINVALID,
    PASSWORDBLANK,
    PASSWORDINVALID
} from "../../errors/MemberError"

const Login = () => {
    const {cookies} = useContext(BMContext);
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
    const [res, setRes] = useState({})

    //按下送出後的動作
    const onSubmit = (e) => {
		e.preventDefault()

		let isPass = true
		if (email.trim().length === 0) {
			const err = {emailErrorMsg: 'email不能為空白'}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
		}
		if (password.trim().length === 0) {
			const err = {passwordErrorMsg: '密碼不能為空白'}
			setError((prevState) => ({
				...prevState, ...err
			}))
			isPass = false
		}

		if (isPass) {
            const data = LoginAPI(email, password)
            //setRes(data)
            console.info(data)
            //callback(data)
			// const url = process.env.REACT_APP_API + "/member/postLogin"
			// const login = async () => {
			// 	const response = await fetch(url, {
			// 		method: 'POST',
			// 		Headers: {
			// 			'Content-Type': 'application/jsonn',
			// 		},
			// 		body: JSON.stringify(formData)
			// 	})
			// 	const data = await response.json()
			// 	if (data.status >= 300) {
			// 		const message = data.message
			// 		var id = 0
			// 		var msg = ""
			// 		for (let i = 0; i < message.length; i++) {
			// 			id = message[i].id
			// 			msg = message[i].msg
			// 			const err = {emailErrorMsg: msg}
			// 			if (id === 1001 || id === 1002) {
			// 				setError((prevStat) => ({...prevStat, ...err}))
			// 			}
			// 			if (id === 1004 || id === 1005) {
			// 				const err = {passwordErrorMsg: msg}
			// 				setError((prevStat) => ({...prevStat, ...err}))
			// 			}
			// 		}
			// 	} else {
			// 		navigate.to('/')
			// 	}
			// }
			// login()
		}
	}

    const callback = (data) => {
        // 登入成功
        //console.info(data.status)
        if (res["success"]) {
            //console.info(data)
            cookies.set('token', data.row.token, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            navigate(-1)
        // 登入失敗
        } else {
            const msgs = res["message"]
            //console.info(msgs)
            var id = 0
            var msg = ""
            for (let i = 0; i < msgs.length; i++) {
                //console.info(msgs[i])
                id = msgs[i].id
                msg += msgs[i].msg + `\n`
            }
            //console.info(id)
            if (id === MEMBERINVALID) {
                //console.info(msg)
                //msg += "錯誤代碼：" + id + `\n`
                const err = {emailErrorMsg: 'email不能為空白'}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
    
            } else if (id === PASSWORDBLANK || id === PASSWORDINVALID) {
                //msg += "錯誤代碼：" + id + `\n`
                const err = {emailErrorMsg: 'email不能為空白'}
                setError((prevState) => ({
                    ...prevState, ...err
                }))
    
            }
        }
    }

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-8">歡迎回來 !</h2>
                <form onSubmit={onSubmit}>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
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