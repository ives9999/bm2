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
    const {auth, setIsLoading, setAlertModal, warning, isLoading} = useContext(BMContext);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [cats, setCats] = useState([]);
    const [toggleModalShow, setToggleModalShow] = useState(false);

    const [isCatsOpen, setIsCatsOpen] = useState([]);

    let {page, perpage, cat, k, cat_name} = useQueryParams();
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
        console.info(data);
        // data.data.rows.forEach((row) => {
        //     console.info("cat length:"+row.cat.length);
        //     console.info("cat token:"+row.cat[0].token);
        // })
        if (data.status === 200) {
            //console.info(data.cats);
            setRows(data.data.rows);
            setMeta(data.data._meta);
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
        if (cat_name) {
            params.push({cat_name: cat_name});
        }
        getData(_page, perpage, params)
        setStartIdx((_page - 1) * perpage + 1);
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, cat, keyword, cat_name]);

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


    if (isLoading) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
      <div className="mx-auto max-w-7xl">
        <main className="isolate">
          <Breadcrumb items={breadcrumbs} />
          <div className="mb-4 mt-6 flex flex-col justify-between lg:mb-0">
            <ProductSearch able="product" filter={keywordFilter} />
          </div>
            <ProductCats able="product" cats={cats} perpage={perpage} isCatsOpen={isCatsOpen} setIsCatsOpen={setIsCatsOpen} />
        </main>
        <div className="relative z-20 mx-auto flex max-w-screen-xl flex-col justify-between rounded bg-gray-900 lg:flex-row lg:px-4">
          <article className="relative z-20 flex max-w-screen-xl flex-col justify-between rounded bg-gray-900 lg:mx-auto lg:flex-row lg:px-4">
            <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert w-full max-w-none xl:w-[828px]">

              <div className="flex flex-col">
                <div className="mx-1.5 flex flex-col flex-wrap justify-between lg:p-4 xl:flex-row">
                  {rows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="mb-4 w-full rounded-lg border border-gray-700 bg-PrimaryBlock-950 p-4 shadow-sm xl:w-[49%]"
                    >
                      <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                          <Link to={'/product/show/' + row.token}>
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
                          {/*<div className="">*/}
                          {/*  {row.cat.length > 0 ? (*/}
                          {/*    <Link*/}
                          {/*      className="text-sm text-tagColor hover:text-focusBlue"*/}
                          {/*      to={'/product?cat=' + row.cat[0].token}*/}
                          {/*    >*/}
                          {/*      {row.cat[0].text}*/}
                          {/*    </Link>*/}
                          {/*  ) : (*/}
                          {/*    ''*/}
                          {/*  )}*/}
                          {/*</div>*/}
                          <div className="">
                            <div className="flex text-sm text-tagColor hover:text-focusBlue">
                              <UserIcon
                                className="h-5 w-5 align-middle"
                                aria-hidden="true"
                              />
                              <div className="">{row.pv} 次</div>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-Primary-200 hover:text-Primary-300">
                          <Link to={'/product/show/' + row.token}>
                            {startIdx + idx + '. ' + row.name}
                          </Link>
                        </h3>
                        <div className="mb-6 mt-8 flex flex-row justify-between">
                          <div className="flex flex-row items-center gap-2 text-base text-tagColor hover:text-focusBlue focus:text-focusBlue">
                            <div className="text-Warning-500">
                              {row.prices[0]
                                ? 'NT$:' +
                                  formattedWithSeparator(
                                    row.prices[0].sellPrice,
                                  )
                                : '洽詢'}
                            </div>
                            <div className="">
                              <FaShoppingCart
                                className="h-5 w-5 cursor-pointer text-MyWhite"
                                onClick={() => addCart(row.token)}
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            className="bg-background rounded-md px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={(e) => {
                              e.preventDefault()
                              navigate('/produt/' + row.token)
                            }}
                          >
                            更多...
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mx-1.5 mt-4 lg:p-4">
                  {meta && Object.keys(meta).length > 0 && (
                    <Pagination setPage={setPage} meta={meta} />
                  )}
                </div>
              </div>
            </article>
            {/*<aside className="xl:block" aria-labelledby="sidebar-label">*/}
            {/*    <div className="xl:w-[336px] sticky top-6">*/}
            {/*        <h3 id="sidebar-label" className="sr-only">側邊欄</h3>*/}
            {/*        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>*/}
            {/*        <ProductCats able="product" cats={cats} perpage={perpage} />*/}
            {/*    </div>*/}
            {/*</aside>*/}
          </article>
        </div>
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

export default Product
