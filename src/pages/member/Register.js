import { React, useState, Fragment, useEffect } from "react";
import Cookies from "universal-cookie";
import { dump } from "../../functions"

import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";
import DateSingle from "../../component/form/DateSingle";
import SelectCity from "../../component/form/SelectCity";
import SelectArea from "../../component/form/SelectArea";
import Sex from "../../component/form/Sex";
import Privacy from "../../component/form/Privacy";
import UseHr from "../../component/UseHr";
//import Avatar from "../../component/form/Avatar";
import Alert from "../../component/Alert";
import Info from "../../component/Info";

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
    //REPASSWORDBLANK,
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
 } from "../../errors/MemberError"

 import { 
    INSERTFAIL,
    EMAILFAIL,
    SMSFAIL,
    // getInsertFAILError,
    // getEmailFailError,
    // getSMSFailError

} from "../../errors/Error"


 import {citys, areas} from "../../zone.js"
 import axios from "axios";

 //console.info(citys)

 const data = {
    name: "",
    nickname: "",
    email: "",
    mobile: "",
    tel: "",
    city_id: 0,
    area_id: 0,
    road: "",
    dob: "",
    sex: "M",
    line: "",
    fb: "",
    // name: "孫志煌567",
    // nickname: "ivestrain",
    // email: "ives@bluemobile.com.tw",
    // password: "1234",
    // repassword: "1234",
    // mobile: "0911299994",
    // tel: "062295888",
    // city_id: 218,
    // area_id: 220,
    // road: "仁和路45-12號",
    // dob: "1969-01-05",
    // sex: "M",
    // line: "ives9999",
    // fb: "https://www.facebook.com",
}

const Register = () => {

    const [token, setToken] = useState(null)
    const [title, setTitle] = useState("註冊")
    const [submitButton, setSubmitButton] = useState("註冊")
    const [breadcrumbs, setBreadcrumbs] = useState([
        { name: '註冊', href: '/register', current: true },
    ])
    useEffect(() => {
        const cookies = new Cookies();
        var token1 = cookies.get("token")
            // dump(token1)
            if (token1 !== undefined) {
            setToken(token1)
            const url = process.env.REACT_APP_API + "/member/getOne?token=" + token1

            const config = {
                method: "GET",
                Headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios.get(url, {}, config)
            .then(response => {
                if (response.data.success) {
                    const row = response.data.row
                    setTitle("更新資料")
                    setSubmitButton("更新")
                    // dump(title)
                    setMyName(row.name)
                    setNickname(row.nickname)
                    setEmail(row.email)
                    setIsPasswordHidden(true)
                    setMobile(row.mobile)
                    setTel(row.tel)
                    setCityId(row.city_id)
                    if (row.city_id > 0) {
                        for (var i = 0; i < areas.length; i++) {
                            const area = areas[i]
                            if (area.city === parseInt(row.city_id)) {
                                selectedAreas.push(area)
                            }
                        }
                    }
                    setCityAreas(selectedAreas)
                    setAreaId(row.area_id)
                    setRoad(row.road)
                    setDob({
                        startDate: row.dob,
                        endDate: row.dob,
                    })
                    setSex(row.sex)
                    setLine(row.line)
                    setFb(row.fb)
                    setIsPrivacyHidden(true)
                    setBreadcrumbs([
                        { name: '會員', href: '/member', current: false },
                        { name: '會員資料', href: '/member/register', current: true },
                    ])
                }
            })
        }
    },[])

    //設定email與初值
    const [email, setEmail] = useState(data.email)

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
    const [isPasswordHidden, setIsPasswordHidden] = useState(false)

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
    const [dob, setDob] = useState({
        startDate: data["dob"],
        endDate: data["dob"],
    })
    
    // 選擇完生日後，設定其值
    const handleDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDob(newValue); 
    }

    // 性別
    const [sex, setSex] = useState(data["sex"])
    // 性別更新時，渲染頁面
    const handleSex = (event) => {
        //console.info(event.target.value)
        setSex(event.target.value)
    }

    //設定市內電話與初值
    const [tel, setTel] = useState(data["tel"])

    //當市內電話值改變時，偵測最新的值，渲染頁面
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
    //先前的縣市id，偵測縣市是否有變更，區域id也是，如果選擇後的值跟選擇錢不一樣，表示更換選擇了，如果一樣，表示沒有更換縣市，區域的值就不用更新
    var [pre_city_id, pre_area_id] = [defaultCity, defaultArea]

    //偵測縣市是否有選擇，顯示錯誤訊息時使用
    const [isCityEmpty, setIsCityEmpty] = useState(false)
    
    // 初始化縣市選擇完後，區域的選擇值
    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    //選擇縣市後的動作
    const handleCity = (event) => {
        setCityId(event.target.value)
        //準備好該縣市的區域陣列
        if (event.target.value > 0 && event.target.value !== pre_city_id) {
            //選擇完縣市後，存放區域的陣列

            // 將區域的值放入selectedAreas
            selectedAreas = [{city: 0, id: 0, name: "無"}]
            for (var i = 0; i < areas.length; i++) {
                const area = areas[i]
                if (parseInt(area.city) === parseInt(event.target.value)) {
                    selectedAreas.push(area)
                }
            }
            setCityAreas(selectedAreas)
            setIsCityEmpty(false)

            // 設定上一個選擇值為現在值
            pre_city_id = event.target.value
        }
    }

    //清除縣市的按鈕被按下，清除1.縣市的陣列清除，2.區域的陣列清除，3.上一次的選擇縣市值
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

    // 如果有預設的縣市值，則必須先把區域的選擇選項先準備好
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

    // 選擇完縣市後，該縣市區域的陣列
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

    // 當按下清除區域x圖示後，清除區域的陣列
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
    const [isPrivacyHidden, setIsPrivacyHidden] = useState(false)
    // 偵測同意隱私權是否為空直，顯示錯誤訊息時使用
    const [isPrivacyEmpty, setIsPrivacyEmpty] = useState(false)

    // 當同意隱私權值改變時，偵測最新的值
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

    // open warning modal dialog
    const [isOpenAlert, setIsOpenAlert] = useState(false)

    // 關閉警告對話盒
    const handleAlertClose = () => {
        setIsOpenAlert(false)
    }

    // 設定警告對話盒的訊息文字
    const [alertText, setAlertText] = useState("")

    // open info modal dialog
    const [isOpenInfo, setIsOpenInfo] = useState(false)

    // 關閉訊息對話盒
    const handleInfoClose = () => {
        setIsOpenInfo(false)
        window.location.href = "/member/login"
    }

    // 設定訊息對話盒的訊息文字
    const [infoText, setInfoText] = useState("")

    //按下送出後的動作
    const handleSubmit = (event) => {
        //console.info(privacy)
        //console.info(dobValue.startDate)
        event.preventDefault();

        var isPass = true
        var params = {}

        if (token !== null) {
            params["token"] = token
        }

        // 偵測姓名沒有填的錯誤
        if (myName !== undefined && myName.length > 0) {
            params["name"] = myName
        } else {
            setIsMyNameEmpty(true)
            setMyNameErrorMsg(GetNameBlankError().msg)
            isPass = false
        }

        // 偵測暱稱沒有填的錯誤
        if (nickname.length > 0) {
            params["nickname"] = nickname
        } else {
            setIsNicknameEmpty(true)
            setNicknameErrorMsg(GetNicknameBlankError().msg)
            isPass = false
        }

        // 偵測email沒有填的錯誤
        if (email.length > 0) {
            params["email"] = email
        } else {
            setIsEmailEmpty(true)
            setEmailErrorMsg(GetEmailBlankError().msg)
            isPass = false
        }

        // 偵測密碼沒有填的錯誤
        if (token === null) {
            if (password.length > 0) {
                params["password"] = password
            } else {
                setIsPasswordEmpty(true)
                setPasswordErrorMsg(GetPasswordBlankError().msg)
                isPass = false
            }
        }

        // 偵測確認密碼沒有填的錯誤
        if (token === null) {
            if (rePassword.length > 0) {
                params["repassword"] = rePassword
            } else {
                setIsRePasswordEmpty(true)
                setRePasswordErrorMsg(GetRePasswordBlankError().msg)
                isPass = false
            }
        }

        // 偵測密碼與確認密碼不一致的錯誤
        if (token === null) {
            if (password !== rePassword) {
                setIsRePasswordEmpty(true)
                setRePasswordErrorMsg(GetPasswordNotMatchError().msg)
                isPass = false
            }
        }

        // 偵測手機沒有填的錯誤
        if (mobile.length > 0) {
            params["mobile"] = mobile
        } else {
            setIsMobileEmpty(true)
            setMobileErrorMsg(GetMobileBlankError().msg)
            isPass = false
        }
        // 偵測縣市沒有選擇的錯誤
        if (cityId > 0) {
            params["city_id"] = cityId
        } else {
            setIsCityEmpty(true)
            setCityErrorMsg(GetCityBlankError().msg)
            isPass = false
        }

        // 偵測區域沒有選擇的錯誤
        if (areaId > 0) {
            params["area_id"] = areaId
        } else {
            setIsAreaEmpty(true)
            setAreaErrorMsg(GetAreaBlankError().msg)
            isPass = false
        }

        // 偵測路名沒有填的錯誤
        if (road.length > 0) {
            params["road"] = road
        } else {
            setIsRoadEmpty(true)
            setRoadErrorMsg(GetRoadBlankError().msg)
            isPass = false
        }

        // 偵測同意隱私權沒有勾選的錯誤
        if (token === null) {
            if (privacy) {
                params["privacy"] = 1
            } else {
                setIsPrivacyEmpty(true)
                setPrivacyErrorMsg(GetPrivacyBlankError().msg)
                isPass = false
            }
        }

        // client端檢查錯誤完成，如果客戶端資料全部無誤後，準備送出註冊資料
        if (isPass) {
            params["sex"] = sex

            if (dob.startDate !== "") {
                params["dob"] = dob.startDate
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
    
    // 伺服器回傳訊息的處置
    const callback = (data) => {
        // 註冊成功
        if (data["success"]) {
            //console.info(data)
            setInfoText("恭喜您完成註冊，請重新登入！！")
            setIsOpenInfo(true)
        // 註冊失敗
        } else {
            // 回傳的錯誤訊息與代號
            const msgs = data["msgs"]
            //console.info(msgs)
            var id = 0
            var msg = ""
            for (let i = 0; i < msgs.length; i++) {
                //console.info(msgs[i])
                id = msgs[i].id
                msg = msgs[i].msg

                // 姓名空白或姓名重複
                if (id === NAMEBLANK || id === NAMEEXIST) {
                    setMyNameErrorMsg(msg)
                    setIsMyNameEmpty(true)
                }

                // 暱稱空白或暱稱重複
                if (id === NICKNAMEBLANK || id === NICKNAMEEXIST) {
                    setNicknameErrorMsg(msg)
                    setIsNicknameEmpty(true)
                }

                // email空白或email重複
                if (id === EMAILBLANK || id === EMAILEXIST) {
                    setEmailErrorMsg(msg)
                    setIsEmailEmpty(true)
                }

                // 密碼空白或密碼與密碼確認不一致
                if (id === PASSWORDBLANK || id === PASSWORDNOTMATCH) {
                    setPasswordErrorMsg(msg)
                    setIsPasswordEmpty(true)
                }

                // 密碼確認空白，用密碼不一致處理
                // if (id === REPASSWORDBLANK) {
                //     setRePasswordErrorMsg(msg)
                //     setIsRePasswordEmpty(true)
                // }

                // 手機空白或手機重複
                if (id === MOBILEBLANK || id === MOBILEEXIST) {
                    setMobileErrorMsg(msg)
                    setIsMobileEmpty(true)
                }

                // 縣市沒有選擇
                if (id === CITYBLANK) {
                    setCityErrorMsg(msg)
                    setIsCityEmpty(true)
                }

                // 區域沒有選擇
                if (id === AREABLANK) {
                    setAreaErrorMsg(msg)
                    setIsAreaEmpty(true)
                }

                // 路名沒有填寫
                if (id === ROADBLANK) {
                    setRoadErrorMsg(msg)
                    setIsRoadEmpty(true)
                }

                // 隱私權沒有同意
                if (id === PRIVACYBLANK) {
                    setPrivacyErrorMsg(msg)
                    setIsPrivacyEmpty(true)
                }
            }

            //接收伺服器回傳的錯誤
            //目前伺服器的錯誤有3種
            //1.新增或修改資料庫時發生錯誤
            //2.寄送email認證碼時發生錯誤
            //3.發送簡訊認證碼時發生錯誤
            var msgs1 = ""
            for (let i = 0; i < msgs.length; i++) {
                id = msgs[i].id
                msg = msgs[i].msg

                //1.新增或修改資料庫時發生錯誤
                if (id === INSERTFAIL) {
                    setAlertText(msg)
                    setIsOpenAlert(true)
                }

                //如果寄送email或簡訊認證碼時若發生錯誤，會放置在同一個錯誤中回傳
                if (id === EMAILFAIL || id === SMSFAIL) {
                    msgs1 += msg + "\n"
                }
            }
            if (msgs1.length > 0) {
                setAlertText(msgs1)
                setIsOpenAlert(true)
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
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">{title}</h2>
            </main>

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
                        isHidden={isPasswordHidden}
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
                        isHidden={isPasswordHidden}
                        errorMsg={rePasswordErrorMsg}
                        onChange={handleRePassword}
                        onClear={clearRePassword}
                    />
                    <UseHr isHidden={setIsPasswordHidden} />
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
                        value={dob}
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
                    <UseHr isHidden={setIsPrivacyHidden} />

                    <Privacy
                        checked={privacy}
                        isError={isPrivacyEmpty}
                        errorMsg={privacyErrorMsg}
                        isHidden={isPrivacyHidden}
                        onChange={handlePrivacy}
                    />
                    
                    <button
                        type="button"
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        {submitButton}
                    </button>

                    <div className={`text-menuTextWhite text-sm mt-3 ${token === null ? "block" : "hidden"}`}>
                        已經有帳號，請<a className="text-myPrimary text-sm" href="/member/login">登入</a>
                    </div>
                </div>
            </form>  
        </div>    
        <Alert isOpen={isOpenAlert} text={alertText} close={handleAlertClose} />
        <Info isOpen={isOpenInfo} text={infoText} close={handleInfoClose} />
        </Layout>
        </>
    );
}

export default Register