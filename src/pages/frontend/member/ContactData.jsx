import React, {useContext, useEffect, useState} from 'react';
import BMContext from "../../../context/BMContext";
import Breadcrumb from "../../../component/Breadcrumb";
import Input from "../../../component/form/Input";
import {PrimaryButton} from "../../../component/MyButton";
import {
    GetAreaBlankError,
    GetCityBlankError,
    GetEmailBlankError,
    GetRoadBlankError,
    GetSexBlankError
} from "../../../errors/MemberError";
import Validate from "../../../functions/validate";
import Sex from "../../../component/form/Sex";
import SelectCity from "../../../component/form/SelectCity";
import {areas, citys} from "../../../zone";
import SelectArea from "../../../component/form/SelectArea";
import {contactDataAPI} from "../../../context/member/MemberAction";
import {ImSpinner6} from "react-icons/im";

const ContactData = () => {
    const {auth, setAuth, setIsLoading, isLoading, setAlertModal, warning} = useContext(BMContext);
    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas);
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

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '會員聯絡資訊', href: '/member/ContactData', current: true },
    ];

    const initErrMsgs = {
        email: '',
        city_id: '',
        area_id: '',
        road: '',
        sex: '',
    };
    const [errorMsgs, setErrorMsgs] = useState(initErrMsgs);

    useEffect(() => {
        if (auth.city_id > 0 && auth.area_id > 0) {
            setAreaFromCity(auth.city_id)
        }
    }, []);

    const onChange = (e) => {
        if (e.target.id === 'city_id') {
            setAuth((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
            setAreaFromCity(parseInt(e.target.value));
        } else {
            setAuth((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
            setErrorMsgs((prev) => ({
                ...prev, [e.target.id]: ''
            }));
        }
    }

    const handleClear = (id) => {
        const e = {target: {id: id, value: ''}};
        onChange(e);
    }

    const onSubmit = async () => {

        const rules = [
            ['email', 'required', {message: GetEmailBlankError().msg}],
            ['city_id', 'required', {message: GetCityBlankError().msg}],
            ['area_id', 'required', {message: GetAreaBlankError().msg}],
            ['road', 'required', {message: GetRoadBlankError().msg}],
            ['sex', 'required', {message: GetSexBlankError().msg}],
        ];

        const validate = new Validate(auth, rules);
        const isPass = validate.validate();
        if (!isPass) {
            //console.info(validate.errors);
            validate.showErrors(setErrorMsgs);
            return;
        }

        let params = {
            email: auth.email,
            city_id: auth.city_id,
            area_id: auth.area_id,
            sex: auth.sex
        };
        setIsLoading(true);
        const data = await contactDataAPI(auth.accessToken, params);
        setIsLoading(false);
        //console.info(data);
        if (data["status"] >= 200 && data["status"] < 300) {
            var obj = {
                modalType: 'success',
                modalTitle: '成功',
                modalText: "完成修改，請收取email完成email認證",
                isModalShow: true,
                isShowCancelButton: true,
            }
            setAlertModal(obj);
            //setFormData(data.data);
            // 更新資料失敗
        } else {
            var messages = [];
            Object.keys(data['message']).forEach((key) => {
                //console.info(data['message'][key]);
                // 如果錯誤是發生在輸入項當中，就用輸入項的錯誤來顯示
                if (key in errorMsgs) {
                    setErrorMsgs((prev) => {
                        return {...prev, [key]: data['message'][key]}
                    });
                    // 如果錯誤不是發生在輸入項當中，就用錯誤對話盒來顯示
                } else {
                    messages.push(data['message'][key]);
                }
            })
            if (messages.length > 0) {
                warning(messages);
            }
        }
    }

    // if (isLoading) return <div className='text-MyWhite'>Loading</div>
    // else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">會員聯絡資訊</h2>
            </main>
            <form>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <Input
                        label="Email"
                        type="text"
                        name="email"
                        value={auth.email || ''}
                        id="email"
                        placeholder="david@gmail.com"
                        isRequired={true}
                        errorMsg={errorMsgs.email}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SelectCity
                        citys={citys}
                        value={auth.city_id || 0}
                        errorMsg={errorMsgs.city_id}
                        onChange={onChange}
                        onClear={handleClear}
                        isRequired={true}
                    />
                    <SelectArea
                        areas={cityAreas}
                        value={auth.area_id || 0}
                        errorMsg={errorMsgs.area_id}
                        onChange={onChange}
                        onClear={handleClear}
                        isRequired={true}
                    />
                    <Input
                        label="路名、街道巷弄等"
                        type="text"
                        name="road"
                        value={auth.road || ''}
                        id="road"
                        placeholder="中正路50號6F"
                        errorMsg={errorMsgs.road}
                        onChange={onChange}
                        onClear={handleClear}
                        isRequired={true}
                    />
                    <Sex
                        defaultChecked={auth.sex}
                        setFormData={setAuth}
                        isRequired={true}
                        errorMsg={errorMsgs.sex}
                    />

                    <PrimaryButton type="button" onClick={onSubmit} className="w-full">送出</PrimaryButton>
                </div>
            </form>
        </div>
    )
    //}
};

export default ContactData;