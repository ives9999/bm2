import { React, useState, Fragment } from "react";
import { dump } from "../../functions"

import Layout from '../../layout/Layout';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import DateSingle from "../../component/form/DateSingle";
import SelectCity from "../../component/form/SelectCity";
import SelectArea from "../../component/form/SelectArea";
import Sex from "../../component/form/Sex";
import Privacy from "../../component/form/Privacy";
import UseHr from "../../component/UseHr";
//import Avatar from "../../component/form/Avatar";

// import Uploady from "@rpldy/uploady";
// import { UploadButton } from "@rpldy/upload-button";
// import { UploadPreview } from "@rpldy/upload-preview";

import { 
    NAMEBLANK,
    NAMEEXIST,
    NICKNAMEBLANK,
    NICKNAMEEXIST,
    EMAILBLANK,
    EMAILEXIST,
    PASSWORDBLANK,
    REPASSWORDBLANK,
    PASSWORDNOTMATCH,
    MOBILEBLANK,
    MOBILEEXIST,
    CITYBLANK,
    AREABLANK,
    ROADBLANK,
    PRIVACYBLANK,
    GetEmailBlankError, 
    GetNameBlankError, 
    GetNicknameBlankError,
    GetPasswordBlankError, 
    GetRePasswordBlankError,
    GetPasswordNotMatchError,
    GetMobileBlankError,
    GetCityBlankError,
    GetAreaBlankError,
    GetRoadBlankError,
    GetPrivacyBlankError,
 } from "../../Errors"

 import {citys, areas} from "../../zone.js"
 import axios from "axios";

 //console.info(citys)

 const data = {
    name: "孫志煌",
    nickname: "ivestrain",
    email: "ives@bluemobile.com.tw",
    password: "1234",
    repassword: "1234",
    mobile: "0911299994",
    tel: "062295888",
    city_id: 218,
    area_id: 220,
    road: "仁和路45-12號",
    dob: "1969-01-05",
    sex: "M",
    line: "ives9999",
    fb: "https://www.facebook.com",
}

const Register = () => {

    //設定email與初值
    const [email, setEmail] = useState(data["email"])

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
        setIsEmailEmpty(false)
    }

    //設定錯誤訊息
    const [emailErrorMsg, setEmailErrorMsg] = useState("")

    //設定密碼與初值
    const [password, setPassword] = useState(data["password"])

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
        setIsPasswordEmpty(false)
    }
    //設定錯誤訊息
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")

    //設定密碼與初值
    const [rePassword, setRePassword] = useState(data["repassword"])

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
        setIsRePasswordEmpty(false)
    }

    //設定錯誤訊息
    const [rePasswordErrorMsg, setRePasswordErrorMsg] = useState("")
    //設定暱稱與初值
    const [nickname, setNickname] = useState(data["nickname"])

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
        setIsNicknameEmpty(false)
    }

    //設定錯誤訊息
    const [nicknameErrorMsg, setNicknameErrorMsg] = useState("")

    //設定姓名與初值
    const [myName, setMyName] = useState(data["name"])

    //當姓名值改變時，偵測最新的值
    const handleMyName = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsMyNameEmpty(false)
            setMyNameErrorMsg("")
        }
        setMyName(value)
    }

    //偵測姓名是否為空直，顯示錯誤訊息時使用
    const [isMyNameEmpty, setIsMyNameEmpty] = useState(false)

    //當按下清除姓名文字按鈕後，清除姓名
    const clearMyName = (event) => {
        event.preventDefault()
        setMyName("")
        setIsMyNameEmpty(false)
    }

    //設定錯誤訊息
    const [myNameErrorMsg, setMyNameErrorMsg] = useState("")

    // 生日
    const [dobValue, setDobValue] = useState({
        startDate: data["dob"],
        endDate: data["dob"],
    })
    
    // 選擇完生日後，設定其值
    const handleDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDobValue(newValue); 
    }

    const [sex, setSex] = useState(data["sex"])
    const handleSex = (event) => {
        //console.info(event.target.value)
        setSex(event.target.value)
    }

    //設定市內電話與初值
    const [tel, setTel] = useState(data["tel"])

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

    //設定手機與初值
    const [mobile, setMobile] = useState(data["mobile"])

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
        setIsMobileEmpty(false)
    }

    //設定手機錯誤訊息
    const [mobileErrorMsg, setMobileErrorMsg] = useState("")

    //縣市id預設為0
    var defaultCity = data["city_id"]

    //區域id預設為0
    var defaultArea = data["area_id"]

    const [cityId, setCityId] = useState(defaultCity)
    //先前的縣市id，偵測縣市是否有變更，區域id也是
    var [pre_city_id, pre_area_id] = [defaultCity, defaultArea]

    //偵測縣市是否有選擇，顯示錯誤訊息時使用
    const [isCityEmpty, setIsCityEmpty] = useState(false)
    
    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    //選擇縣市後的動作
    const handleCity = (event) => {
        setCityId(event.target.value)
        //準備好該縣市的區域陣列
        if (event.target.value > 0 && event.target.value !== pre_city_id) {
            //選擇完縣市後，存放區域的陣列

            selectedAreas = [{city: 0, id: 0, name: "無"}]
            for (var i = 0; i < areas.length; i++) {
                const area = areas[i]
                if (parseInt(area.city) === parseInt(event.target.value)) {
                    selectedAreas.push(area)
                }
            }
            setCityAreas(selectedAreas)
            setIsCityEmpty(false)
            pre_city_id = event.target.value
        }
    }

    //清除縣市的按鈕被按下
    const clearCity = (event) => {
        event.preventDefault()
        pre_city_id = defaultCity
        setCityId(defaultCity)
        var selectedAreas = [{city: 0, id: 0, name: "無"}]
        setCityAreas(selectedAreas)
        setIsCityEmpty(false)
    }

    //設定縣市錯誤訊息
    const [cityErrorMsg, setCityErrorMsg] = useState("")

    if (cityId > 0) {
        for (var i = 0; i < areas.length; i++) {
            const area = areas[i]
            if (area.city === cityId) {
                selectedAreas.push(area)
            }
        }
    }
    
    //區域id預設為0
    const [areaId, setAreaId] = useState(defaultArea)

    const [cityAreas, setCityAreas] = useState(selectedAreas)

    //偵測區域是否有選擇，顯示錯誤訊息時使用
    const [isAreaEmpty, setIsAreaEmpty] = useState(false)
    const handleArea = (event) => {
        event.preventDefault()
        if (event.target.value !== pre_area_id) {
            setAreaId(event.target.value)
            setIsAreaEmpty(false)
            pre_area_id = event.target.value
        }
    }
    const clearArea = (event) => {
        event.preventDefault()
        pre_area_id = defaultArea
        setAreaId(defaultArea)
        setIsAreaEmpty(false)
    }
    //設定區域錯誤訊息
    const [areaErrorMsg, setAreaErrorMsg] = useState("")

    //設定路名與初值
    const [road, setRoad] = useState(data["road"])

    //當路名值改變時，偵測最新的值
    const handleRoad = (event) => {

        var value = event.target.value
        if (value.length > 0) {
            setIsRoadEmpty(false)
            setRoadErrorMsg("")
        }
        setRoad(value)
    }

    //偵測路名是否為空直，顯示錯誤訊息時使用
    const [isRoadEmpty, setIsRoadEmpty] = useState(false)

    //當按下清除路名文字按鈕後，清除路名
    const clearRoad = (event) => {
        event.preventDefault()
        setRoad("")
        setIsRoadEmpty(false)
    }

    //設定路名錯誤訊息
    const [roadErrorMsg, setRoadErrorMsg] = useState("")

    //設定line與初值
    const [line, setLine] = useState(data["line"])

    //當line值改變時，偵測最新的值
    const handleLine = (event) => {

        var value = event.target.value
        setLine(value)
    }

    //當按下清除line文字按鈕後，清除line
    const clearLine = (event) => {
        event.preventDefault()
        setLine("")
    }

    //設定FB與初值
    const [fb, setFb] = useState(data["fb"])

    //當FB值改變時，偵測最新的值
    const handleFb = (event) => {

        var value = event.target.value
        setFb(value)
    }

    //當按下清除FB文字按鈕後，清除FB
    const clearFb = (event) => {
        event.preventDefault()
        setFb("")
    }

    const [privacy, setPrivacy] = useState(true)
    //偵測路名是否為空直，顯示錯誤訊息時使用
    const [isPrivacyEmpty, setIsPrivacyEmpty] = useState(false)

    //當FB值改變時，偵測最新的值
    const handlePrivacy = (event) => {
        //var value = event.target.value
        //console.info(event.target.checked)
        setPrivacy(event.target.checked)
        //dump(privacy)
        setIsPrivacyEmpty(!event.target.checked)
        setPrivacyErrorMsg(event.target.checked ? "" : GetPrivacyBlankError().msg)
    }

    //設定隱私權錯誤訊息
    const [privacyErrorMsg, setPrivacyErrorMsg] = useState("")

    // const handleAvatar = (event) => {
    // }

    // const clearAvatar = (event) => {

    // }

    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info(privacy)
        //console.info(dobValue.startDate)
        event.preventDefault();

        var isPass = true
        var params = {}

        if (myName !== undefined && myName.length > 0) {
            params["name"] = myName
        } else {
            setIsMyNameEmpty(true)
            setMyNameErrorMsg(GetNameBlankError().msg)
            isPass = false
        }

        if (nickname.length > 0) {
            params["nickname"] = nickname
        } else {
            setIsNicknameEmpty(true)
            setNicknameErrorMsg(GetNicknameBlankError().msg)
            isPass = false
        }

        if (email.length > 0) {
            params["email"] = email
        } else {
            setIsEmailEmpty(true)
            setEmailErrorMsg(GetEmailBlankError().msg)
            isPass = false
        }

        if (password.length > 0) {
            params["password"] = password
        } else {
            setIsPasswordEmpty(true)
            setPasswordErrorMsg(GetPasswordBlankError().msg)
            isPass = false
        }

        if (rePassword.length > 0) {
            params["repassword"] = rePassword
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
        } else {
            setIsMobileEmpty(true)
            setMobileErrorMsg(GetMobileBlankError().msg)
            isPass = false
        }

        if (cityId > 0) {
            params["city_id"] = cityId
        } else {
            setIsCityEmpty(true)
            setCityErrorMsg(GetCityBlankError().msg)
            isPass = false
        }

        if (areaId > 0) {
            params["area_id"] = areaId
        } else {
            setIsAreaEmpty(true)
            setAreaErrorMsg(GetAreaBlankError().msg)
            isPass = false
        }

        if (road.length > 0) {
            params["road"] = road
        } else {
            setIsRoadEmpty(true)
            setRoadErrorMsg(GetRoadBlankError().msg)
            isPass = false
        }

        if (privacy) {
            params["privacy"] = 1
        } else {
            setIsPrivacyEmpty(true)
            setPrivacyErrorMsg(GetPrivacyBlankError().msg)
            isPass = false
        }

        if (isPass) {
            params["sex"] = sex

            if (dobValue.startDate !== "") {
                params["dob"] = dobValue.startDate
            }

            if (tel.length > 0) {
                params["tel"] = tel
            }

            if (line.length > 0) {
                params["line"] = line
            }

            if (fb.length > 0) {
                params["fb"] = fb
            }
            //dump(params)
            const url = process.env.REACT_APP_API + "/member/postRegister"
            const headers = {
                headers: {
                    "content-type": "application/json",
                    "Origin": process.env.REACT_APP_DOMAIN,
                }
            }

            axios.post(url, params, headers)
            .then(response => callback(response.data))
            }
    }
    
    const callback = (data) => {
        // 註冊成功
        if (data["success"]) {
            console.info(data)
        // 註冊失敗
        } else {
            const msgs = data["msgs"]
            //console.info(msgs)
            var id = 0
            var msg = ""
            for (let i = 0; i < msgs.length; i++) {
                //console.info(msgs[i])
                id = msgs[i].id
                msg = msgs[i].msg

                if (id === NAMEBLANK || id === NAMEEXIST) {
                    setMyNameErrorMsg(msg)
                    setIsMyNameEmpty(true)
                }

                if (id === NICKNAMEBLANK || id === NICKNAMEEXIST) {
                    setNicknameErrorMsg(msg)
                    setIsNicknameEmpty(true)
                }

                if (id === EMAILBLANK || id === EMAILEXIST) {
                    setEmailErrorMsg(msg)
                    setIsEmailEmpty(true)
                }

                if (id === PASSWORDBLANK || id === PASSWORDNOTMATCH) {
                    setPasswordErrorMsg(msg)
                    setIsPasswordEmpty(true)
                }

                if (id === REPASSWORDBLANK) {
                    setRePasswordErrorMsg(msg)
                    setIsRePasswordEmpty(true)
                }

                if (id === MOBILEBLANK || id === MOBILEEXIST) {
                    setMobileErrorMsg(msg)
                    setIsMobileEmpty(true)
                }

                if (id === CITYBLANK) {
                    setCityErrorMsg(msg)
                    setIsCityEmpty(true)
                }

                if (id === AREABLANK) {
                    setAreaErrorMsg(msg)
                    setIsAreaEmpty(true)
                }

                if (id === ROADBLANK) {
                    setRoadErrorMsg(msg)
                    setIsRoadEmpty(true)
                }

                if (id === PRIVACYBLANK) {
                    setPrivacyErrorMsg(msg)
                    setIsPrivacyEmpty(true)
                }
            }
        }
    }

    // const DivUploadButton = asUploadButton((props) => {
    //     return <div {...props} style={{ rounded-md bg-lime-500 px-3 py-2 text-sm font-semibold text-lime-950 shadow-sm hover:bg-lime-600 }}>
    //         上傳
    //     </div>
    // });
    

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
              <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">註冊</h2>
            </main>

            <form>
                <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    {/* <Avatar
                        label="頭像"
                        name="avatar"
                        value=""
                        id="avatar"
                        isRequired={false}
                        isError={false}
                        errorMsg=""
                        onChange={handleAvatar}
                        onClear={clearAvatar}
                    /> */}
                    
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
                        onClear={clearEmail}
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
                        onClear={clearPassword}
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
                        onClear={clearRePassword}
                    />
                    <UseHr />
                    <Input 
                        label="姓名"
                        type="text"
                        name="name"
                        value={myName}
                        id="name"
                        placeholder="王小明"
                        isRequired={true}
                        isError={isMyNameEmpty}
                        errorMsg={myNameErrorMsg}
                        onChange={handleMyName}
                        onClear={clearMyName}
                    />
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
                        onClear={clearNickname}
                    />                    
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
                        onClear={clearMobile}
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
                        onClear={clearTel}
                    />
                    <SelectCity
                        citys={citys}
                        value={cityId}
                        isRequired={true}
                        isError={isCityEmpty}
                        errorMsg={cityErrorMsg}
                        onChange={handleCity}
                        onClear={clearCity}
                    />
                    <SelectArea
                        areas={cityAreas}
                        value={areaId}
                        isRequired={true}
                        isError={isAreaEmpty}
                        errorMsg={areaErrorMsg}
                        onChange={handleArea}
                        onClear={clearArea}
                    />
                    <Input 
                        label="路名、街道巷弄等"
                        type="text"
                        name="road"
                        value={road}
                        id="road"
                        placeholder="中正路50號6F"
                        isRequired={true}
                        isError={isRoadEmpty}
                        errorMsg={roadErrorMsg}
                        onChange={handleRoad}
                        onClear={clearRoad}
                    />
                    <UseHr />
                    <Sex
                        defaultChecked={sex}
                        onChange={handleSex}
                    />

                    <DateSingle
                        label="生日"
                        name="dob"
                        value={dobValue}
                        id="dob"
                        onChange={handleDateChange}
                    />

                    <Input 
                        label="line"
                        type="text"
                        name="line"
                        value={line}
                        id="line"
                        placeholder="sportpassword"
                        isRequired={false}
                        onChange={handleLine}
                        onClear={clearLine}
                    />

                    <Input 
                        label="FB"
                        type="text"
                        name="fb"
                        value={fb}
                        id="fb"
                        placeholder="https://www.facebook.com/100064670472280/"
                        isRequired={false}
                        onChange={handleFb}
                        onClear={clearFb}
                    />
                    <UseHr />

                    <Privacy
                        checked={privacy}
                        isError={isPrivacyEmpty}
                        errorMsg={privacyErrorMsg}
                        onChange={handlePrivacy}
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