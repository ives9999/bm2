import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Alert from "../../component/Alert";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
// import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isEamilEmpty, setIsEmailEmpty] = useState(false)
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

    const [errorMsg, setErrorMsg] = useState("")

    const handleEmail = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsEmailEmpty(false)
            setErrorMsg("")
        }
        setEmail(value)
    }

    const handlePassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsPasswordEmpty(false)
        }
        setPassword(event.target.value)
    }

    const handleClearEmail = (event) => {
        event.preventDefault()
        setEmail("")
    }

    const handleClearPassword = (event) => {
        event.preventDefault()
        setPassword("")
    }

    // open modal dialog
    const [isOpenAlert, setIsOpenAlert] = useState(false)

    const handleClose = () => {
        setIsOpenAlert(false)
    }

    const [alertText, setAlertText] = useState("")

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
            if (id === 1000) {
                //console.info(msg)
                //msg += "錯誤代碼：" + id + `\n`
                setErrorMsg(msg)
                setIsEmailEmpty(true)
                // setAlertText(msg)
                // setIsOpenAlert(true)
            } else if (id === 1001) {
                //msg += "錯誤代碼：" + id + `\n`
                setErrorMsg(msg)
                setIsPasswordEmpty(true)
                // setAlertText(msg)
                // setIsOpenAlert(true)
            }
        }
    }

    // submit onChange()
    const change = () => {}
    //const returnFocusRef = React.useRef(null)

    //console.info("isEmailEmpty is " + isEamilEmpty)

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
            <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">歡迎回來 !</h2>
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
                    

                    <button
                        type="button"
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        登入
                    </button>
                </div>
            </form>  
            </main>
        </div>
      {/* <div className="cover-home3">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <div className="text-center mt-50 pb-50">
                <h2 className="color-linear d-inline-block">歡迎回來 !</h2>
              </div>
              <div className="box-form-login pb-50">
                <div className="form-login bg-gray-850 border-gray-800 text-start">
                  <form onSubmit={handleSubmit}>
                    <Input
                        inputClassName={`form-control bg-gray-850 ${isEamilEmpty ? "is-invalid" : "border-gray-800"}`}
                        required={true}
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmail}
                    />
                    <Input
                        inputClassName={`form-control bg-gray-850 ${isPasswordEmpty ? "is-invalid" : "border-gray-800"}`}
                        required={true}
                        type="password"
                        name="password"
                        placeholder="密碼"
                        value={password}
                        onChange={handlePassword}
                    />
                    <div className="form-group"><a className="color-white link" href="/member/forget_password">忘記密碼?</a></div>
                    <div className="form-group">
                      <input className="btn btn-linear color-gray-850 hover-up" type="submit" value="登入" onChange={change} />
                    </div>
                    <div className="form-group mb-0"><span>沒有帳號?</span><a className="color-linear" href="/member/register"> 註冊</a></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

        {/* <Alert isOpen={isOpenAlert} text={alertText} close={handleClose} /> */}

      </Layout>
        </>
    );

    
}

export default Login