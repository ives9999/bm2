import { React, useState, Fragment } from "react";
import { dump } from "../../functions"

import Layout from '../../layout/Layout';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import SelectCity from "../../component/form/SelectCity";
import SelectArea from "../../component/form/SelectArea";
import Datepicker from "react-tailwindcss-datepicker"; 

import { 
    GetEmailBlankError, 
    GetNameBlankError, 
    GetNicknameBlankError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetMobileBlankError,
    GetCityBlankError,
    GetAreaBlankError,
    GetROADBlankError,
 } from "../../Errors"

 import {citys, areas} from "../../zone.js"
 //console.info(citys)

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
    const clearNickname = (event) => {
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
    const clearMyName = (event) => {
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
    const clearEmail = (event) => {
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
    const clearPassword = (event) => {
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
    const clearRePassword = (event) => {
        event.preventDefault()
        setRePassword("")
    }

    //設定錯誤訊息
    const [rePasswordErrorMsg, setRePasswordErrorMsg] = useState("")

    // 生日
    const [dobValue, setDobValue] = useState({
        startDate: "",
        endDate: "",
    })
    
    // 選擇完生日後，設定其值
    const handleDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDobValue(newValue); 
    }

    const sex = [
        { id: 'male', title: '男', checked: true },
        { id: 'female', title: '女', checked: false },
    ]

    const handleSex = (event) => {
        const value = event.target.value
        //console.info(value)
        for (var i = 0; i < sex.length; i++) {
            sex[i].checked = (value === sex[i].id) ? true : false
        }
        //console.info(sex)
    }

    //設定市內電話與初值
    const [tel, setTel] = useState('')

    //當手機值改變時，偵測最新的值
    const handleTel = (event) => {

        var value = event.target.value
        setTel(value)
    }

    //當按下清除市內電話文字按鈕後，清除市內電話
    const clearTel = (event) => {
        event.preventDefault()
        setTel("")
    }

    //設定手機錯誤訊息
    const [mobileErrorMsg, setMobileErrorMsg] = useState("")

    //設定手機與初值
    const [mobile, setMobile] = useState('')

    //當手機值改變時，偵測最新的值
    const handleMobile = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsMobileEmpty(false)
            setMobileErrorMsg("")
        }
        setMobile(value)
    }

    //偵測手機是否為空直，顯示錯誤訊息時使用
    const [isMobileEmpty, setIsMobileEmpty] = useState(false)

    //當按下清除手機文字按鈕後，清除手機
    const clearMobile = (event) => {
        event.preventDefault()
        setMobile("")
    }

    //縣市id, 區域id預設為0
    var [city_id, area_id] = [0, 0]
    //先前的縣市id，偵測縣市是否有變更，區域id也是
    var [pre_city_id, pre_area_id] = [0, 0]

    //偵測縣市是否有選擇，顯示錯誤訊息時使用
    const [isCityEmpty, setIsCityEmpty] = useState(false)
    
    //選擇縣市後的動作
    const handleCity = (event) => {
        event.preventDefault()
        city_id = event.target.value
        //準備好該縣市的區域陣列
        if (city_id > 0 && city_id !== pre_city_id) {
            //選擇完縣市後，存放區域的陣列
            var selectedAreas = [{city: 0, id: 0, name: "無"}]

            for (var i = 0; i < areas.length; i++) {
                const area = areas[i]
                if (parseInt(area.city) === parseInt(city_id)) {
                    selectedAreas.push(area)
                }
            }
            //console.info(selectedAreas)
            setCityAreas(selectedAreas)
            setIsCityEmpty(false)
            pre_city_id = city_id
        }
    }

    //清除縣市的按鈕被按下
    const clearCity = () => {
        dump("aaa")
        //event.preventDefault()
        // city_id = 0
        // pre_city_id = 0
        // setIsCityEmpty(true)
    }

    const [cityAreas, setCityAreas] = useState([{city: 0, id: 0, name: "無"}])

    //設定縣市錯誤訊息
    const [cityErrorMsg, setCityErrorMsg] = useState("")

    //偵測區域是否有選擇，顯示錯誤訊息時使用
    const [isAreaEmpty, setIsAreaEmpty] = useState(false)
    const handleArea = (event) => {
        event.preventDefault()
        area_id = event.target.value
    }
    const clearArea = () => {
    }
    //設定區域錯誤訊息
    const [areaErrorMsg, setAreaErrorMsg] = useState("")


    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info("form submit")
        //console.info(dobValue.startDate)
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

        if (mobile.length > 0) {
            params["mobile"] = mobile
            isPass = true;
        } else {
            setMobileErrorMsg(GetMobileBlankError().msg)
            isPass = false
        }

        if (city_id > 0) {
            params["city_id"] = city_id
            isPass = true;
        } else {
            setIsCityEmpty(true)
            setCityErrorMsg(GetCityBlankError().msg)
            isPass = false
        }

        if (area_id > 0) {
            params["area_id"] = area_id
            isPass = true;
        } else {
            setIsAreaEmpty(true)
            setAreaErrorMsg(GetAreaBlankError().msg)
            isPass = false
        }


        if (isPass) {
            for (var i = 0; i < sex.length; i++) {
                if (sex[i].checked) params["sex"] = sex[i].id
            }

            if (dobValue.startDate !== "") {
                params["dob"] = dobValue.startDate
            }

            if (tel.length > 0) {
                params["tel"] = tel
            }
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
                        onclear={clearNickname}
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
                        onclear={clearEmail}
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
                        onclear={clearPassword}
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
                        onclear={clearRePassword}
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
                        onclear={clearMyName}
                    />
                    <div className="flex justify-between">
                        <label htmlFor="dob" className="block text-base font-medium leading-6 text-formLabelColor">
                            生日
                        </label>
                    </div>
                    <div className="mb-6">
                        <Datepicker 
                            i18n={"zh-TW"} 
                            primaryColor={"lime"}
                            asSingle={true}
                            inputName="dob"
                            inputId="dob"
                            classNames="bg-red-700"
                            containerClassName="relative mt-2 rounded-md shadow-sm"
                            inputClassName="w-full 
                                bg-blockColor 
                                rounded-lg 
                                border-0 
                                p-5 
                                sm:text-sm 
                                sm:leading-6 
                                ring-1 
                                ring-inset 
                                placeholder:text-slate-500 
                                focus:ring-menuTextWhite text-menuTextWhite ring-borderColor
                                "
                            toggleClassName="absolute inset-y-0 right-0 items-center pr-3 flex text-textTitleColor mr-2"
                            value={dobValue} 
                            onChange={handleDateChange} 
                            showShortcuts={true}
                            configs={{
                                shortcuts: {
                                    // today: "今天",
                                    // yesterday: "昨天", 
                                    // past: period => `Les ${period}  derniers jours`, 
                                    // currentMonth: "Ce mois-ci", 
                                    // pastMonth: "Le mois dernier", 
                                },
                            }} 
                            // displayFormat={"YYYY/MM/DD"}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-base font-medium leading-6 text-formLabelColor">性別</label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <fieldset className="mt-4 bg-blockColor border border-borderColor rounded-md p-5">
                                    <legend className="sr-only">Notification method</legend>
                                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0" onChange={event => handleSex(event) }>
                                    {sex.map((row) => (
                                        <div key={row.id} className="flex items-center">
                                        <input
                                            id={row.id}
                                            name="sex"
                                            type="radio"
                                            value={row.id}
                                            defaultChecked={row.checked}
                                            className="h-4 w-4 border-white/10 bg-white/5 text-myPrimary focus:ring-green-600 focus:ring-offset-gray-900"
                                        />
                                        <label htmlFor={row.id} className="ml-3 block text-sm font-medium leading-6 text-primaryText">
                                            {row.title}
                                        </label>
                                        </div>
                                    ))}
                                    </div>
                                </fieldset>
                            </div>
                    </div>

                    <Input 
                        label="手機"
                        type="text"
                        name="mobile"
                        value={mobile}
                        id="mobile"
                        placeholder="0933456789"
                        isRequired={true}
                        isError={isMobileEmpty}
                        errorMsg={mobileErrorMsg}
                        onChange={handleMobile}
                        onclear={clearMobile}
                    />

                    <Input 
                        label="市內電話"
                        type="text"
                        name="tel"
                        value={tel}
                        id="tel"
                        placeholder="0283836039"
                        isRequired={false}
                        onChange={handleTel}
                        onclear={clearTel}
                    />


                    <SelectCity
                        citys={citys}
                        isRequired={true}
                        isError={isCityEmpty}
                        errorMsg={cityErrorMsg}
                        onChange={handleCity}
                        onclear={clearCity}
                    />
                    <SelectArea
                        areas={cityAreas}
                        isRequired={true}
                        isError={isAreaEmpty}
                        errorMsg={areaErrorMsg}
                        onChange={handleArea}
                        onclear={clearArea}
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