import {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getReadAPI } from '../../../context/order/OrderAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'
import { noSec } from '../../../functions/date'
import Divider from '../../../component/Divider'

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

    if (isLoading) { return <div className="text-MyWhite">loading</div>}
    else {
    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <main className="isolate px-1">
                    <Breadcrumb items={breadcrumbs}/>
                    <h2 className="text-Primary-300 text-center text-4xl font-bold mb-10">訂單</h2>
                    <div className="w-full bg-Menu border border-PrimaryBlock-800 px-2 lg:p-6 rounded-lg">
                        {rows.map(row =>
                            <div key={row.order_no} className='text-white'>
                                <div className='flex flex-row items-center justify-between bg-blockColor my-4 lg:p-4 lg:pl-4 text-MyWhite'>
                                    <div className='lg:mr-4 flex flex-row gap-4'>
                                        <div className=''>{noSec(row.created_at, true)}</div>
                                        <div className='flex flex-row items-center'>
                                            <span className='text-xs mr-2'>總額：NT$</span> 
                                            <span className='text-xl text-Warning-400'>{formattedWithSeparator(row.grand_total)}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-row items-center'>{row.order_no}</div>
                                </div>
                                <div className='mt-4'>
                                {row.items.map(item =>
                                    <div key={item.id} className='py-4 lg:p-4 text-white bg-blockColor'> 
                                        <div className='flex flex-row items-center gap-2 mb-4 pb-4'>
                                            <div className="w-[100px] xl:w-[200px] lg:mr-4">
                                                {item.product.images && item.product.images.length > 0
                                                    ? <img src={item.product.images[0].path} alt={item.product.name} />
                                                    : ''
                                                }
                                            </div>
                                            <div className="flex-grow">
                                                <div className='mb-2'>{item.product.name}</div>
                                                <div className='flex flex-row items-center justify-between'>
                                                    <div className=''>單價：$&nbsp;<span className='text-Warning-400'>{formattedWithSeparator(item.sell_price)}</span></div>
                                                    <div className='lg:mr-6'>x{item.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-end items-center mt-2'>
                                            <div className='flex items-center'>
                                                <span className='text-xs mr-2'>總額：NT$</span> 
                                                <span className='text-xl text-Warning-400'>{formattedWithSeparator(item.total_amount)}</span>
                                            </div>
                                        </div>
                                        <Divider text='分隔線' textColor='PrimaryBlock-400' textSize='lg:text-base text-xs' />
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )}
}
