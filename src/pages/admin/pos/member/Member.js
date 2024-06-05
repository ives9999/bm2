import {useContext, useState} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton } from '../../../../component/MyButton'
import { getAllMemberAPI } from '../../../../context/pos/PosAction';
import { DateRange } from '../../../../component/form/DateSingle';
import { nowDate } from '../../../../functions/date';
import Breadcrumb from '../../../../layout/Breadcrumb';
import Radio from '../../../../component/form/Radio';

export function Member() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: 'pos匯入會員', href: '/admin/pos/member', current: true },
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
    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState({
        successCount: 0,
        existCount: 0,
    });
    const [isInsertPosID, setIsInsertPosID] = useState([
        {key: 'yes', text: '是', value: true, active: false},
        {key: 'no', text: '否', value: false, active: true},
    ]);

    const getData = async (accessToken) => {
        var _isInsertPosID = false;
        const temp = isInsertPosID.filter(item => item.active === true);
        if (Array.isArray(temp) && temp.length) {
            _isInsertPosID = temp[0].value;
        }
        const data = await getAllMemberAPI(accessToken, date.startDate, date.endDate, _isInsertPosID);
        console.info(data);
        if (data.data.status !== 200) {
            var msgs1 = ""
            for (let i = 0; i < data.data["message"].length; i++) {
                const msg = data.data["message"][i].message
                msgs1 += msg + "\n"
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
            }
        } else {
            setRows(data.data.data.successRows);
            setMeta({
                successCount: data.data.data.successCount,
                existCount: data.data.data.existCount,
            });
        }
        setIsLoading(false);
        setIsShow(true);
    }
    const importMember = () => {
        setIsLoading(true);
        getData(auth.accessToken);
    };

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4 flex justify-center'>匯入pos會員</h2>
            <div>
                <DateRange label="選擇匯入日期" value={date} onChange={onDateChange} />
                <div className='mb-12 flex flex-row items-center'>
                    <h3 className='text-MyWhite text-base font-medium mr-6'>是不是要新增pos ID</h3>
                    <div>
                        <Radio
                            label=""
                            id="cat"
                            items={isInsertPosID}
                            setChecked={setIsInsertPosID}
                        />
                    </div>
                </div>
                <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importMember}>開始匯入</PrimaryButton>
            </div>

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
