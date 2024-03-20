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
import { BiSolidCategory } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

const breadcrumbs = [
    { name: '商品', href: '/product', current: true },
]

function Product() {
    const {setIsLoading, setAlertModal} = useContext(BMContext);
    const [data, setData] = useState({});
    // const [rows, setRows] = useState([]);
    // const [meta, setMeta] = useState(null);

    var { page, perpage, cat } = useQueryParams()
    //console.info(cat);
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    //const startIdx = (page-1)*perpage + 1

    const navigate = useNavigate()

    const getList = async (page, perpage) => {
        let params = [];
        if (cat) {
            params.push({cat: cat});
        }
        const data = await getReadAPI(page, perpage, params);
        if (data.status === 200) {
            setData(data.data)

            // var meta = data.data._meta
            // const pageParams = getPageParams(meta)
            // meta = {...meta, ...pageParams}
            // setMeta(meta)
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

    useEffect(() => {
        setIsLoading(true)
        getList(page, perpage)
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, cat]);

    if (Object.keys(data).length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="flex flex-col lg:flex-row relative z-20 justify-between px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                    <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <div className="flex flex-col">
                            <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                                {data.rows.map((row) => (
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
                            <div className="mt-4">
                                {data.meta && <Pagination meta={data.meta} />}
                            </div>
                        </div>
                    </article>
                    <aside className="xl:block" aria-labelledby="sidebar-label">
                        <div className="xl:w-[336px] sticky top-6">
                            <h3 id="sidebar-label" className="sr-only">側邊欄</h3>
                            <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <IoIosSearch className="w-6 h-6 text-white-50" />
                                </div>
                                <input type="search" id="search" className="w-full p-4 ps-10 order text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-MyWhite focus:border-Primary-300 autofill:transition-colors autofill:duration-[5000000ms]" placeholder="關鍵字" required />
                                <button type="button" className="text-white absolute end-2.5 bottom-2.5 border border-Primary-300 text-Primary-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-Primary-950 hover:bg-Primary-800 focus:ring-Primary-800">搜尋...</button>
                            </div>

                            <div className="p-4 my-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="mb-4 text-2xl font-bold text-white-50 uppercase">分類</h4>
                                <ul className=''>
                                    {data.cats.map((cat) => (
                                        <li key={cat.name} className='mb-2 flex items-center'>
                                            <BiSolidCategory className='h-4 w-4 text-Primary-400 mr-4' />
                                            <Link to={'/product?cat='+cat.token} className='text-white-400 hover:text-white-300'>{cat.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
    }
}

export default Product
