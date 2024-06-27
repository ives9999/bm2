import {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getReadAPI } from '../../../context/order/OrderAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'
import { noSec } from '../../../functions/date'

export default function Order() {
    const {auth, setIsLoading, setAlertModal, isLoading} = useContext(BMContext);

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);

    // 那一列被選擇了
    // [1,2,3]其中數字是id,
    const [isCheck, setIsCheck] = useState([]);

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const startIdx = (page-1)*perpage + 1

    const {accessToken} = auth

    const navigate = useNavigate()


    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '訂單', href: '/member/order', current: true },
    ];

    const getData = async (accessToken) => {
        const data = await getReadAPI(accessToken, page, perpage);
        console.info(data);
        if (data.status === 200) {
            setRows(data.data.rows)

            var meta = data.data._meta
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            setMeta(meta)
        } else {
            var msgs1 = ""
            if (data.message.length > 0) {
                msgs1 = data.message;
            } else {
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
                }
            }
            if (msgs1.length > 0) {
                setAlertModal({
                    modalType: 'alert',
                    modalText: msgs1,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false,
                })
            }
        }
    }

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(true)
            getData(accessToken)
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, isLoading])

    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <main className="isolate px-1">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">訂單</h2>
                    <div className="w-full bg-Menu border border-PrimaryBlock-800 p-6 rounded-lg">
                        {rows.map(row =>
                            <div key={row.order_no} className='my-4 p-2 text-white bg-blockColor'>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex flex-row items-center'>
                                        <div>{row.order_no}</div>
                                        <div className='flex flex-col gap-2 ml-4'>
                                            <div className='flex flex-row items-center gap-2'><span className='text-xs'>NT$</span> <span className='text-xl text-Warning-400'>{formattedWithSeparator(row.grand_total)}</span></div>
                                        </div>
                                    </div>
                                    <div className='text-white ml-4'>{noSec(row.created_at, true)}</div>
                                </div>
                                <div className='mt-4'>
                                {row.items.map(item =>
                                    <div key={item.id} className='text-white mb-8'> 
                                        <div className='flex flex-row justify-between'>
                                            <div className="flex flex-row items-center gap-4">
                                                <div className="w-[50px] xl:w-[200px]">
                                                    {item.product.images && item.product.images.length > 0
                                                        ? <img src={item.product.images[0].path} alt={item.product.name} />
                                                        : ''
                                                    }
                                                </div>
                                                <div className=''>{item.product.name}</div>
                                            </div>
                                            <div className="flex flex-row items-center gap-4">
                                                <div className=''>{formattedWithSeparator(item.sell_price)}</div>
                                                <div className=''>x{item.quantity}</div>
                                                <div className=''>{formattedWithSeparator(item.total_amount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>
                                <hr />
                                <div className='flex flex-row justify-end items-center mt-2'>
                                    <span className='text-xs mr-2'>NT$</span> 
                                    <span className='text-xl text-Warning-400'>{formattedWithSeparator(row.grand_total)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
