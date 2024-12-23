import {useContext, useState} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton } from '../../../../component/MyButton'
import { getAllGatewayMethodAPI } from '../../../../context/pos/PosAction';
import Breadcrumb from '../../../../component/Breadcrumb'

function GatewayMethod() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: 'pos匯入付款方式', href: '/admin/pos1/gatewayMethod', current: true },
    ]

    const [isShow, setIsShow] = useState(false);
    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState({
        successCount: 0,
        existCount: 0,
    });
    const getData = async (accessToken) => {
        const data = await getAllGatewayMethodAPI(accessToken);
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
            setRows(data.data.data.successRows);
            setMeta({
                successCount: data.data.data.successCount,
                existCount: data.data.data.existCount,
            });
        }
        setIsLoading(false);
        setIsShow(true);
    }
    const importData = () => {
        setIsLoading(true);
        getData(auth.accessToken);
    };

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4 flex justify-center'>匯入pos付款方式</h2>
            <div>
                <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importData}>開始匯入</PrimaryButton>
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
                            orignCode
                        </th>
                        <th scope="col" className="px-6 py-3">
                            code
                        </th>
                        <th scope="col" className="px-6 py-3">
                            名稱
                        </th>
                        <th scope="col" className="px-6 py-3">
                            顯示名稱
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
                                {row.id}
                            </td>
                            <td className="px-6 py-4">
                                {row.orignCode}
                            </td>
                            <td className="px-6 py-4">
                                {row.code}
                            </td>
                            <td className="px-6 py-4">
                                {row.name}
                            </td>
                            <td className="px-6 py-4">
                                {row.showName}
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

export default GatewayMethod

