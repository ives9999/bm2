import {useContext, useState} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton, PrimaryOutlineButton } from '../../../../component/MyButton'
import { getAllProductAPI } from '../../../../context/pos/PosAction';
import { DateRange } from '../../../../component/form/DateSingle';
import { nowDate } from '../../../../functions/date';
import { getReadAPI } from '../../../../context/cat/CatAction';
import Radio from '../../../../component/form/Radio';
import Breadcrumb from '../../../../component/Breadcrumb';

export function Product() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: 'pos匯入商品', href: '/admin/pos1/product', current: true },
    ]

    const now = nowDate();//console.info(nowDate);
    // 要設定匯入時間的物件
    const [date, setDate] = useState({
        startDate: now,
        endDate: now,
    });

    const onDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDate(newValue); 
    }

    const [isShow, setIsShow] = useState(false);
    const [rows, setRows] = useState([]);
    const [cats, setCats] = useState([]);
    const [meta, setMeta] = useState({
        successCount: 0,
        existCount: 0,
    });

    const initYes = [
        {key: "yes", value: 1, text: "是", active: true}, 
        {key: "no", value: 0, text: "否", active: false}
    ];
    const [yes, setYes] = useState(initYes);

    const getData = async (accessToken, cat_id, startDate, endDate, isDate) => {
        const data = await getAllProductAPI(accessToken, cat_id, startDate, endDate, isDate);
        console.info(data);
        if (data.data.status === 200) {
            setRows(data.data.data.successRows);
            setMeta({
                successCount: data.data.data.successCount,
                existCount: data.data.data.existCount,
            });
        } else {
            var msgs1 = ""
            if (Array.isArray(data.data["message"])) {
                for (let i = 0; i < data.data["message"].length; i++) {
                    const msg = data.data["message"][i].message
                    msgs1 += msg + "\n"
                }
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                });    
            } else {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: "發生不明錯誤",
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                });
            }  
        }
        setIsLoading(false);
        setIsShow(true);
    }
    const importProduct = () => {
        setIsLoading(true);
        var cat_id = 0;
        if (cats.length > 0) {
            const cat = cats.filter(cat => cat.active === true);
            cat_id = cat[0].value;
        }
        const row = yes.filter(item => item.active === true)[0];
        getData(auth.accessToken, cat_id, date.startDate, date.endDate, (row.value === 1) ? true : false);
    };

    const getCats = async () => {
        setIsLoading(true);
        const data = await getReadAPI();
        console.info(data);
        renderCats(data.data.rows, 0);
        setIsLoading(false);
    }

    const renderCats = (items, id) => {
        setCats(() => {
            let all = []
            items.forEach((item) => {
                const active = (id === item.id) ? true : false
                const obj = {key: item.id, text: item.name, value: item.id, active: active}
                all.push(obj)
            });
            return all
        })
    }

    //renderRadio(initYes, "1", setYes);

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4 flex justify-center'>匯入pos商品</h2>
            <div className='mb-12'>
                <PrimaryOutlineButton type='button' onClick={getCats}>顯示分類</PrimaryOutlineButton>
                {cats.length === 0 ? <div className='text-BG-50 mr-12'></div>
                : <Radio
                    label=""
                    id="cat"
                    items={cats}
                    setChecked={setCats}
                />
                }
            </div>
            <div className='flex flex-row items-center gap-4'>
                <DateRange label="選擇匯入日期" value={date} onChange={onDateChange} />
                <Radio
                    label="是否要設定日期"
                    id="yes"
                    items={yes}
                    setChecked={setYes}
                />
            </div>
            <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importProduct}>開始匯入</PrimaryButton>

            <div className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-12 ${isShow ? 'block' : 'hidden'}`}>
                <p className="text-sm text-MyWhite">
                    共匯入 <span className="font-medium">{meta.successCount + meta.existCount}</span> 筆資料<br /><br />
                    新增至資料庫 <span className="font-medium">{meta.successCount}</span> 筆資料<br /><br />
                    已存在資料庫 <span className="font-medium">{meta.existCount}</span> 筆資料<br /><br />
                </p>
            </div>
            <div className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-12 ${isShow ? 'block' : 'hidden'}`}>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            名稱
                        </th>
                        <th scope="col" className="px-6 py-3">
                            手機
                        </th>
                        <th scope="col" className="px-6 py-3">
                            建立時間
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium">
                                {idx + 1}
                            </th>
                            <td className="px-6 py-4">
                                {row.customerUid}
                            </td>
                            <td className="px-6 py-4">
                                {row.name}
                            </td>
                            <td className="px-6 py-4">
                                {row.phone}
                            </td>
                            <td className="px-6 py-4">
                                {row.createdDate}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='100'>
                        {/* {meta && <Pagination setPage={setPage} meta={meta} />} */}
                        </td>
                    </tr>
                </tfoot>
            </table>
            </div>
        </div>
    )
}
