import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Alert from "../../component/tailwind/Alert";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
// import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import Input from "../../component/form/Input";

const Login = () => {

    const [email, setEmail] = useState('ives@bluemobile.com.tw1')
    const [password, setPassword] = useState('5678')

    const [isEamilEmpty, setIsEmailEmpty] = useState(false)
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

    const handleEmail = (event) => {
        console.info("aaa")

        var value = event.target.value
        if (value.length > 0) {
            setIsEmailEmpty(false)
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
        console.info("form submit")
        event.preventDefault();

        var isPass = false
        var params = {}
        //console.info(email)
        setIsEmailEmpty(true)

        if (email.length > 0) {
            params["email"] = email
            isPass = true;
        } else {
            setIsEmailEmpty(true)
            isPass = false
        }
        //console.info(isPass)

        if (password.length > 0) {
            params["password"] = password
            isPass = true;
        } else {
            setIsPasswordEmpty(true)
            isPass = false
        }
        //console.info(params)

        params["email"] = email
        params["password"] = password
        isPass = true
        // if (isPass) {
        //     axios.post(url, params)
        //     .then(response => callback(response.data))
        //     //mutation.mutate(params)
        //     // fetch(url, {
        //     //     method: "POST",
        //     //     body: JSON.stringify(params),
        //     //     headers: headers
        //     // })
        //     // .then(response => response.json())
        //     // .then(data => callback(data))
        // }

        //console.info(a);
    }

    const navigate = useNavigate();
    const callback = (data) => {
        // 登入成功
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
            var msg = ""
            for (let i = 0; i < msgs.length; i++) {
                msg += msgs[i] + "\n"
            }
            //alert(msg)
            if (msg === "無此Email\n") {
                //console.info(msg)
                setIsEmailEmpty(true)
                setAlertText(msg)
                setIsOpenAlert(true)
            } else if (msg === "密碼錯誤\n") {
                setIsPasswordEmpty(true)
                setAlertText(msg)
                setIsOpenAlert(true)
            }
        }
    }

    // submit onChange()
    const change = () => {}
    //const returnFocusRef = React.useRef(null)

    console.info("isEmailEmpty is " + isEamilEmpty)

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
            <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">歡迎回來 !</h2>
            <form>
                <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    <label htmlFor="email" className="block text-base font-medium leading-6 text-formLabelColor">
                        Email
                    </label>
                    <div className="mb-12">
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                            type="email"
                            name="email"
                            id="email"
                            className={`block w-full bg-blockColor rounded-lg border-0 p-5 ring-1 ring-inset placeholder:text-slate-500 focus:ring-2 ${!isEamilEmpty ? "focus:ring-menuTextWhite sm:text-sm sm:leading-6 text-menuTextWhite ring-borderColor" : " text-red-500 ring-red-500"} `}
                            placeholder="you@example.com"
                            defaultValue={email}
                            aria-invalid="true"
                            aria-describedby="email-error"
                            onChange={handleEmail}
                            />
                            <div className={`pointer-events-none absolute inset-y-0 right-0 items-center pr-3 ${!isEamilEmpty ? "hidden" : "flex"} `}>
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                        </div>
                        <p className={`mt-2 text-sm text-red-600 ${!isEamilEmpty ? "hidden" : "block"}`} id="email-error">
                            請填Email
                        </p>
                    </div>

                    <button
                        type="button"
                        className="rounded-md w-full h-12 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

        <Alert isOpen={isOpenAlert} text={alertText} close={handleClose} />

      </Layout>
        </>
    );

    
}

export default Login