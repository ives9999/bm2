import React, {useContext, useEffect, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import Breadcrumb from "../../../component/Breadcrumb";
import BMContext from "../../../context/BMContext";
import {useLocation, useNavigate, useParams} from "react-router-dom";
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
import {getOneAPI, postUpdateAPI} from "../../../context/Action";
import Address from "../../../component/form/Address";
import ProductContent from "../../../component/product/ProductContent";
import Dropzone from "../../../component/form/Dropzone/Dropzone";
import {sortOrder} from "../../../functions/date";
import {arrayMove} from "@dnd-kit/sortable";
import {toast} from "react-toastify";
import {INSERTFAIL} from "../../../errors/Error";

const able = 'match';
const initData = {
    name: '測試盃',
    contact_name: '丁小雨',
    contact_tel: '0923343999',
    contact_email: 'rain@gmail.com',
    contact_line: 'line9999',
    bank_name: '台灣銀行',
    bank_branch: '台北分行',
    bank_code: 700,
    bank_account: 1234567,
    status: 'online',
};
const UpdateMatch = () => {
    const {auth, setAlertModal, setIsLoading, warning} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);

    const {token} = useParams();
    const isInsertRef = useRef(!token);
    const navigate = useNavigate();
    const [toggleModalShow, setToggleModalShow] = useState(false);

    const location = useLocation();
    let baseUrl = location.pathname;// /admin/order
    let initParams = {
        backend: true,
    };
    const [params, setParams] = useState(initParams);

    const [tabs, setTabs] = useState([
        {key: 'data', name: '基本資訊', to: 'data', active: true},
        {key: 'contact', name: '聯絡資訊', to: 'contact', active: false},
        {key: 'detail', name: '詳細介紹', to: 'detail', active: false},
        {key: 'image', name: '圖、影片設定', to: 'image', active: false},
        {key: 'bank', name: '匯款資訊', to: 'similar', active: false},
    ]);

    const initBreadcrumb = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '報名', href: `/admin/${able}`, current: false },
    ]
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    const [formData, setFormData] = useState(initData);
    const [errorMsgs, setErrorMsgs] = useState({
        'name': '',
        'contact_name': '',
        'contact_tel': '',
        'contact_email': '',
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

    const [files, setFiles] = useState([]);

    // 球隊上傳圖片管理陣列，是一個單純物件的陣列
    // [{
    //      name: "2015-08-13 23.24.26-1 _Recovered_-01.png"
    //      upload_id: 4053，資料庫圖片的編號，如果是本地端選擇則為0
    //      sort_order: 174356，數字越大排序越前面，資料庫圖片則為資料庫中的數字，
    //                          如果是本地端選擇則為由本地端產生，當使用者拖曳改變位置排序時，必須更新此數值，已更新排序
    //      isFeatured: true表示是代表圖，false表示不是
    //      status: online表示正常圖片，create表示新建的圖片，delete表示刪除的圖片
    // }]
    const [allImages, setAllImages] = useState([])

    // 新增圖片
    const addFiles = (acceptedFiles) => {
        setFiles((prev) => {
            var count = prev.length
            const temp = acceptedFiles.map(file => {
                // 圖片加入索引值
                file.id = count + 1
                file.upload_id = 0
                file.isAdd = true
                count++
                return file
            });
            return [...prev, ...temp]
        })

        // files 是針對本地端上傳圖片更改介面的物件陣列，並用該陣列的資料來傳送上傳的圖片檔案
        // 後端根據files的資料來做檔案處理
        // allImages 是針對圖片所有的操作，例如新增、刪除、更換位置與設定代表圖等資訊的陣列
        // 後端根據allImages的資料來做更新與刪除
        setAllImages((prev) => {
            var sort_order = sortOrder();
            prev.map(item => (sort_order = item.sort_order))
            sort_order -= 100
            const temp = acceptedFiles.map(file => {
                const oneImage = {
                    name: file.name,
                    upload_id: 0,
                    sort_order: sort_order,
                    isFeatured: false,
                    status: "create",
                }
                sort_order -= 100
                return oneImage
            })
            return [...prev, ...temp]
        })
    }

    // 刪除圖片
    const deleteFiles = (name) => {
        setFiles((prev) => {
            return prev.filter(item => item.name !== name)
        })

        setAllImages((prev) => {
            const item = prev.find(item => item.name === name);
            if (item.status === "create") {
                // 表示是剛新增，直接刪除該設定
                const temp = prev.filter((item) => item.name !== name);
                return temp;
            } else {
                const temp = prev.map(item => {
                    if (item.name === name) {
                        item.status = "delete"
                    }
                    return item
                })
                return temp
            }
        })
    }

    // 設定代表圖
    const setFeatured = (e) => {
        setFiles((prev) => {
            return prev.map(file => {
                if (file.name === e.target.id) {
                    file.isFeatured = !file.isFeatured
                }
                return file
            })
        })

        setAllImages((prev) => {
            return prev.map(file => {
                if (file.name === e.target.id) {
                    file.isFeatured = !file.isFeatured
                }
                return file
            })
        })
    }

    // 拖曳排序圖片位置
    const onDragDrop = (active, over) => {
        var oldIndex = 0
        var newIndex = 0
        setFiles((prev) => {
            // 被拖曳的那一個
            oldIndex = prev.findIndex(item => item.id === active.id)
            // 放開的那一個
            newIndex = prev.findIndex(item => item.id === over.id)

            return arrayMove(prev, oldIndex, newIndex);
        });

        setAllImages((prev) => {
            const oldSortOrder = prev[oldIndex].sort_order
            const newSortOrder = prev[newIndex].sort_order
            prev[oldIndex].sort_order = newSortOrder
            prev[newIndex].sort_order = oldSortOrder
            return arrayMove(prev, oldIndex, newIndex)
        })
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

    const getOne = async (token, accessToken, scenario) => {
        let data = await getOneAPI(able, token, accessToken, scenario);
        console.info(data);
        if (data.status === 200) {
            data = data.data;

            // status
            renderRadio(data.statuses, data.status, setStatuses);
            setFormData(prev => {
                return {...prev, ...data}
            });

            // contact
            setFormData(prev => {
                return {...prev, ...data.contact}
            })

            // bank
            setFormData(prev => {
                return {...prev, ...data.bank}
            })

            // images
            setFiles([]);
            setAllImages([]);
            //console.info(data.images)
            if (data.images !== undefined && data.images !== null && data.images.length > 0) {
                setFiles((prev) => {
                    var count = prev.length
                    const temp = data.images.map(image => {
                        var file = {}
                        file.name = image.path
                        // 圖片加入索引值
                        file.id = count + 1
                        file.upload_id = image.upload_id
                        file.isFeatured = image.isFeatured
                        file.isAdd = false

                        count++

                        return file
                    })
                    //console.info(temp)
                    return [...prev, ...temp]
                })

                setAllImages((prev) => {
                    const temp = data.images.map(image => {
                        const oneImage = {
                            name: image.path,
                            upload_id: image.upload_id,
                            sort_order: image.sort_order,
                            isFeatured: image.isFeatured,
                            status: "online",
                        }
                        return oneImage
                    })
                    return [...prev, ...temp]
                })
            }
        }

        setBreadcrumbs((prev) => {
            return scenario === 'create' ? [...initBreadcrumb, { name: '新增報名', href: `${baseUrl}/update`, current: true }] : [...initBreadcrumb, { name: data.name, href: `${baseUrl}/update`, current: true }]
        })

        setIsGetComplete(true);
    }

    useEffect(() => {
        console.info('aaa');
        if (token !== undefined && token.length > 0) {
            getOne(token, auth.accessToken, 'update');
        } else {
            setFormData(initData);
            getOne('', auth.accessToken, 'create');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async () => {
        const rules = [
            ['name', 'required', {message:getErrorMessage(5000)}],
            ['contact_name', 'required', {message:getErrorMessage(5001)}],
            ['contact_tel', 'required', {message:getErrorMessage(5002)}],
            ['contact_Email', 'required', {message:getErrorMessage(5003)}],
        ];
        var validate = new Validate(formData, rules);
        //const isPass = true;
        const isPass = validate.validate();
        //console.info(isPass);
        if (!isPass) {
            //console.info(validate.errors);
            validate.showErrors(setErrorMsgs);
            const msgs = validate.joinErrors();
            console.info(msgs);
            toast.error(
                <ul>
                    {msgs.map(msg => (<li>{msg}</li>))}
                </ul>
            );
            return;
        }
        if (isPass) {
            //console.info(formData);
            const postFormData = new FormData();
            console.info(postFormData);
            Object.keys(formData).map(key => {
                if (key !== 'images') {
                    let value = formData[key]
                    value = (value === null) ? '' : value
                    postFormData.append(key, value)
                }
                return key
            });
            postFormData.delete('statuses');

            // 設定圖片
            files.map((file) => {
                if (file.upload_id === 0) {
                    postFormData.append("images[]", file)
                }
                return file
            })
            postFormData.set("allImages", JSON.stringify(allImages));
            setIsLoading(true)
            if (token !== undefined && token !== null && token.length > 0) {
                postFormData.append("token", token)
            }
            var data = await postUpdateAPI(able, postFormData, auth.accessToken);
            setIsLoading(false);
            console.info(data);
            if (data.status === 200) {
                setToggleModalShow(true);
            } else {
                let msgs = [];
                for (let i = 0; i < data["message"].length; i++) {
                    const item = data["message"][i].item;
                    //const error = data["message"][i].error;
                    const code = data["message"][i].code;
                    const msg = data["message"][i].message;
                    msgs.push(msg);
                    //1.新增或修改資料庫時發生錯誤
                    if (code === INSERTFAIL) {
                        setAlertModal({
                            modalType: 'warning',
                            modalTitle: '警告',
                            modalText: msg,
                            isModalShow: true,
                            isShowCancelButton: true,
                        })
                    } else {
                        setErrorMsgs(prev => (
                            {...prev, [item]: msg}
                        ));
                    }
                }
                //console.info(msgs);
                toast.error(
                    <ul>
                        {msgs.map(msg => (<li>{msg}</li>))}
                    </ul>
                );
            }
        }
    }

    const toAdd = () => {
        setToggleModalShow(false);
        navigate(baseUrl);
    }
    const toRead = () => {
        setToggleModalShow(false);
        navigate(`/admin/${able}`);
    }

    const onTab = (idx) => {
        setTabs((prev) => {
            let res = prev.map((item, idx1) => {
                (idx === idx1) ? item.active = true : item.active = false
                return item
            })
            return res
        })
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
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">{isInsertRef.current ? '新增報名' : formData.name}</h2>
                </main>

                <form>
                    <div className="mx-4 bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            <Tab items={tabs} to={onTab}/>
                            <PrimaryButton type="button" onClick={onSubmit}
                                           className="w-full lg:w-60 mt-6">送出</PrimaryButton>
                        </div>
                        <div
                            className={`mt-6 lg:mx-0 grid gap-4 sm:grid-cols-2 ${tabs[0].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                            <div className='sm:col-span-2'>
                                <Input
                                    label="報名名稱"
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
                        <div className={`mt-6 lg:mx-0 ${tabs[1].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                            <div className="col-span-1 mt-4">
                                <Input
                                    label="聯絡人姓名"
                                    type="text"
                                    name="contact_name"
                                    value={formData.contact_name || ''}
                                    id="contact_name"
                                    placeholder=""
                                    isRequired={true}
                                    errorMsg={errorMsgs.contact_name}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="col-span-1 mt-4">
                                <Input
                                    label="聯絡人電話"
                                    type="text"
                                    name="contact_tel"
                                    value={formData.contact_tel || ''}
                                    id="contact_tel"
                                    placeholder=""
                                    isRequired={true}
                                    errorMsg={errorMsgs.contact_tel}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="col-span-2 mt-4">
                                <Input
                                    label="聯絡人Email"
                                    type="text"
                                    name="contact_email"
                                    value={formData.contact_email || ''}
                                    id="contact_email"
                                    placeholder=""
                                    isRequired={true}
                                    errorMsg={errorMsgs.contact_email}
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                            <div className="col-span-1 mt-4">
                                <Input
                                    label="聯絡人Line"
                                    type="text"
                                    name="contact_line"
                                    value={formData.contact_line || ''}
                                    id="contact_line"
                                    placeholder=""
                                    onChange={onChange}
                                    onClear={onClear}
                                />
                            </div>
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[2].active ? '' : 'hidden'}`}>
                            <ProductContent
                                formData={formData}
                                //onEditorChange={onEditorChange}
                                setFormData={setFormData}
                            />
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[3].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                            <div className="sm:col-span-2">
                                <Dropzone
                                    label="上傳圖片或影片"
                                    files={files}
                                    addFiles={addFiles}
                                    deleteFiles={deleteFiles}
                                    setFeatured={setFeatured}
                                    onDragDrop={onDragDrop}
                                    name="images"
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className={`mt-6 lg:mx-0 ${tabs[4].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                            <div className=''>
                                <Input
                                    label="匯款銀行"
                                    type="text"
                                    name="bank_name"
                                    value={formData.bank_name || ''}
                                    id="bank_name"
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
                        <BlueModal.Body>成功{isInsertRef.current ? '加入' : '修改'}賽事</BlueModal.Body>
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

export default UpdateMatch;