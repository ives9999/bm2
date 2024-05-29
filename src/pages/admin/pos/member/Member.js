import {useContext, useState} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton } from '../../../../component/MyButton'
import { getAllMemberAPI } from '../../../../context/pos/PosAction';
import { DateRange } from '../../../../component/form/DateSingle';
import { nowDate } from '../../../../functions/date';

export function Member() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

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

    const [rows, setRows] = useState([])

    const getData = async (accessToken) => {
        const data = await getAllMemberAPI(accessToken, date.startDate, date.endDate);
        //console.info(data);
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
            setRows(data.data.successRows);
        }
    }
    const importMember = () => {
        setIsLoading(true);
        getData(auth.accessToken);
        setIsLoading(false);
    };

    return (
        <div className='mx-12 mt-4'>
            <div>
                <DateRange label="選擇匯入日期" value={date} onChange={onDateChange} />
                <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importMember}>開始匯入</PrimaryButton>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
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
                                {row.name}<br/>{row.nickname}
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
