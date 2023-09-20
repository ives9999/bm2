import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Alert from "../../component/tailwind/Alert";
// import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
// import Button from "@mui/material/Button"
// import Dialog from "@mui/material/Dialog"
// import DialogTitle from "@mui/material/DialogTitle"
// import DialogContent from "@mui/material/DialogContent"
// import DialogContentText from "@mui/material/DialogContentText"
// import DialogActions from "@mui/material/DialogActions"


import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import Input from "../../component/form/Input";

const Login = () => {

    const [email, setEmail] = useState('ives@bluemobile.com.tw1')
    const [password, setPassword] = useState('5678')

    const [isEamilEmpty, setIsEmailEmpty] = useState(false)
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

    const handleEmail = (event) => {
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
        event.preventDefault();

        var isPass = false
        var params = {}
        //console.info(email)
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
        if (isPass) {
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

    return (
        <>
        <Layout>
      <div className="cover-home3">
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
      </div>

        <Alert isOpen={isOpenAlert} text={alertText} close={handleClose} />
      {/* <Transition.Root show={isOpenAlert} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      警告
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm dark:text-gray-500">
                        {alertText}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleClose}
                  >
                    關閉
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root> */}

      {/* <Dialog
        open={isOpenAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"警告"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { alertText }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>關閉</Button>
        </DialogActions>
      </Dialog> */}

      </Layout>
        </>
    );

    
}

export default Login