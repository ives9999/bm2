import { React, useState, Fragment } from "react";

import Layout from '../../layout/Layout';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";

import { 
    GetEmailBlankError, 
    GetNameBlankError, 
    GetNicknameBlankError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
 } from "../../Errors"

const Register = () => {

    //設定暱稱與初值
    const [nickname, setNickname] = useState('')

    //當暱稱值改變時，偵測最新的值
    const handleNickname = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsNicknameEmpty(false)
            setNicknameErrorMsg("")
        }
        setNickname(value)
    }

    //偵測暱稱是否為空直，顯示錯誤訊息時使用
    const [isNicknameEmpty, setIsNicknameEmpty] = useState(false)

    //當按下清除暱稱文字按鈕後，清除暱稱
    const handleClearNickname = (event) => {
        event.preventDefault()
        setNickname("")
    }

    //設定錯誤訊息
    const [nicknameErrorMsg, setNicknameErrorMsg] = useState("")

    //設定姓名與初值
    const [myName, setMyName] = useState('')

    //當姓名值改變時，偵測最新的值
    const handleMyName = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsMyNameEmpty(false)
            setNameErrorMsg("")
        }
        setMyName(value)
    }

    //偵測姓名是否為空直，顯示錯誤訊息時使用
    const [isMyNameEmpty, setIsMyNameEmpty] = useState(false)

    //當按下清除姓名文字按鈕後，清除姓名
    const handleClearMyName = (event) => {
        event.preventDefault()
        setMyName("")
    }

    //設定錯誤訊息
    const [nameErrorMsg, setNameErrorMsg] = useState("")

    //設定email與初值
    const [email, setEmail] = useState('')

    //當email值改變時，偵測最新的值
    const handleEmail = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsEmailEmpty(false)
            setEmailErrorMsg("")
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

    //設定錯誤訊息
    const [emailErrorMsg, setEmailErrorMsg] = useState("")


    //設定密碼與初值
    const [password, setPassword] = useState('')

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)    

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
    //設定錯誤訊息
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")

    //設定密碼與初值
    const [rePassword, setRePassword] = useState('')

    //偵測密碼是否為空直，顯示錯誤訊息時使用
    const [isRePasswordEmpty, setIsRePasswordEmpty] = useState(false)    

    //當密碼值改變時，偵測最新的值
    const handleRePassword = (event) => {
        var value = event.target.value
        if (value.length > 0) {
            setIsRePasswordEmpty(false)
        }
        setRePassword(event.target.value)
    }

    //當按下清除密碼文字按鈕後，清除密碼
    const handleClearRePassword = (event) => {
        event.preventDefault()
        setRePassword("")
    }

    //設定錯誤訊息
    const [rePasswordErrorMsg, setRePasswordErrorMsg] = useState("")

    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault();

        var isPass = false
        var params = {}

        if (myName.length > 0) {
            params["name"] = myName
            isPass = true;
        } else {
            setIsMyNameEmpty(true)
            setNameErrorMsg(GetNameBlankError().msg)
            isPass = false
        }

        if (nickname.length > 0) {
            params["nickname"] = nickname
            isPass = true;
        } else {
            setIsNicknameEmpty(true)
            setNicknameErrorMsg(GetNicknameBlankError().msg)
            isPass = false
        }

        if (email.length > 0) {
            params["email"] = email
            isPass = true;
        } else {
            setIsEmailEmpty(true)
            setEmailErrorMsg(GetEmailBlankError().msg)
            isPass = false
        }

        if (password.length > 0) {
            params["password"] = password
            isPass = true;
        } else {
            setIsPasswordEmpty(true)
            setPasswordErrorMsg(GetPasswordBlankError().msg)
            isPass = false
        }

        if (rePassword.length > 0) {
            params["repassword"] = rePassword
            isPass = true;
        } else {
            setIsRePasswordEmpty(true)
            setRePasswordErrorMsg(GetRePasswordBlankError().msg)
            isPass = false
        }

        if (password !== rePassword) {
            setIsRePasswordEmpty(true)
            setRePasswordErrorMsg(GetPasswordNotMatchError().msg)
            isPass = false
        }

        if (isPass) {
        
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
                        value={nickname}
                        id="nickname"
                        placeholder="羽神"
                        isRequired={true}
                        isError={isNicknameEmpty}
                        errorMsg={nicknameErrorMsg}
                        onChange={handleNickname}
                        onClear={handleClearNickname}
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
                        errorMsg={emailErrorMsg}
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
                        errorMsg={passwordErrorMsg}
                        onChange={handlePassword}
                        onClear={handleClearPassword}
                    />

                    <Password 
                        label="確認密碼"
                        name="repassword"
                        value={rePassword}
                        id="repassword"
                        placeholder="請填確認密碼"
                        isRequired={true}
                        isError={isRePasswordEmpty}
                        errorMsg={rePasswordErrorMsg}
                        onChange={handleRePassword}
                        onClear={handleClearRePassword}
                    />
                    <Input 
                        label="姓名"
                        type="text"
                        name="name"
                        value={myName}
                        id="name"
                        placeholder="王小明"
                        isRequired={true}
                        isError={isMyNameEmpty}
                        errorMsg={nameErrorMsg}
                        onChange={handleMyName}
                        onClear={handleClearMyName}
                    />
                    
                    <button
                        type="button"
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        註冊
                    </button>

                    <div className="text-menuTextWhite text-sm mt-3">已經有帳號，請<a className="text-myPrimary text-sm" href="/member/login">登入</a></div>
                </div>
            </form>  
        </div>    
        </Layout>
        </>
    );
}

export default Register