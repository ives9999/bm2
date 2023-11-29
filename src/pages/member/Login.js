import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Breadcrumb from '../../layout/Breadcrumb'

//import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
// import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import {
    MEMBERINVALID,
    PASSWORDBLANK,
    PASSWORDINVALID
} from "../../errors/MemberError"

const Login = () => {

    const breadcrumbs = [
        { name: '登入', href: '/member', current: true },
    ]

    //設定email與初值
    const [email, setEmail] = useState('')

    //設定密碼與初值
    const [password, setPassword] = useState('')

    //偵測email是否為空直，顯示錯誤訊息時使用
    const [isEamilEmpty, setIsEmailEmpty] = useState(false)

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

    //設定錯誤訊息
    const [errorMsg, setErrorMsg] = useState("")

    //當email值改變時，偵測最新的值
    const handleEmail = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsEmailEmpty(false)
            setErrorMsg("")
        }
        setEmail(value)
    }

    //當密碼值改變時，偵測最新的值
    const handlePassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsPasswordEmpty(false)
        }
        setPassword(event.target.value)
    }

    //當按下清除email文字按鈕後，清除email
    const handleClearEmail = (event) => {
        event.preventDefault()
        setEmail("")
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const handleClearPassword = (event) => {
        event.preventDefault()
        setPassword("")
    }

    // const mutation = useMutation({
    //     mutationFn: (params) => {
    //         return axios.post(process.env.REACT_APP_API, params)
    //     }
    // })

    // axios好像不用再加header了，已經都做掉了
    // const headers = {
    //     "content-type": "application/json",
    //     "Origin": process.env.REACT_APP_DOMAIN,
    // }
    const url = process.env.REACT_APP_API + "/member/postLogin"

    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault();
        // console.info(email)

        var isPass = false
        var params = {}
        //console.info(email)
        // setIsEmailEmpty(true)

        if (email.length > 0) {
            params["email"] = email
            isPass = true;
        } else {
            setIsEmailEmpty(true)
            setErrorMsg("email不能為空白")
            isPass = false
        }
        //console.info(isPass)

        if (password.length > 0) {
            params["password"] = password
            isPass = true;
        } else {
            setIsPasswordEmpty(true)
            setErrorMsg("密碼不能為空白")
            isPass = false
        }
        //console.info(params)

        // params["email"] = email
        // params["password"] = password
        // isPass = true
        if (isPass) {
            //console.info("url is : " + url)
            axios.post(url, params)
            .then(response => callback(response.data))
            //mutation.mutate(params)
            // fetch(url, {
            //     method: "POST",
            //     body: JSON.stringify(params),
            //     headers: headers
            // })
            // .then(response => response.json())
            // .then(data => callback(data))
        }

        //console.info(a);
    }

    const navigate = useNavigate();
    const callback = (data) => {
        // 登入成功
        //console.info(data)
        if (data["success"]) {
            //console.info(data)
            const cookies = new Cookies();
            cookies.set('token', data.row.token, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            navigate(-1)
        // 登入失敗
        } else {
            const msgs = data["msgs"]
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
                setErrorMsg(msg)
                setIsEmailEmpty(true)
                // setAlertText(msg)
                // setIsOpenAlert(true)
            } else if (id === PASSWORDBLANK || id === PASSWORDINVALID) {
                //msg += "錯誤代碼：" + id + `\n`
                setErrorMsg(msg)
                setIsPasswordEmpty(true)
                // setAlertText(msg)
                // setIsOpenAlert(true)
            }
        }
    }

    // submit onChange()
    //const change = () => {}
    //const returnFocusRef = React.useRef(null)

    //console.info("isEmailEmpty is " + isEamilEmpty)

    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-20">歡迎回來 !</h2>
                <form>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                        <Input 
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            id="email"
                            placeholder="you@example.com"
                            isRequired={true}
                            isError={isEamilEmpty}
                            errorMsg={errorMsg}
                            onChange={handleEmail}
                            onClear={handleClearEmail}
                        />
                        <Password 
                            label="密碼"
                            name="password"
                            value={password}
                            id="password"
                            placeholder="請填密碼"
                            isRequired={true}
                            isError={isPasswordEmpty}
                            errorMsg={errorMsg}
                            onChange={handlePassword}
                            onClear={handleClearPassword}
                        />
                        
                        <a href="/member/forget_password" className="text-textTitleColor text-sm">忘記密碼？</a>

                        <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 bg-Primary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            登入
                        </button>

                        <div className="text-menuTextWhite text-sm mt-3">還沒有帳號，請<a className="text-Primary text-sm" href="/member/register">註冊</a></div>
                    </div>
                </form>  
            </main>
        </div>

        {/* <Alert isOpen={isOpenAlert} text={alertText} close={handleClose} /> */}

        </Layout>
        </>
    );

    
}

export default Login