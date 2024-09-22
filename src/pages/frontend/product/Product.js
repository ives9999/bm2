import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import useQueryParams from '../../../hooks/useQueryParams';
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'
import {Link} from 'react-router-dom';
import {Pagination} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'
import { getReadAPI } from "../../../context/product/ProductAction";
import ProductCats from "../../../component/product/ProductCats";
import ProductSearch from "../../../component/product/ProductSearch";
import {FaShoppingCart} from "react-icons/fa";
import {toLogin} from "../../../context/to";
import AddCart from "../../../api/AddCart";
import {BlueModal} from "../../../component/Modal";
import {PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../../component/MyButton";


function Product() {
    const {auth, setIsLoading, setAlertModal, warning} = useContext(BMContext);
    const [data, setData] = useState({});
    const [meta, setMeta] = useState({});
    const [cats, setCats] = useState([]);
    const [toggleModalShow, setToggleModalShow] = useState(false);

    var { page, perpage, cat, k } = useQueryParams()
    //console.info(cat);
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    const initBreadcrumb = [
        { name: '商品', href: '/product', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    const navigate = useNavigate()

    k = (k === undefined) ? '' : k;
    const [keyword, setKeyword] = useState(k);
    const keywordFilter = (e, keyword) => {
        e.preventDefault();
        setKeyword(keyword);
    }

    const getData = async (page, perpage, params) => {
        const data = await getReadAPI(page, perpage, params);
        // data.data.rows.forEach((row) => {
        //     console.info("cat length:"+row.cat.length);
        //     console.info("cat token:"+row.cat[0].token);
        // })
        if (data.status === 200) {
            //console.info(data.data.cats);
            setData(data.data.rows);
            setMeta(data.data._meta);
            setCats(data.cats.rows);
            // const pageParams = getPageParams(meta);
            const activeCat = data.cats.rows.find(row => row.active);
            //console.info(activeCat);
            setBreadcrumbs(prev => {
                return [...initBreadcrumb, {name: activeCat.name, href: '/product?cat='+activeCat.token, current: false}];
            })
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
        let params = [];
        if (cat) {
            params.push({cat_token: cat});
        }
        if (keyword.length > 0) {
            params.push({k: keyword});
        }
        getData(_page, perpage, params)
        setStartIdx((_page - 1) * perpage + 1);
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, cat, keyword]);

    const addCart = async (token) => {
        //console.info(token);
        if ('id' in auth && auth.id > 0) {
            //console.info(auth);
            setIsLoading(true);
            const res = await AddCart(auth.accessToken, token);
            if (typeof res === 'object') {
                setToggleModalShow((prev)=>(!prev));
            } else if (typeof res === 'string') {
                warning(res);
            }
            setIsLoading(false);
        } else {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "請先登入",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: toLogin
            });
        }
    }

    const goCart = () => {
        navigate('/member/cart');
    }

    const goCheckout = () => {
        navigate('/member/checkout');
    }


    if (Object.keys(data).length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            <div className="flex flex-col lg:flex-row relative z-20 justify-between lg:px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                <article className="flex flex-col lg:flex-row relative z-20 justify-between lg:px-4 lg:mx-auto max-w-screen-xl bg-gray-900 rounded">
                    <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <div className="mt-6 flex flex-col justify-between mb-4 lg:p-4 lg:mb-0 mx-1.5">
                            <ProductSearch able="product" filter={keywordFilter} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col xl:flex-row flex-wrap justify-between lg:p-4 mx-1.5">
                                {data.map((row, idx) => (
                                    <div key={row.id} className="w-full mb-4 xl:w-[49%] rounded-lg border shadow-sm border-gray-700 bg-PrimaryBlock-950 p-4">
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
                                                <div className="">
                                                    {(row.cat.length > 0) ?
                                                    <Link className="text-tagColor text-sm hover:text-focusBlue" to={"/product?cat="+row.cat[0].token}>{row.cat[0].text}</Link>
                                                    : ''}
                                                </div>
                                                <div className="">
                                                    <div className="text-tagColor text-sm hover:text-focusBlue flex">
                                                        <UserIcon className="h-5 w-5 align-middle" aria-hidden="true" />
                                                        <div className="">{row.pv} 次</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold tracking-tight text-Primary-200 hover:text-Primary-300"><Link to={"/product/show/" + row.token}>{(startIdx + idx) + '. ' + row.name}</Link></h3>
                                            <div className="mt-8 mb-6 flex flex-row justify-between">
                                                <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue flex flex-row items-center gap-2">
                                                    <div className="text-Warning-500">{
                                                        (row.prices[0]) ? "NT$:"+formattedWithSeparator(row.prices[0].sellPrice) : '洽詢'
                                                    }</div>
                                                    <div className="">
                                                        <FaShoppingCart className='w-5 h-5 text-MyWhite cursor-pointer' onClick={() => addCart(row.token)} />
                                                    </div>
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
                            <div className="mt-4 lg:p-4 mx-1.5">
                                {data._meta && <Pagination setPage={setPage} meta={data._meta} />}
                            </div>
                        </div>
                    </article>
                    <aside className="xl:block" aria-labelledby="sidebar-label">
                        <div className="xl:w-[336px] sticky top-6">
                            <h3 id="sidebar-label" className="sr-only">側邊欄</h3>
                            <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <ProductCats able="product" cats={cats} perpage={perpage} />
                        </div>
                    </aside>
                </article>
            </div>
            {toggleModalShow ?
                <BlueModal isModalShow={toggleModalShow}>
                    <BlueModal.Header setIsModalShow={setToggleModalShow}>購物車</BlueModal.Header>
                    <BlueModal.Body>成功加入購物車</BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleModalShow(false)}>關閉</PrimaryButton>
                        <SecondaryButton onClick={goCart}>前往購物車</SecondaryButton>
                        <PrimaryOutlineButton onClick={goCheckout}>結帳</PrimaryOutlineButton>
                    </BlueModal.Footer>
                </BlueModal>
                : ''}

        </div>
    )
    }
}

export default Product
