import { useContext, useReducer, useState, useEffect } from "react";
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../component/Breadcrumb'
import Input from "../../../component/form/Input";
import {DateSingle} from "../../../component/form/DateSingle";
import SelectCity from "../../../component/form/SelectCity";
import SelectArea from "../../../component/form/SelectArea";
import Sex from "../../../component/form/Sex";
import UseHr from "../../../component/UseHr";
import {PrimaryButton} from '../../../component/MyButton';
import {citys, areas} from "../../../zone.js"
import { moreDataAPI } from "../../../context/member/MemberAction";

function MoreData() {
    const {auth, setAuth, setIsLoading, setAlertModal} = useContext(BMContext);
    //const [formData, setFormData] = useState(auth);
    //const [isPass, setIsPass] = useState(false);

    // const {tel, dob, sex, city_id, area_id, road, fb, line, token} = formData
    // 由於calendar的元件，在設定時需要startDate與endDate的字串，所以另外用一個useState來處理
    const [dob1, setDob1] = useState({startDate: auth.dob, endDate: auth.dob,})

    var selectedAreas = [{city: 0, id: 0, name: "無"}]
    const [cityAreas, setCityAreas] = useState(selectedAreas)


    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '會員更多資訊', href: '/member/moreData', current: true },
    ]

    useEffect(() => {
        // 當縣市id有改變時，要產生該縣市的區域
        if (auth.city_id > 0 && auth.area_id > 0) {
            setAreaFromCity(auth.city_id)
        }

        // 當從資料庫取得生日時，透過此設定才能顯示在頁面上
        setDob1({startDate: auth.dob, endDate: auth.dob})
        //setFormData(auth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth])

    // 目前錯誤處理都還沒有使用到，只在送出資料後，錯誤會跳出錯誤對話盒
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
        // 如果是生日改變
        if ('startDate' in e) {
            //memberDispatch({type: 'UPDATE', payload: {dob: e.startDate}})
            setAuth((prev) => ({...prev, ...{dob: e.startDate}}));
            setDob1({startDate: e.startDate, endDate: e.endDate})
        } else {
            // 如果是變更縣市，則區域選擇改為"無“
            if (e.target.id === 'city_id') {
                setAreaFromCity(parseInt(e.target.value))
            // 如果是性別改變
            } else if (e.target.id === 'sex_M' || e.target.id === 'sex_F') {
                e.target.id = "sex"
            }
            //memberDispatch({type: 'UPDATE', payload: {[e.target.id]: e.target.value}})
            // console.info(e.target.id);
            // console.info(e.target.value);
            setAuth((prev) => {
                //console.info(prev);
                //const a = {...prev, [e.target.id]: e.target.value};
                //console.info(a);
                //return a;
                return {...prev, ...{[e.target.id]: e.target.value}};

                //return {...prev, [e.target.id]: e.target.value}
            });
            clearError(e.target.id)
        }
    }

    //當按下清除按鈕後，清除欄位值
    const handleClear = (id) => {
        //memberDispatch({type: 'UPDATE', payload: {[id]: ""}})
        setAuth((prev) => ({...prev, ...{[id]: ""}}));
		clearError(id)

        if (id === 'city_id') {
            //memberDispatch({type: 'UPDATE', payload: {area_id: ""}})
            setAuth((prev) => ({...prev, ...{area_id: ""}}));

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
        
	}

    const onSubmit = async (e) => {
        e.preventDefault();
        var params = {token: auth.token}

        if (auth.tel !== undefined && auth.tel !== null && auth.tel.trim().length > 0) {
            params["tel"] = auth.tel.trim()
        }

        if (auth.city_id !== undefined && auth.city_id !== null && auth.city_id !== 0) {
            params["city_id"] = auth.city_id
        }

        if (auth.area_id !== undefined && auth.area_id !== null && auth.area_id !== 0) {
            params["area_id"] = auth.area_id
        }

        if (auth.road !== undefined && auth.road !== null && auth.road.trim().length > 0) {
            params["road"] = auth.road.trim()
        }

        params["sex"] = auth.sex;
        
        if (auth.dob !== undefined && auth.dob !== null) {
            params["dob"] = auth.dob
        }

        if (auth.line !== undefined && auth.line !== null && auth.line.trim().length > 0) {
            params["line"] = auth.line.trim()
        }

        if (auth.fb !== undefined && auth.fb !== null && auth.fb.trim().length > 0) {
            params["fb"] = auth.fb.trim()
        }

        //console.info(params)
        setIsLoading(true)
        const data = await moreDataAPI(auth.accessToken, params);
        //console.info(data);
        setIsLoading(false)
        callback(data)
    }

    const callback = (data) => {
        // 更新資料成功
        if (data["status"] >= 200 && data["status"] < 300) {
            var obj = {
                modalType: 'success',
                modalTitle: '成功',
                modalText: "完成修改",
                isModalShow: true,
                isShowCancelButton: true,
            }
            setAlertModal(obj);
            //setFormData(data.data);
        // 更新資料失敗
        } else {
            for (let i = 0; i < data["message"].length; i++) {
                const id = data["message"][i].id
                dispatch({type: id})
            }

            //接收伺服器回傳的錯誤
            //目前伺服器的錯誤有3種
            //1.新增或修改資料庫時發生錯誤
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs1 += msg + "\n"
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'alert',
                    modalTitle: '失敗',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowCancelButton: true,
                })
            }
        }
    }

    // if (!isPass) return <h1 className='text-MyWhite'>Loading...</h1>;
    // else 
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs} />
            <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">會員更多資訊</h2>
            </main>

            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <Input 
                        label="市內電話"
                        type="tel"
                        name="tel"
                        value={auth.tel || ''}
                        id="tel"
                        placeholder="0233445566"
                        errorMsg={errorObj.telError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SelectCity
                        citys={citys}
                        value={auth.city_id || 0}
                        errorMsg={errorObj.cityError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SelectArea
                        areas={cityAreas}
                        value={auth.area_id || 0}
                        errorMsg={errorObj.areaError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Input 
                        label="路名、街道巷弄等"
                        type="text"
                        name="road"
                        value={auth.road || ''}
                        id="road"
                        placeholder="中正路50號6F"
                        errorMsg={errorObj.roadError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <UseHr />
                    <Sex
                        defaultChecked={auth.sex}
                        setFormData={setAuth}
                    />
                    <DateSingle
                        label="生日"
                        name="dob"
                        value={dob1}
                        id="dob"
                        minDate={new Date('1940-01-01')}
                        maxDate={new Date()}
                        onChange={onChange}
                    />
                    <UseHr />
                    <Input 
                        label="line"
                        type="text"
                        name="line"
                        value={auth.line || ''}
                        id="line"
                        placeholder="sportpassword"
                        onChange={onChange}
                        onClear={handleClear}
                    />

                    <Input 
                        label="FB"
                        type="text"
                        name="fb"
                        value={auth.fb || ''}
                        id="fb"
                        placeholder="https://www.facebook.com/100064670472280/"
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <PrimaryButton type="submit" className="w-full">送出</PrimaryButton>
                </div>
            </form>
        </div>
    )
}

export default MoreData
