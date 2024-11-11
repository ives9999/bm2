import React, {useEffect, useState, useContext, useRef} from 'react'
import BMContext from "../../context/BMContext";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { getHome } from '../../context/home/HomeAction';
import {Grid, ProductHomeGrid} from '../../component/Grid';
import AddCart from "../../api/AddCart";
import {toLogin} from "../../context/to";
import {BlueModal} from "../../component/Modal";
import {DeleteButton, PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../component/MyButton";
import InputIcon from "../../component/form/InputIcon";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import useQueryParams from '../../hooks/useQueryParams'
import {getReadAPI} from "../../context/product/ProductAction";
import {CSS} from "@dnd-kit/utilities";
import {Featured} from "../../component/image/Images";
import {RiDragDropFill} from "react-icons/ri";
import {ImSpinner6} from "react-icons/im";
import ProductFilter, {FilterResultHtml} from '../../component/ProductFilter'

const Home = () => {
    const {auth, setIsLoading, warning, setAlertModal, isLoading} = useContext(BMContext);
    // const [teams, setTeams] = useState([]);
    // const [arenas, setArenas] = useState([]);
    const [products, setProducts] = useState({});
    const [isGetComplete, setIsGetComplete] = useState(false);

    const [toggleModalShow, setToggleModalShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [filters, setFilters] = useState({rows: [], meta: {}});
    const toNextFn = useRef();

    const getFilterResult = (rows, meta, fn) => {
        setFilters(prev => {
            return {
                rows: [...prev.rows, ...rows],
                meta: meta,
            }
        })
        toNextFn.current = fn;
    }

    const toNext = () => {
        toNextFn.current();
    }

    const fetch = async () => {
        const data = await getHome();
        //console.info(data.data);
        //onClear();
        // data is {team: team, arena: arena}
        // team and arena is {status: 200, data: [{}, {}, {}]}
        // setTeams(data.team.data);
        // setArenas(data.arena.data);
        setProducts(data.data);
        setIsGetComplete(true);
        //focusFilter();
    }

    useEffect(() => {
        const q = location.search;
        //console.info(q);

        if (q.length === 0) {
            setFilters({rows:[], meta: {}})
            //console.info('bbb');
            fetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search])

    const addCart = async (token) => {
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

    const parts = [
        {key: 'hot', title: '暢銷商品'},
        {key: 'second_racket', title: '最新二手拍'},
        {key: 'racket', title: '最新球拍'},
    ]

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
            <>
                <div className="mx-auto max-w-screen-xl">
                    <main className="isolate">
                        <div className="row mt-70">
                            <ProductFilter
                                res={getFilterResult}
                            />
                            {filters.rows.length > 0 ?
                                <FilterResultHtml
                                    rows={filters.rows}
                                    meta={filters.meta}
                                    addCart={addCart}
                                    toNext={toNext}
                                />
                            : <section id="home" className="">
                                <div className="py-8 lg:py-16">
                                    {parts.map(part => (
                                        <div key={part.key} className='mb-12'>
                                            <div className="mx-auto max-w-screen-sm text-left mb-8 lg:mb-6 lg:ml-2">
                                                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-MyWhite">{part.title}</h2>
                                            </div>
                                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                                {part.key in products && products[part.key].length > 0 ?
                                                    products[part.key].map(product => (
                                                        <ProductHomeGrid
                                                            key={product.token}
                                                            product={product}
                                                            addCart={addCart}
                                                            toNext={toNext}
                                                        />
                                                    ))
                                                    : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            }
                        </div>
                    </main>
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
            </>
        )
    }
}

export default Home;