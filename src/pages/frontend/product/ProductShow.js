import {useContext, useState, useEffect, React, useRef} from 'react'
import BMContext from '../../../context/BMContext';
import {useParams, useNavigate} from 'react-router-dom'
import Breadcrumb from '../../../component/Breadcrumb'
import {getOneAPI, getPlusOneAPI} from '../../../context/product/ProductAction';
import "react-image-gallery/styles/css/image-gallery.css";
import {formattedWithSeparator} from '../../../functions/math';
import {ShowHtml} from '../../../functions';
import {FaCheckCircle} from "react-icons/fa";
import {MdPageview} from "react-icons/md";
import {RiStockFill} from "react-icons/ri";
import {TbBrandDatabricks} from "react-icons/tb";
import {BiSolidCategoryAlt} from "react-icons/bi";
import {OKButton, PrimaryButton, PrimaryOutlineButton, SecondaryButton} from '../../../component/MyButton';
import {toLogin} from '../../../context/to';
import SelectNumber from '../../../component/form/SelectNumber';
import {addCartAPI} from '../../../context/cart/CartAction';
import Overlay from "../../../component/Overlay";
import {BlueModal, BlueOK, BlueWarning} from "../../../component/Modal";
import {useSpring, animated} from "@react-spring/web";
import AddCart from "../../../api/AddCart";
import FilterProduct, {FilterResultHtml} from "../../../component/FilterProduct";
import {ImSpinner6} from "react-icons/im";
import {addCart} from "../../../functions/addCart";

function ProductShow() {
    const {auth, setAlertModal, setIsLoading, isLoading, ok, warning, setIsShowOverlay} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);
    const [toggleModalShow, setToggleModalShow] = useState(false);
    const {token} = useParams();
    const [row, setRow] = useState({});
    const [cats, setCats] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const [gallery, setGallery] = useState([]);
    const [galleryIdx, setGalleryIdx] = useState(0);

    const navigate = useNavigate();

    const AnimatedModal = animated(BlueModal);
    const styles = useSpring({
        from: {opacity: 0,},
        to: {opacity: 1,},
    })

    const initBreadcrumb = [
        {name: '商品', href: '/product', current: false},
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
        }
    }

    const plusOne = (token) => {
        getPlusOneAPI(token);
    }

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        console.info(data);
        setRow(data.data);
        //setCats(data.cats.rows);
        //const activeCat = data.cats.rows.find(row => row.active);

        //const images = [];
        // data.data.images.forEach((item) => {
        //     images.push({original: item.path, thumbnail: item.path});
        // });
        //console.info(images);
        setGallery(data.data.images);
        //console.info(data.attrs);

        setBreadcrumbs(() => {
            const tree = data.data.cat.map(((item, idx) => {
                const current = idx === (data.data.cat.length - 1);
                return {name: item.name, href: 'product?cat_token=' + item.token, current: current}
            }));
            tree.shift();
            //console.info(tree);
            return [...initBreadcrumb, ...tree];
            //return [...initBreadcrumb, {name: data.data.cat[0].name, href: '/product?cat_token=' + data.data.cat[0].token, current: false}, { name: data.data.name, href: '', current: true }];
        });
        setIsGetComplete(true);
    }

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(true);
            plusOne(token);
            getOne(token, 'one');
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const plus = () => {
        setQuantity((prev) => {
            const val = prev + 1
            if (val > row.stock) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: "庫存數只有" + row.stock,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false
                });
                return row.stock;
            } else {
                return val;
            }
        });
    }

    const minus = () => {
        setQuantity((prev) => {
            const val = prev - 1;
            if (val <= 0) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: "數量不得小於1",
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false
                });
                return 1;
            } else {
                return val;
            }
        });
    }

    const _addCart = (token) => {
        addCart(auth, setIsLoading, token, setToggleModalShow, warning, setAlertModal);
    }

    const goCart = () => {
        navigate('/member/cart');
    }

    const goCheckout = () => {
        navigate('/member/checkout');
    }

    const goCat = (token) => {
        navigate('/product?cat=' + token);
    }
    // const images = [
    //     {
    //       original: "https://picsum.photos/id/1018/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1018/250/150/",
    //     },
    //     {
    //       original: "https://picsum.photos/id/1015/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1015/250/150/",
    //     },
    //     {
    //       original: "https://picsum.photos/id/1019/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1019/250/150/",
    //     },
    //   ];

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
                    <FilterProduct
                        res={getFilterResult}
                    />
                </main>

                {filters.rows.length > 0 ?
                    <FilterResultHtml
                        rows={filters.rows}
                        meta={filters.meta}
                        addCart={_addCart}
                        toNext={toNext}
                    />
                : <div
                    className="flex flex-col lg:flex-row relative z-20 px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                    {/* 全部內容 */}
                    <article
                        className="w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        {/* 標題圖片跟詳細內容 */}
                        <div
                            className="flex flex-col md:flex-row md:gap-4 pb-6 border-b dark:border-gray-700">
                            <div className="mt-8 lg:mt-0">
                                {/* 圖片 */}
                                <div className="w-full xl:w-[400px]">
                                    <div className='w-full mb-2'>
                                        {gallery && gallery[galleryIdx] ?
                                            gallery[galleryIdx].type === 'jpg' ?
                                                <img src={gallery[galleryIdx].path} alt={gallery[galleryIdx].type}/> :
                                                <video src={gallery[galleryIdx].path} controls autoPlay/>
                                            : ''
                                        }
                                    </div>
                                    <div className=''>
                                        <ul className='flex flex-row gap-4'>
                                            {gallery.map((item, idx) => (
                                                <li key={item.path} className='w-[45px] cursor-pointer'
                                                    onClick={e => setGalleryIdx(idx)}>
                                                    {item.type === 'jpg' ?
                                                        <img src={item.path} alt={item.type}/>
                                                        : <video src={item.path}/>
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/*{row.images && row.images.length > 0*/}
                                    {/*    ? <ImageGallery items={gallery}/>*/}
                                    {/*    : ''*/}
                                    {/*}*/}
                                </div>
                            </div>
                            {/* 標題跟圖片 */}
                            <div className="">
                                {/* 標題 */}
                                <h1 className="mt-4 md:mt-0 mb-4 max-w-2xl text-2xl dark:text-rabbit-50 font-extrabold leading-none text-gray-900 sm:text-3xl lg:text-4xl">{row.name}</h1>
                                {/* 價格 */}
                                <div className='flex'>
                                    <h2 className='flex mb-4 text-2xl text-Warning-600 font-medium me-2py-2.5'>
                                        {row && row.prices && row.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(row.prices[0].sellPrice) + "元"
                                            : ''
                                        }
                                    </h2>
                                    <del
                                        className='flex items-center mb-4 ml-3 text-xl text-SubText font-medium me-2py-2.5'>
                                        {row && row.prices && row.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(row.prices[0].price_nonmember) + "元"
                                            : ''
                                        }
                                    </del>
                                </div>
                                {/* 屬性 */}
                                <ul className='mb-4'>
                                    <li key='cat' className='flex items-center mb-4'>
                                        <BiSolidCategoryAlt className='h-4 w-4 text-Primary-400 mr-4'/>
                                        <span className='text-MyWhite'>分類：</span>
                                        {row.cat
                                            ? row.cat.map((item, idx) => (
                                                <div key={item.token}>
                                                    <span className='text-MyWhite cursor-pointer'
                                                          onClick={() => goCat(item.token)}>{item.name}</span>
                                                    {(idx < row.cat.length - 1) ?
                                                        <span className='text-MyWhite'>,&nbsp;</span> : ''}
                                                </div>
                                            ))
                                            : ''
                                        }
                                    </li>
                                    <li key='brand_text' className='flex items-center mb-4'>
                                        <TbBrandDatabricks className='h-5 w-5 text-Primary-400 mr-4'/>
                                        <span className='text-MyWhite'>品牌：</span>
                                        <span className='text-MyWhite'>{row.brand_text}</span>
                                    </li>
                                    {/*{data.attrs.map((attr) => (*/}
                                    {/*    <li key={attr.alias} className='flex items-center mb-4'>*/}
                                    {/*        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />*/}
                                    {/*        <span className='text-MyWhite'>{attr.name}：</span>*/}
                                    {/*            {attr.rows.map((row, idx) => (*/}
                                    {/*                <div key={row.alias} className='flex items-center justify-center'>*/}
                                    {/*                    {(attr.name === '顏色')*/}
                                    {/*                        ? <ToColor color={row.name} />*/}
                                    {/*                        : <span className='text-MyWhite'>{row.name}</span>*/}
                                    {/*                    }*/}
                                    {/*                    {(idx < attr.rows.length-1) ? <span className='text-MyWhite'>&nbsp;&nbsp;</span> : ''}*/}
                                    {/*                </div>*/}
                                    {/*            ))}*/}
                                    {/*    </li>*/}
                                    {/*))}*/}
                                    <li key='barcode_brand' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-5 w-5 text-Primary-400 mr-4'/>
                                        <span className='text-MyWhite'>編號：</span>
                                        <span className='text-MyWhite'>{row.barcode_brand}</span>
                                    </li>
                                    <li key='stock' className='flex items-center mb-4'>
                                        <RiStockFill className='h-5 w-5 text-Primary-400 mr-4'/>
                                        <span className='text-MyWhite'>庫存：</span>
                                        <span className='text-MyWhite'>{row.stock}</span>
                                        <span className='text-MyWhite ml-2'>{row.unit}</span>
                                    </li>
                                    <li key='pv' className='flex items-center mb-4'>
                                        <MdPageview className='h-5 w-5 text-Primary-400 mr-4'/>
                                        <span className='text-MyWhite'>瀏覽數：</span>
                                        <span className='text-MyWhite'>{formattedWithSeparator(row.pv)}</span>
                                    </li>
                                </ul>
                                {row.stock > 0 ?
                                    <div className='flex flex-row lg:flex-col lg:gap-8 justify-between mt-12'>
                                        <SelectNumber label="數量" value={quantity} plus={plus} minus={minus}/>
                                        <PrimaryButton className='' onClick={_addCart}>加入購物車</PrimaryButton>
                                    </div>
                                    : <div className='mt-12 text-Warning-300'>無庫存，無法訂購</div>}
                            </div>
                        </div>
                        <div className='my-4 pt-6'>
                            <h1 className='text-MyWhite text-xl font-semibold mb-4'>詳細說明</h1>
                            <div className='text-PrimaryText text-xl'>
                                <ShowHtml content={row.content}/>
                            </div>
                        </div>
                    </article>
                    {/*<aside className="xl:block" aria-labelledby="sidebar-label">*/}
                    {/*    <div className="xl:w-[336px] sticky top-6">*/}
                    {/*        <h3 id="sidebar-label" className="sr-only">側邊欄</h3>*/}
                    {/*        <ProductCats able="product" cats={cats} perpage={process.env.REACT_APP_PERPAGE} />*/}
                    {/*    </div>*/}
                    {/*</aside>*/}
                 </div>
                }

                {/*{(toggleModalShow ?*/}
                {/*    <BlueWarning handleClose={() => setToggleModalShow(false)} content="完成操作" />*/}
                {/*    : ''*/}
                {/*)}*/}

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

export default ProductShow

function ToColor({color}) {
    const className = 'w-6 h-6 rounded-full';
    if (color === '紅') {
        return <div className={`bg-Warning-500 ${className}`}></div>
    } else if (color === '藍') {
        return <div className={`bg-Success-500 ${className}`}></div>
    } else {
        return <div className={`bg-MyWhite ${className}`}>{color}</div>
    }
}