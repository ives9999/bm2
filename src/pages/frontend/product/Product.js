import {React, useState, useEffect, useContext, useRef} from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import useQueryParams from '../../../hooks/useQueryParams';
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../component/Breadcrumb'
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
import ProductFilter, {FilterResultHtml} from "../../../component/ProductFilter";
import {ProductHomeGrid} from "../../../component/Grid";
import {ImSpinner6} from "react-icons/im";
import {addCart} from "../../../functions/addCart";


function Product() {
    const {auth, setIsLoading, setAlertModal, warning, isLoading} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);
    const [products, setProducts] = useState({rows: [], meta: {}});
    // const [rows, setRows] = useState([]);
    // const [meta, setMeta] = useState({});
    const [isCatsOpen, setIsCatsOpen] = useState([]);
    const [cats, setCats] = useState([]);

    const [toggleModalShow, setToggleModalShow] = useState(false);


    const navigate = useNavigate();
    const location = useLocation();
    let {page, perpage, cat, cat_name} = useQueryParams();
    //console.info(cat);
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState(1);

    const initBreadcrumb = [
        { name: '商品', href: '/product', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    const [filters, setFilters] = useState({rows: [], meta: {}});
    const toNextFn = useRef();

    const getFilterResult = (rows, meta, fn) => {
        setFilters(prev => {
            return {
                rows: (meta.currentPage > 1) ? [...prev.rows, ...rows] : rows,
                meta: meta,
            }
        })
        toNextFn.current = fn;
    }

    const toNext = () => {
        if (toNextFn.current) {
            toNextFn.current();
        } else {
            setPage(prev => prev + 1);
        }
    }

    const getData = async (page, perpage, params) => {
        const data = await getReadAPI(page, perpage, params);
        console.info(data);
        // data.data.rows.forEach((row) => {
        //     console.info("cat length:"+row.cat.length);
        //     console.info("cat token:"+row.cat[0].token);
        // })
        if (data.status === 200) {
            //console.info(data.cats);
            setProducts(prev => {
                return {
                    rows: [...prev.rows, ...data.data.rows],
                    meta: data.data.meta,
                }
            })
            // setRows(data.data.rows);
            // setMeta(data.data.meta);
            setCats(data.cats.rows);
            // const pageParams = getPageParams(meta);
            const activeCat = data.cats.rows.find(row => row.active);
            //console.info(activeCat);
            if (activeCat) {
                if (activeCat.children.length > 0) {
                    const activeChildren = activeCat.children.find(row => row.active);
                    const tails = [{
                        name: activeCat.name,
                        href: '/product?cat=' + activeCat.token,
                        current: false
                    }];
                    if (activeChildren) {
                        tails.push({
                            name: activeChildren.name,
                            href: '/product?cat=' + activeChildren.token,
                            current: true
                        });
                    }
                    setBreadcrumbs(prev => {
                        return [...initBreadcrumb, ...tails];
                    });
                } else {
                    setBreadcrumbs(prev => {
                        return [...initBreadcrumb, {
                            name: activeCat.name,
                            href: '/product?cat=' + activeCat.token,
                            current: false
                        }];
                    });
                }
            } else {
                setBreadcrumbs(initBreadcrumb);
            }

            setIsCatsOpen(() => {
                return data.cats.rows.map(cat => false);
            })
        } else {
            var msgs1 = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].msg
                msgs1 += msg + "\n"
            }
            if (msgs1.length > 0) {
                warning(msgs1);
                // setAlertModal({
                //     modalType: 'alert',
                //     modalText: msgs1,
                //     isModalShow: true,
                //     isShowOKButton: true,
                //     isShowCancelButton: false,
                // })
            }
        }
        setIsGetComplete(true);
    }

    useEffect(() => {
        const q = location.search;
        //console.info(q);
        if (q.indexOf('k') === -1) {
            setFilters({rows:[], meta: {}});
            setIsLoading(true)
            let params = [];
            if (cat) {
                setProducts({rows: [], meta: {}});
                params = {...params, cat_token: cat};
            }
            if (cat_name) {
                setProducts({rows: [], meta: {}});
                params = {...params, cat_name: cat_name};
            }
            getData(_page, perpage, params);
            //setStartIdx((_page - 1) * perpage + 1);
            setIsLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, cat, cat_name, location.search]);

    const _addCart = (token) => {
        addCart(auth, setIsLoading, token, setToggleModalShow, warning, setAlertModal);
    }

    const goCart = () => {
        navigate('/member/cart');
    }

    const goCheckout = () => {
        navigate('/member/checkout');
    }


    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className="mx-auto max-w-7xl">
                <main className="isolate">
                    <Breadcrumb items={breadcrumbs}/>
                    <ProductFilter
                        res={getFilterResult}
                    />
                    <ProductCats able="product" cats={cats} perpage={perpage} isCatsOpen={isCatsOpen}
                                 setIsCatsOpen={setIsCatsOpen}/>
                </main>
                {filters.rows.length > 0 ?
                    <FilterResultHtml
                        rows={filters.rows}
                        meta={filters.meta}
                        addCart={addCart}
                        toNext={toNext}
                    />
                : <section id="home" className="">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {products.rows.map((product, idx) => (
                            <ProductHomeGrid
                                key={product.token}
                                idx={startIdx + idx}
                                product={product}
                                addCart={_addCart}
                                toNext={toNext}
                            />
                        ))}
                    </div>
                    <div className='mt-4 text-center'>
                        {products.meta.totalPage > 1 && products.meta.currentPage < products.meta.totalPage ?
                            <PrimaryOutlineButton className='w-[200px]' onClick={toNext}>更多...</PrimaryOutlineButton>
                            : ''
                        }
                    </div>
                </section>
                }
                {toggleModalShow ?
                    <BlueModal isModalShow={toggleModalShow}>
                        <BlueModal.Header setIsModalShow={setToggleModalShow}>
                            購物車
                        </BlueModal.Header>
                        <BlueModal.Body>成功加入購物車</BlueModal.Body>
                        <BlueModal.Footer>
                            <PrimaryButton onClick={() => setToggleModalShow(false)}>
                                關閉
                            </PrimaryButton>
                            <SecondaryButton onClick={goCart}>前往購物車</SecondaryButton>
                            <PrimaryOutlineButton onClick={goCheckout}>
                                結帳
                            </PrimaryOutlineButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : '' }
            </div>
        )
    }
}

export default Product