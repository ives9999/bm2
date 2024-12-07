import React, {useContext, useEffect, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import Breadcrumb from "../../../component/Breadcrumb";
import BMContext from "../../../context/BMContext";
import {useNavigate, useParams} from "react-router-dom";
import {getOneAPI, postUpdateAPI} from "../../../context/Supplier/SupplierAction";
import Input from "../../../component/form/Input";
import SelectCity from "../../../component/form/SelectCity";
import {areas, citys} from "../../../zone";
import SelectArea from "../../../component/form/SelectArea";
import {PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../../component/MyButton";
import {formattedWithSeparator} from "../../../functions/math";
import Tab from "../../../component/Tab";
import {Error2, getErrorMessage} from "../../../errors/Error2";
import Validate from "../../../functions/validate";
import {postOrderToNewebpayAPI} from "../../../context/order/OrderAction";
import {BlueModal} from "../../../component/Modal";
import Radio, {renderRadio} from "../../../component/form/Radio";

const initData = {
    name: '李寧',
    status: 'online',
};
const UpdateBuy = () => {
    const {auth, setAlertModal, setIsLoading, warning} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);

    const {token} = useParams();
    const isInsertRef = useRef(!token);
    const navigate = useNavigate();
    const [toggleModalShow, setToggleModalShow] = useState(false);

    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '進貨單', href: '/admin/buy', current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    const [formData, setFormData] = useState(initData);
    const [errorMsgs, setErrorMsgs] = useState({
        'name': '',
    });

    const [statuses, setStatuses] = useState([]);

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
    const onChange = (e) => {
        console.info()
        if (e.target.id === 'city_id') {
            setFormData((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
            setAreaFromCity(parseInt(e.target.value));
        } else {
            setFormData((prev) => ({
                ...prev, [e.target.id]: e.target.value
            }));
            setErrorMsgs((prev) => ({
                ...prev, [e.target.id]: ''
            }));
        }
    }

    const onClear = (id) => {
        const e = {target: {id: id, value: ''}};
        onChange(e);
    }

    const getOne = async (accessToken, token, scenario) => {
        let data = await getOneAPI(accessToken, token, scenario);
        console.info(data);
        if (data.status === 200) {
            data = data.data;
            renderRadio(data.statuses, data.status, setStatuses);
        }

        setBreadcrumbs((prev) => {
            return scenario === 'create' ? [...initBreadcrumb, { name: '新增進貨單', href: '/admin/buy/update', current: true }] : [...initBreadcrumb, { name: data.data.name, href: '/admin/buy/update', current: true }]
        })

        setIsGetComplete(true);
    }

    useEffect(() => {
        if (token !== undefined && token.length > 0) {
            getOne(auth.accessToken, token, 'update');
        } else {
            setFormData(initData);
            getOne(auth.accessToken,'', 'create');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async () => {
        const rules = [
            ['name', 'required', {message:getErrorMessage(4400)}],
        ];
        var validate = new Validate(formData, rules);
        const isPass = validate.validate();
        if (!isPass) {
            //console.info(validate.errors);
            validate.showErrors(setErrorMsgs);
        }
        if (isPass) {
            console.info(formData);
            var data = await postUpdateAPI(auth.accessToken, formData);
            console.info(data);
            if (data.status === 200) {
                setToggleModalShow(true);
            }
        }
    }

    const toAdd = () => {
        navigate('/admin/buy/update');
    }
    const toRead = () => {
        navigate('/admin/buy')
    }

    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className='p-4'>
                <main className="isolate">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{isInsertRef.current ? '新增供應商' : formData.name}</h2>
                </main>

                <form>
                    <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                        <div className="flex flex-col lg:flex-row items-center justify-end">
                            <PrimaryButton type="button" onClick={onSubmit} className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                        </div>
                        <div className={`mt-6 lg:mx-0 grid gap-4 sm:grid-cols-2`}>
                            <div className="">
                                <Input
                                    label="供應商名稱"
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    id="name"
                                    placeholder=""
                                    isRequired={true}
                                    errorMsg={errorMsgs.name}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="供應商電話"
                                    type="text"
                                    name="tel"
                                    value={formData.tel || ''}
                                    id="tel"
                                    placeholder="0939123456"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <SelectCity
                                    citys={citys}
                                    id="city_id"
                                    value={formData.city_id || 0}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <SelectArea
                                    areas={cityAreas}
                                    id="area_id"
                                    value={formData.area_id || 0}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <Input
                                    label="路名、街道巷弄等"
                                    type="text"
                                    name="road"
                                    value={formData.road || ''}
                                    id="road"
                                    placeholder="中正路50號6F"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="聯絡人姓名"
                                    type="text"
                                    name="contact_name"
                                    value={formData.contact_name || ''}
                                    id="contact_name"
                                    placeholder="王大明"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="聯絡人電話"
                                    type="text"
                                    name="contact_tel"
                                    value={formData.contact_tel || ''}
                                    id="contact_tel"
                                    placeholder="0911299994"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <Input
                                    label="聯絡人Email"
                                    type="text"
                                    name="contact_email"
                                    value={formData.contact_email || ''}
                                    id="contact_email"
                                    placeholder="david@gmail.com"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="匯款銀行"
                                    type="text"
                                    name="bank"
                                    value={formData.bank || ''}
                                    id="bank"
                                    placeholder="台灣銀行"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="分行"
                                    type="text"
                                    name="bank_branch"
                                    value={formData.bank_branch || ''}
                                    id="bank_branch"
                                    placeholder="台北分行"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="銀行代碼"
                                    type="text"
                                    name="bank_code"
                                    value={formData.bank_code || ''}
                                    id="bank_code"
                                    placeholder="100"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="銀行帳號"
                                    type="text"
                                    name="bank_account"
                                    value={formData.bank_account || ''}
                                    id="bank_account"
                                    placeholder="1234567"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="統編"
                                    type="text"
                                    name="tax"
                                    value={formData.tax || ''}
                                    id="tax"
                                    placeholder="53830194"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className=''>
                                <Input
                                    label="統編公司名稱"
                                    type="text"
                                    name="tax_name"
                                    value={formData.tax_name || ''}
                                    id="tax_name"
                                    placeholder="藍色行動有限公司"
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Radio
                                    label="狀態"
                                    id="status"
                                    items={statuses}
                                    setChecked={setStatuses}
                                    setStatus={setFormData}
                                />
                            </div>
                        </div>
                        <div
                            className='flex flex-row items-center justify-center my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                            <PrimaryButton type="button" className="lg:w-60 mr-4"
                                           onClick={onSubmit}>送出</PrimaryButton>
                        </div>
                    </div>
                </form>
                {toggleModalShow ?
                    <BlueModal isModalShow={toggleModalShow}>
                        <BlueModal.Header setIsModalShow={setToggleModalShow}>成功</BlueModal.Header>
                        <BlueModal.Body>成功{isInsertRef.current ? '加入' : '修改'}供應商</BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleModalShow(false)}>關閉</PrimaryButton>
                        {isInsertRef.current ?
                            <SecondaryButton onClick={toAdd}>繼續新增</SecondaryButton>
                            : ''}
                        <PrimaryOutlineButton onClick={toRead}>回到列表</PrimaryOutlineButton>
                    </BlueModal.Footer>
                </BlueModal>
                : ''}
            </div>
        );
    }
};

export default UpdateBuy;