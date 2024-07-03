import {useContext, useState, useEffect} from 'react'
import BMContext from '../../../context/BMContext';
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { formattedWithSeparator } from '../../../functions/math';
import { ShowHtml } from '../../../functions';
import { FaCheckCircle } from "react-icons/fa";
import ProductCats from '../../../component/product/ProductCats';
import { PrimaryButton } from '../../../component/MyButton';
import { toLogin } from '../../../context/to';
import SelectNumber from '../../../component/form/SelectNumber';
import { addCartAPI } from '../../../context/cart/CartAction';

function ProductShow() {
    const {auth, setAlertModal, setIsLoading, isLoading, ok, warning} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const {token} = useParams();
    const [data, setData] = useState({});
    const [gallery, setGallery] = useState([]);
    const [quantity, setQuantity] = useState(1);
    var cart_token = null;

    const initBreadcrumb = [
        { name: '商品', href: '/product', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        data = data.data;
        console.info(data);
        setData(data);

        const images = [];
        data.images.forEach((item) => {
            images.push({original: item.path, thumbnail: item.path});
        });
        setGallery(images);
        //console.info(data.attrs);

        setBreadcrumbs(() => {
            return [...initBreadcrumb, { name: data.name, href: '', current: true }]
        });
        setImBusy(false);
    }

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(true);
            getOne(token, 'update');
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const plus = () => {
        setQuantity((prev) => {
            const val = prev + 1
            if (val > data.stock) {
                setAlertModal({
                    modalType: 'warning',
                    modalTitle: '警告',
                    modalText: "庫存數只有"+data.stock,
                    isModalShow: true,
                    isShowOKButton: true,
                    isShowCancelButton: false
                });
                return data.stock;
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

    const addCart = async () => {
        // 是否有登入
        if ('id' in auth && auth.id > 0) {
            //console.info(auth);
            setIsLoading(true)
            const data = await addCartAPI(auth.accessToken, token, quantity);
            //console.info(data)
            cart_token = data.token;
            setIsLoading(false)
            if (data.status === 200) {
                ok("已經加入購物車");
            } else {
                var message = "";
                for (let i = 0; i < data["message"].length; i++) {
                    message += data["message"][i].message;
                }
                warning(message);
            }
        } else {
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: "請先登入",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
                onOK: toLogin
            })
        }
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

    if (isLoading || imBusy) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            
            {/* 全部內容跟旁邊的類別 */}
            <div className="flex flex-col lg:flex-row relative z-20 justify-between px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                {/* 全部內容 */}
                <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    {/* 標題圖片跟詳細內容 */}
                    <div className="flex flex-col py-6 border-t dark:border-gray-700">
                        <div className="flex flex-col md:flex-row md:justify-between pb-6 border-b dark:border-gray-700">
                            {/* 標題跟圖片 */}
                            <div className="">
                                {/* 標題 */}
                                <h1 className="mb-4 max-w-2xl text-2xl dark:text-rabbit-50 font-extrabold leading-none text-gray-900 sm:text-3xl lg:text-4xl">{data.name}</h1>
                                {/* 價格 */}
                                <div className='flex'>
                                    <h2 className='flex mb-4 text-2xl text-Warning-600 font-medium me-2py-2.5'>
                                        {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_member) + "元"
                                            : ''
                                        }
                                    </h2>
                                    <del className='flex items-center mb-4 ml-3 text-xl text-BG-400 font-medium me-2py-2.5'>
                                        {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_nonmember) + "元"
                                            : ''
                                        }
                                    </del>
                                </div>
                                {/* 屬性 */}
                                <ul className='mb-4'>
                                    <li key='cat' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>分類：</span>
                                        {data.cat 
                                            ? data.cat.map((item, idx) => (
                                                <div key='item.text'>
                                                    <span className='text-MyWhite'>{item.text}</span>
                                                    {(idx < data.cat.length-1) ? <span className='text-MyWhite'>,&nbsp;</span> : ''}
                                                </div>
                                            ))
                                            : ''
                                        }
                                    </li>
                                    <li key='brand_text' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>品牌：</span>
                                        <span className='text-MyWhite'>{data.brand_text}</span>
                                    </li>
                                    {data.attrs.map((attr) => (
                                        <li key={attr.alias} className='flex items-center mb-4'>
                                            <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                            <span className='text-MyWhite'>{attr.name}：</span>
                                                {attr.rows.map((row, idx) => (
                                                    <div key={row.alias} className='flex items-center justify-center'>
                                                        {(attr.name === '顏色')
                                                            ? <ToColor color={row.name} />
                                                            : <span className='text-MyWhite'>{row.name}</span>
                                                        }
                                                        {(idx < attr.rows.length-1) ? <span className='text-MyWhite'>&nbsp;&nbsp;</span> : ''}
                                                    </div>
                                                ))}
                                        </li>
                                    ))}
                                    <li key='barcode_brand' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>編號：</span>
                                        <span className='text-MyWhite'>{data.barcode_brand}</span>
                                    </li>
                                    <li key='stock' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>庫存：</span>
                                        <span className='text-MyWhite'>{data.stock}</span>
                                        <span className='text-MyWhite ml-2'>{data.unit}</span>
                                    </li>
                                </ul>
                                {data.stock > 0 ?
                                <div className='flex flex-row lg:flex-col lg:gap-8 justify-between mt-12'>
                                    <SelectNumber label="數量" value={quantity} plus={plus} minus={minus} />
                                    <PrimaryButton className='' onClick={addCart}>加入購物車</PrimaryButton>
                                </div>
                                : <div className='mt-12 text-Warning-300'>無庫存，無法訂購</div>}
                            </div>
                            <div className="mt-8 lg:mt-0">
                                {/* 圖片 */}
                                <div className="w-full xl:w-[400px]">
                                    {data.images && data.images.length > 0
                                        ? <ImageGallery items={gallery} />
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='my-4 pt-6'>
                            <h1 className='text-MyWhite text-xl font-semibold mb-4'>詳細說明</h1>
                            <div className='text-PrimaryText text-xl'>
                                <ShowHtml content={data.content} />
                            </div>
                        </div>
                    </div>
                </article>
                <aside className="xl:block" aria-labelledby="sidebar-label">
                    <div className="xl:w-[336px] sticky top-6">
                        <h3 id="sidebar-label" className="sr-only">側邊欄</h3>
                        <ProductCats able="product" cats={data.cats} perpage={process.env.REACT_APP_PERPAGE} />
                    </div>
                </aside>
            </div>
        </div>
    )}
}

export default ProductShow

function ToColor({color}) {
    const className = 'w-6 h-6 rounded-full';
    if (color === '紅') {
        return <div className={`bg-Warning-500 ${className}`}> </div>
    } else if (color === '藍') {
        return <div className={`bg-Success-500 ${className}`}> </div>
    } else {
        return <div className={`bg-MyWhite ${className}`}>{color}</div>
    }
}
