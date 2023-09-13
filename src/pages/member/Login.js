import Layout from '../../layout/Layout';
import { React, useState, useRef } from "react";
import Cookies from "universal-cookie";

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"


import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import Input from "../../element/form/Input";

const Login = () => {

    const [email, setEmail] = useState('ives@bluemobile.com.tw')
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

    const callback = (data) => {
        if (data["success"]) {
            //console.info(data)
            const cookies = new Cookies();
            cookies.set('token', data.row.token, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
    
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

      <Dialog
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
      </Dialog>

      </Layout>
        </>
    );

    
}

export default Login