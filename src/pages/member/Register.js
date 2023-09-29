import { React, useState, Fragment } from "react";

import Layout from '../../layout/Layout';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";

import { GetEmailBlankError } from "../../Errors"

const Register = () => {

    //設定email與初值
    const [email, setEmail] = useState('')

    //當email值改變時，偵測最新的值
    const handleEmail = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsEmailEmpty(false)
            setErrorMsg("")
        }
        setEmail(value)
    }

    //偵測email是否為空直，顯示錯誤訊息時使用
    const [isEamilEmpty, setIsEmailEmpty] = useState(false)

    //當按下清除email文字按鈕後，清除email
    const handleClearEmail = (event) => {
        event.preventDefault()
        setEmail("")
    }


    //設定密碼與初值
    const [password, setPassword] = useState('')

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

    //設定錯誤訊息
    const [errorMsg, setErrorMsg] = useState("")

    

    //當密碼值改變時，偵測最新的值
    const handlePassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsPasswordEmpty(false)
        }
        setPassword(event.target.value)
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const handleClearPassword = (event) => {
        event.preventDefault()
        setPassword("")
    }

    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault();

        var isPass = false
        var params = {}

        if (email.length > 0) {
            params["email"] = email
            isPass = true;
        } else {
            setIsEmailEmpty(true)
            setErrorMsg(GetEmailBlankError().msg)
            isPass = false
        }
    }

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
              <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">註冊</h2>
            </main>
            <form>
                <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    <Input 
                        label="暱稱"
                        type="text"
                        name="nickname"
                        value={email}
                        id="nickname"
                        placeholder="羽神"
                        isRequired={true}
                        isError={isEamilEmpty}
                        errorMsg={errorMsg}
                        onChange={handleEmail}
                        onClear={handleClearEmail}
                    />
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
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        登入
                    </button>

                    <div className="text-menuTextWhite text-sm mt-3">還沒有帳號，請<a className="text-myPrimary text-sm" href="/member/register">註冊</a></div>
                </div>
            </form>  
        </div>    
        </Layout>
        </>
    );
}

export default Register