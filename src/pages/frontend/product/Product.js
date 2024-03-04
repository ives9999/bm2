import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import useQueryParams from '../../../hooks/useQueryParams';
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'
import {Link} from 'react-router-dom';
import {Pagination, getPageParams} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'
import { getReadAPI } from "../../../context/product/ProductAction";

const breadcrumbs = [
    { name: '商品', href: '/product', current: true },
]

function Product() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const startIdx = (page-1)*perpage + 1

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const data = await getReadAPI(page, perpage)
            if (data.status === 200) {
                setRows(data.data.rows)

                var meta = data.data._meta
                const pageParams = getPageParams(meta)
                meta = {...meta, ...pageParams}
                setMeta(meta)
            } else {
                var msgs1 = ""
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
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

        setIsLoading(true)
        getData()
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-12 p-4">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-10 xl:gap-x-8">
                            {rows.map((row) => (
                                <div key={row.id} className="rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950 p-4">
                                    <div className="group relative">
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                                            <Link to={"/product/show/" + row.token}>
                                            <img
                                                src={row.featured}
                                                alt={row.name}
                                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                            />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-4 justify-between">
                                    <div className="mb-6 flex flex-row justify-between">
                                        <div className=""><Link className="text-tagColor text-sm hover:text-focusBlue" to={"/arena/"}>分類</Link></div>
                                            <div className="">
                                                <div className="text-tagColor text-sm hover:text-focusBlue flex">
                                                    <UserIcon className="h-5 w-5 align-middle" aria-hidden="true" />
                                                    <div className="">{row.pv} 次</div>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight text-Primary-200 hover:text-Primary-300"><Link to={"/product/" + row.id}>{row.name}</Link></h3>
                                        <div className="mt-8 mb-6 flex flex-row justify-between">
                                            <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue flex flex-row">
                                                <div className="text-Warning-500">{
                                                (row.prices[0]) ? "NT$:"+row.prices[0].price_member : '洽詢'
                                                }</div>
                                                {/* <div className="-mt-2">
                                                    <Link to={"/member/" + row.member["token"]} className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["nickname"]}</Link>
                                                    <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["created_at"]}</div>
                                                </div> */}
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate('/produt/' + row.token);
                                                }}
                                            >
                                                更多...
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Product
