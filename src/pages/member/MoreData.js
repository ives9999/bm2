import { useContext, useReducer, useState, useEffect } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import DateSingle from "../../component/form/DateSingle";
import SelectCity from "../../component/form/SelectCity";
import SelectArea from "../../component/form/SelectArea";
import Sex from "../../component/form/Sex";
import UseHr from "../../component/UseHr";
import {PrimaryButton} from '../../component/MyButton';
import {citys, areas} from "../../zone.js"

function MoreData() {
    const {memberData, memberDispatch, setIsLoading, setAlertModel} = useContext(BMContext)
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '會員更多資訊', href: '/member/moreData', current: true },
    ]

    const {tel, dob, sex, city_id, area_id, road, fb, line, token} = memberData

    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas)
    useEffect(() => {
        if (city_id > 0 && area_id > 0) {
            setAreaFromCity(city_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city_id])

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        telError: obj,
        cityError: obj,
        areaError: obj,
        roadError: obj,
    }
    const errorReducer = (state=initalError, action) => {
    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    //當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        if (e.target.id === 'city_id') {
            setAreaFromCity(parseInt(e.target.value))
        } else if (e.target.id === 'sex_M' || e.target.id === 'sex_F') {
            e.target.id = "sex"
        }
        memberDispatch({type: 'UPDATE', payload: {[e.target.id]: e.target.value}})
		clearError(e.target.id)
    }

    //當按下清除按鈕後，清除欄位值
    const handleClear = (id) => {
        memberDispatch({type: 'UPDATE', payload: {[id]: ""}})
		clearError(id)

        if (id === 'city_id') {
            memberDispatch({type: 'UPDATE', payload: {area_id: ""}})
        }
    }

    function setAreaFromCity(city) {
        //將區域的值放入selectedAreas
        selectedAreas = [{city: 0, id: 0, name: "無"}]
        for (var i = 0; i < areas.length; i++) {
            const area = areas[i]
            if (parseInt(area.city) === parseInt(city)) {
                selectedAreas.push(area)
            }
        }
        setCityAreas(selectedAreas)
    }

    const clearError = (id) => {
        // var error = {}
		// if (id === 'email') {
		// 	error = {emailError:{message: ''}}
		// } else if (id === 'password') {
		// 	error = {passwordError:{message: ''}}
		// } else if (id === 'repassword') {
		// 	error = {repasswordError:{message: ''}}
		// } else if (id === 'name') {
		// 	error = {nameError:{message: ''}}
		// } else if (id === 'nickname') {
		// 	error = {nicknameError:{message: ''}}
		// } else if (id === 'mobile') {
		// 	error = {mobileError:{message: ''}}
		// } else if (id === 'privacy') {
        //     error = {privacyError:{message: ''}}
        // }
        // dispatch({type: 'CLEAR_ERROR', payload: error})
	}

    const onSubmit = (e) => {

    }
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs} />
            <h2 className="text-Primary text-center text-4xl font-bold mb-8">會員更多資訊</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                    <Input 
                        label="市內電話"
                        type="tel"
                        name="tel"
                        value={tel || ''}
                        id="tel"
                        placeholder="0233445566"
                        errorMsg={errorObj.telError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SelectCity
                        citys={citys}
                        value={city_id || 0}
                        errorMsg={errorObj.cityError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SelectArea
                        areas={cityAreas}
                        value={area_id || 0}
                        errorMsg={errorObj.areaError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Input 
                        label="路名、街道巷弄等"
                        type="text"
                        name="road"
                        value={road || ''}
                        id="road"
                        placeholder="中正路50號6F"
                        errorMsg={errorObj.areaError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <UseHr />
                    <Sex
                        defaultChecked={sex}
                        onChange={onChange}
                    />
                    <DateSingle
                        label="生日"
                        name="dob"
                        value={dob}
                        id="dob"
                        onChange={onChange}
                    />
                    <UseHr />
                    <Input 
                        label="line"
                        type="text"
                        name="line"
                        value={line || ''}
                        id="line"
                        placeholder="sportpassword"
                        onChange={onChange}
                        onClear={handleClear}
                    />

                    <Input 
                        label="FB"
                        type="text"
                        name="fb"
                        value={fb || ''}
                        id="fb"
                        placeholder="https://www.facebook.com/100064670472280/"
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <PrimaryButton type="submit" extraClassName="w-full">送出</PrimaryButton>
                </div>
            </form>
        </div>
    )
}

export default MoreData
