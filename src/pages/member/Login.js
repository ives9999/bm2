import Layout from '../../layout/Layout';
import { React, useState } from "react";
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

    const config = (params) => {
        return {
            method: 'post',
            baseURL: process.env.REACT_APP_DOMAIN,
            url: process.env.REACT_APP_API,
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Origin": process.env.REACT_APP_DOMAIN,
            }
        }
    }

    const mutation = useMutation({
        mutation: (params) => {
            return axios.post(process.env.REACT_APP_API, params)
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        var isPass = false
        var params = {}
        // console.info(email)
        // if (email.length > 0) {
        //     params["email"] = email
        //     isPass = true;
        // } else {
        //     setIsEmailEmpty(true)
        //     isPass = false
        // }

        // if (password.length > 0) {
        //     params["password"] = password
        //     isPass = true;
        // } else {
        //     setIsPasswordEmpty(true)
        //     isPass = false
        // }
        //console.info(params)

        params["email"] = email
        params["password"] = password
        isPass = true
        if (isPass) {

            mutation.mutate(params)
            // fetch(process.env.REACT_APP_API + "/member/postLogin", {
            //     method: "POST",
            //     body: JSON.stringify(params),
                // headers: {
                //     "content-type": "application/json",
                //     "Origin": process.env.REACT_APP_DOMAIN,
                // }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data["success"]) {
            //         console.info(data)

            //     }
            // })
        }

        //console.info(a);
    }

    const change = () => {}

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
                    {/* <Input
                        // className="form-group"
                        // inputClass="form-control bg-gray-850 border-gray-800"
                        // required
                        // icon="email"
                        type="text"
                        name="email"
                        placeholder="Email"
                        // value=""
                    /> */}
                    <div className="form-group">
                      <input className={`form-control bg-gray-850 ${isEamilEmpty ? "is-invalid" : "border-gray-800"}`} type="text" placeholder="Email" name="email" defaultValue="ives@bluemobile.com.tw" onChange={handleEmail} />
                    </div>
                    <div className="form-group position-relative">
                      <input className={`form-control bg-gray-850 password ${isPasswordEmpty ? "is-invalid" : "border-gray-800"}`} type="password" placeholder="密碼" name="password" defaultValue="5678" onChange={handlePassword} /><span className="viewpass"></span>
                    </div>
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
      </Layout>
        </>
    );
}

export default Login