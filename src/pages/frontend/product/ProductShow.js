import {useContext, useState, useEffect} from 'react'
import BMContext from '../../../context/BMContext';
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { formattedWithSeparator } from '../../../functions/math';
import { ShowHtml } from '../../../functions';
import { FaCheckCircle } from "react-icons/fa";
import ProductCats from '../../../component/product/ProductCats';
import {OKButton, PrimaryButton, PrimaryOutlineButton, SecondaryButton} from '../../../component/MyButton';
import { toLogin } from '../../../context/to';
import SelectNumber from '../../../component/form/SelectNumber';
import { addCartAPI } from '../../../context/cart/CartAction';
import Overlay from "../../../component/Overlay";
import {BlueModal, BlueOK, BlueWarning} from "../../../component/Modal";
import {useSpring, animated} from "@react-spring/web";
import AddCart from "../../../api/AddCart";

function ProductShow() {
    const {auth, setAlertModal, setIsLoading, isLoading, ok, warning, setIsShowOverlay} = useContext(BMContext);
    const [imBusy, setImBusy] = useState(true);
    const [toggleModalShow, setToggleModalShow] = useState(false);
    const {token} = useParams();
    const [row, setRow] = useState({});
    const [cats, setCats] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    const AnimatedModal = animated(BlueModal);
    const styles = useSpring({
        from: {opacity: 0,},
        to: {opacity: 1,},
    })

    const initBreadcrumb = [
        { name: '商品', href: '/product', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)

    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        console.info(data);
        setRow(data.data);
        //setCats(data.cats.rows);
        //const activeCat = data.cats.rows.find(row => row.active);

        const images = [];
        data.data.images.forEach((item) => {
            images.push({original: item.path, thumbnail: item.path});
        });
        setGallery(images);
        //console.info(data.attrs);
        const renderVideo = (item) => {
            return (
              <div className="video-wrapper">
                  <iframe
                    width="100%"
                    height="480px"
                    src={item.embedUrl}
                    frameBorder="0"
                    allowFullScreen
                    title="ex"
                  />
              </div>
            );
        };
        const videos = [
        {
            original: 'http://localhost:3000/uploads/60/97/6097875d607189be8ce3ec5cfff5248c.mov',
            thumbnail: 'http://localhost:3000/uploads/60/97/6097875d607189be8ce3ec5cfff5248c.mov',
            renderItem: renderVideo.bind(this),
        }];
        setGallery(videos);

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
        setImBusy(false);
    }

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(true);
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
                    modalText: "庫存數只有"+row.stock,
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

    const addCart = async () => {
        //setToggleModalShow(true);
        //是否有登入
        if ('id' in auth && auth.id > 0) {
            setIsLoading(true)
            const res = await AddCart(auth.accessToken, token, quantity)
            if (typeof res === 'object') {
                setToggleModalShow((prev)=>(!prev));
            } else if (typeof res === 'string') {
                warning(res);
            }
            setIsLoading(false)
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
          <Breadcrumb items={breadcrumbs} />
        </main>

        {/* 全部內容跟旁邊的類別 */}
        <div className="relative z-20 mx-auto flex max-w-screen-xl flex-col rounded bg-gray-900 px-4 lg:flex-row">
          {/* 全部內容 */}
          <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert w-full max-w-none">
            {/* 標題圖片跟詳細內容 */}
            <div className="flex flex-col border-b pb-6 dark:border-gray-700 md:flex-row">
              <div className="mt-8 lg:mt-0">
                {/* 圖片 */}
                {/*<div className="w-[400px]">*/}
                  <video className="w-[400px]" controls>
                    <source src="http://localhost:3000/uploads/60/97/6097875d607189be8ce3ec5cfff5248c.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/*{row.images && row.images.length > 0*/}
                  {/*    ? <ImageGallery items={gallery}/>*/}
                  {/*    : ''*/}
                  {/*}*/}
                {/*</div>*/}
              </div>
              {/* 標題跟圖片 */}
              <div className="">
                {/* 標題 */}
                <h1 className="mb-4 mt-4 max-w-2xl text-2xl font-extrabold leading-none text-gray-900 dark:text-rabbit-50 sm:text-3xl md:mt-0 lg:text-4xl">
                  {row.name}
                </h1>
                {/* 價格 */}
                <div className="flex">
                  <h2 className="me-2py-2.5 mb-4 flex text-2xl font-medium text-Warning-600">
                    {row && row.prices && row.prices.length > 0
                      ? 'NT$：' +
                        formattedWithSeparator(row.prices[0].sellPrice) +
                        '元'
                      : ''}
                  </h2>
                  <del className="me-2py-2.5 mb-4 ml-3 flex items-center text-xl font-medium text-SubText">
                    {row && row.prices && row.prices.length > 0
                      ? 'NT$：' +
                        formattedWithSeparator(row.prices[0].price_nonmember) +
                        '元'
                      : ''}
                  </del>
                </div>
                {/* 屬性 */}
                <ul className="mb-4">
                  <li key="cat" className="mb-4 flex items-center">
                    <FaCheckCircle className="mr-4 h-4 w-4 text-Primary-400" />
                    <span className="text-MyWhite">分類：</span>
                    {row.cat
                      ? row.cat.map((item, idx) => (
                          <div key={item.token}>
                            <span className="text-MyWhite">{item.name}</span>
                            {idx < row.cat.length - 1 ? (
                              <span className="text-MyWhite">,&nbsp;</span>
                            ) : (
                              ''
                            )}
                          </div>
                        ))
                      : ''}
                  </li>
                  <li key="brand_text" className="mb-4 flex items-center">
                    <FaCheckCircle className="mr-4 h-4 w-4 text-Primary-400" />
                    <span className="text-MyWhite">品牌：</span>
                    <span className="text-MyWhite">{row.brand_text}</span>
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
                  <li key="barcode_brand" className="mb-4 flex items-center">
                    <FaCheckCircle className="mr-4 h-4 w-4 text-Primary-400" />
                    <span className="text-MyWhite">編號：</span>
                    <span className="text-MyWhite">{row.barcode_brand}</span>
                  </li>
                  <li key="stock" className="mb-4 flex items-center">
                    <FaCheckCircle className="mr-4 h-4 w-4 text-Primary-400" />
                    <span className="text-MyWhite">庫存：</span>
                    <span className="text-MyWhite">{row.stock}</span>
                    <span className="ml-2 text-MyWhite">{row.unit}</span>
                  </li>
                </ul>
                {row.stock > 0 ? (
                  <div className="mt-12 flex flex-row justify-between lg:flex-col lg:gap-8">
                    <SelectNumber
                      label="數量"
                      value={quantity}
                      plus={plus}
                      minus={minus}
                    />
                    <PrimaryButton className="" onClick={addCart}>
                      加入購物車
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="mt-12 text-Warning-300">無庫存，無法訂購</div>
                )}
              </div>
            </div>
            <div className="my-4 pt-6">
              <h1 className="mb-4 text-xl font-semibold text-MyWhite">
                詳細說明
              </h1>
              <div className="text-xl text-PrimaryText">
                <ShowHtml content={row.content} />
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

        {/*{(toggleModalShow ?*/}
        {/*    <BlueWarning handleClose={() => setToggleModalShow(false)} content="完成操作" />*/}
        {/*    : ''*/}
        {/*)}*/}

        {toggleModalShow ? (
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
        ) : (
          ''
        )}
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
