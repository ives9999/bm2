import React, {useContext, useEffect, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import SearchBar from "../../component/form/SearchBar";
import {PrimaryButton, PrimaryOutlineButton} from "../../component/MyButton";
import {CardWithTitle} from "../../component/Card";
import BMContext from "../../context/BMContext";
import useQueryParams from "../../hooks/useQueryParams";
import {getReadAPI} from "../../context/Action";
import {addActive, setActiveByIdx} from "../../functions/other";
import Breadcrumb from "../../component/Breadcrumb";
import {BsThreeDots} from "react-icons/bs";
import UseHr from "../../component/UseHr";
import {useNavigate} from "react-router-dom";
import {getSaleHomeAPI} from "../../context/pos/PosAction";
import {formattedWithSeparator} from "../../functions/math";
import {FaTimesCircle} from "react-icons/fa";
import {BlueModal} from "../../component/Modal";
import SelectNumber from "../../component/form/SelectNumber";
import Input from "../../component/form/Input";

const Buy = () => {
    const {auth, setIsLoading, warning, success} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);
    const navigate = useNavigate();

    const initBreadcrumbs = [
        {name: '進貨', href: '/pos/sale', current: false},
    ];
    const [breadcrumb, setBreadcrumb] = useState(initBreadcrumbs);

    const [cats, setCats] = useState([]);
    //進貨員
    const [sales, setSales] = useState([]);
    // 進貨品項
    const [buys, setBuys] = useState([]);

    const [toggleEditProductModalShow, setToggleEditProductModalShow] = useState(false);


    const [productKeyword, setProductKeyword] = useState('');
    const [products, setProducts] = useState([]);

    const [mainFormData, setMainFormData] = useState({
    });

    const [errorMsgs, setErrorMsgs] = useState({
        name: '',
    });

    var {page, perpage, k, cat_token} = useQueryParams();
    var params = {backend: true};
    if (k !== undefined && k.length > 0) {
        params = {...params, ...{k: k}};
    }
    //console.info("1.:" + JSON.stringify(params));
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);

    const [productFormData, setProductFormData] = useState({});

    useEffect(() => {
        setIsLoading(true);
        if (cat_token) {
            getProducts(cat_token);
        } else {
            getBuyHome(auth.accessToken, page, perpage);
        }
        setIsLoading(false);
        //setIsGetComplete(true);
    }, [_page, cat_token]);

    // 取得所有分費
    const getBuyHome = async (accessToken, page, perpage) => {
        let data = await getSaleHomeAPI(accessToken, page, perpage);
        data = data.data.data;
        console.info(data);
        let cats = data.cats.rows;
        cats = addActive(cats, -1);
        setCats(cats);

        let sales = data.sales;
        sales = addActive(sales);
        setSales(sales);

        setIsGetComplete(true);
    }

    // 取得分類下的商品
    const getProducts = async (token) => {
        setIsLoading(true);
        const params = {cat_token: token};
        const data = await getReadAPI('product', page, perpage, params, auth.accessToken);
        //console.info("1:" + data);
        setCats(data.cats.rows);
        setBreadcrumb(() => {
            let tree = [];
            data.cats.rows.forEach(item => {
                if (item.active) {
                    tree.push(item);
                    if (item.children.length > 0) {
                        item.children.forEach(item1 => {
                            if (item1.active) {
                                tree.push(item1);
                            }
                        })
                    }
                }
            })

            let res = [];
            tree.forEach(item => {
                res = [...res, {name: item.name, href:'/pos/sale?cat_token='+item.token, current: false}];
            })

            return [...initBreadcrumbs, ...res];
        })

        let tmp = data.data.rows;
        //console.info(data);
        // 商品加入active的屬性
        tmp = addActive(tmp, -1);

        // 如果在購買清單中，有該分類的商品，則將active改為true
        buys.forEach((buy) => {
            tmp = tmp.map((item) => {
                if (item.id === buy.id) {
                    item.active = true;
                }
                return item;
            });
        })
        setProducts(tmp);
        setIsLoading(false);
    }

    // 編輯或刪除要買的商品
    const onProduct = (e, type, idx) => {
        if (type === 'update') {
            setToggleEditProductModalShow(true);
            editProductIdx.current = idx;
            setProductFormData(buys[idx]);
        } else if (type === 'delete') {
            e.stopPropagation();
            deleteProduct(idx);
        }
    }

    // 新增商品到購買清單
    const addProduct = (idx) => {
        const product = products[idx];
        // 如果無庫存，無法加入
        if (product.stock <= 0) {
            warning("無庫存，無法購買此產品");
            return;
        }

        // 如果已經在購買清單中，無法再加入
        var isExist = false;
        buys.forEach((buy) => {
            if (buy.id === product.id) {
                isExist = true;
            }
        })
        if (isExist) {
            warning('商品已經在清單中了');
            return;
        }
        // 將商品active設為true
        setActiveByIdx(setProducts, idx);
        setProducts((prev) => {
            prev[idx].active = true;
            return [...prev];
        })
        const price = products[idx].prices[0].price_member;
        products[idx]["price"] = price;
        products[idx]["quantity"] = 1;
        products[idx]["total"] = products[idx]["price"] * products[idx]["quantity"];
        products[idx]["discount"] = 0;
        setBuys([...buys, products[idx]]);
        setMainFormData(prev => {
            return {...prev, totalAmount: prev.totalAmount + price}
        })
    }

    // 從購買清單移出該商品
    const deleteProduct = (idx) => {
        const product_id = buys[idx].id;
        const product = products.find(item => item.id === product_id);
        //console.info(product);
        // 先將商品active取消
        setProducts((prev) => {
            const items = prev.map((item) => {
                if (item.id === product_id) {
                    item.active = false;
                }
                return item
            });
            return [...items];
        })
        buys.splice(idx, 1);
        setBuys([...buys]);
        setMainFormData(prev => {
            return {...prev, totalAmount: prev.totalAmount - product.prices[0].price_member}
        })
    }

    // 設定銷售員
    const setSale = (idx) => {
        setActiveByIdx(setSales, idx);
    }

    // 更新購買商品的數量跟價格
    const onUpdateBuy = () => {
        setToggleEditProductModalShow(false);
        const idx = buys.findIndex(item => item.id === productFormData.id);
        const prevTotal = buys[idx].total;
        setBuys((prev) => {
            prev[idx] = productFormData;
            return [...prev];
        });

        setMainFormData(prev => {
            return {...prev, totalAmount: prev.totalAmount - prevTotal + productFormData.total};
        });
    }

    // 增加商品數量
    const plus = () => {
        const selectedProduct = buys.find((product) => productFormData.id === product.id);
        if (productFormData.quantity + 1 > selectedProduct.stock) {
            warning("數量已經超過庫存數，無法購買");
        } else {
            setProductFormData((prev) => ({...prev, quantity: prev.quantity + 1, total: prev.price * (prev.quantity + 1)}));
            // const thisQuantity = buys[editProductIdx.current].quantity + 1;
            // const thisTotal = buys[editProductIdx.current].price * thisQuantity;
            // setBuys((prev) => {
            //     prev[editProductIdx.current].quantity = thisQuantity;
            //     prev[editProductIdx.current].total = thisTotal;
            //     return [...prev];
            // })
            // setTotal((prev) => prev + buys[editProductIdx.current].price);
        }
    }

    // 減少商品數量
    const minus = () => {
        if (productFormData.quantity - 1 < 1) {
            warning("購買數量不得少於一個");
        } else {
            setProductFormData((prev) => ({...prev, quantity: prev.quantity - 1, total: prev.price * (prev.quantity - 1)}));
            // setBuys((prev) => {
            //     prev[editProductIdx.current].quantity--;
            //     prev[editProductIdx.current].total = prev[editProductIdx.current].price * prev[editProductIdx.current].quantity;
            //     return [...prev];
            // })
            // setTotal((prev) => prev - buys[editProductIdx.current].price);
        }
    }

    const onChange = (e) => {
        // 搜尋會員時
        if (e.target.id === "product") {
            setProductKeyword(e.target.value);
            // 修改單一傷商品的價格跟折扣時
        }
        setErrorMsgs((prev) => ({
            ...prev, [e.target.id]: ''
        }));
    }

    const onClear = (e) => {
        setMainFormData(prev => {
            return {...prev, [e]: ''};
        })
    }

    // 商品跟會員的搜尋
    const onSearch = async (type) => {
        if (type === 'member') {
        } else if (type === 'product') {
        }
    }

    // 點擊分類
    const goCat = (token, idx, childrenIdx = -1) => {
        setActiveByIdx(setCats, idx);

        if (cats[idx].children.length === 0 || childrenIdx >= 0) {
            getProducts(token);
        }

        navigate('/pos/buy?cat_token=' + token);
    }

    var editProductIdx = useRef(-1);

    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className='flex flex-row'>
                <aside
                    className="scroll-auto z-40 2xl:w-[350px] w-72 h-screen pt-16 pl-1 pr-1 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
                    aria-label="Sidenav"
                    id="drawer-navigation"
                >
                    <CardWithTitle title='商品' mainClassName="">
                        <div className='text-MyWhite flex flex-row justify-between items-center'>
                            <SearchBar
                                name="product"
                                value={productKeyword}
                                placeholder="請輸入關鍵字"
                                handleChange={onChange}
                                onClear={onClear}
                                containerWidth='w-[180px]'
                            />
                            <PrimaryOutlineButton onClick={() => onSearch('product')}
                                                  className='!px-4'>搜尋</PrimaryOutlineButton>
                        </div>
                        <UseHr mb="mb-2" mt="mt-4"/>
                        <ul className="">
                            {buys.map((product, idx) => (
                                <li key={product.token + "_" + idx} className='hover:bg-gray-700 cursor-pointer mb-4'
                                    onClick={(e) => {
                                        onProduct(e, 'update', idx)
                                    }}>
                                    <div className='flex flex-row justify-between items-center px-2 py-2'>
                                        <div className='text-MyWhite'>{product.name}</div>

                                        <div className='flex flex-row items-center'>
                                            <div className='flex flex-col mr-4'>
                                                <div
                                                    className='text-gray-200 text-right font-bold text-2xl'>{product.quantity}</div>
                                                <div
                                                    className='text-hot-pink-400 text-xl'>${formattedWithSeparator(product.total)}</div>
                                            </div>
                                            <FaTimesCircle className='w-6 h-6 text-Warning-500 cursor-pointer'
                                                           onClick={(e) => onProduct(e, 'delete', idx)}/>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardWithTitle>
                    <CardWithTitle title='業務' mainClassName="mt-6">
                        <ul className='flex flex-row gap-4 items-center'>
                            {sales.map((sale, idx) => (
                                <li key={sale.name}
                                    className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden cursor-pointer bg-gray-100 rounded-full text-gray-600 ring ring-gray-500 ${sale.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800 dark:hover:text-gray-700' : 'dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 dark:hover:text-MyWhite'}`}
                                    onClick={() => setSale(idx)}
                                >
                                    <span className="font-medium">{sale.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardWithTitle>
                </aside>
                <main className="p-4 w-full h-auto pt-20">
                    <Breadcrumb items={breadcrumb}/>
                    <div className='mb-8 grid grid-cols-6 gap-4 2xl:grid-cols-8 xl:gap-10'>
                        {cats.map((cat, idx) => (
                            <div key={cat.id}>
                                <div key={cat.token}
                                     className={`flex flex-col items-center justify-center h-24 2xl:px-4 px-2 bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-100 ${cat.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800' : 'dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800 dark:text-white'}`}
                                     onClick={() => goCat(cat.token, idx)}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight">{cat.name}</h5>
                                    {cat.children.length > 0 ? <BsThreeDots className='text-MyWhite w-6 h-6'/> : ""}
                                </div>
                                {cat.children.length > 0 ?
                                    <div
                                        className={`absolute bdivide-y z-10 bg-white divide-y divide-gray-100 w-44 dark:bg-PrimaryBlock-950 ${cat.active ? 'block' : 'hidden'}`}>
                                        <ul className="mt-2 py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow">
                                        {cat.children.map((childrenCat, idx1) => (
                                                <li key={childrenCat.token}
                                                    onClick={() => goCat(childrenCat.token, idx, idx1)}
                                                    className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer`}>{childrenCat.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    : ''}
                            </div>
                        ))}
                    </div>
                    <UseHr/>
                    <div className='mb-8 grid grid-cols-4 gap-4 2xl:grid-cols-8 xl:gap-10'>
                        {products.map((product, idx) => (
                            <div key={product.token}
                                 className={`flex flex-col justify-center p-2 bg-white border-2 border-dashed border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${product.active ? 'dark:bg-PrimaryBlock-500' : ' dark:bg-PrimaryBlock-700 dark:border-PrimaryBlock-500 dark:hover:bg-PrimaryBlock-800'}`}
                                 onClick={() => addProduct(idx)}
                            >
                                <h5 className={`mb-2 text-base font-bold tracking-tight text-gray-900 ${product.active ? 'dark:text-MyBlack' : ' dark:text-white'}`}>{product.name}</h5>
                                <div className='flex flex-row items-center justify-between'>
                                    <div
                                        className={`text-l ${product.active ? 'text-Success-100' : 'text-Success-200'}`}>庫存：{product.stock}</div>
                                    {product.prices.length > 0 ??
                                        <div
                                            className={`text-xl font-bold ${product.active ? 'text-hot-pink-200' : 'text-hot-pink-400'}`}>${(product.prices[0].sellPrice) ? product.prices[0].sellPrice : ''}</div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                {toggleEditProductModalShow ?
                    <BlueModal isModalShow={toggleEditProductModalShow}>
                        <BlueModal.Header
                            setIsModalShow={setToggleEditProductModalShow}>{buys[editProductIdx.current].name}</BlueModal.Header>
                        <BlueModal.Body>
                            <div className='text-MyWhite mb-2'>庫存：<span
                                className='text-Warning-300 text-xl font-bold'>{buys[editProductIdx.current].stock}</span>
                            </div>
                            <SelectNumber label="數量" value={productFormData.quantity} plus={plus} minus={minus}/>
                            <Input
                                label="價格："
                                type="number"
                                name="price"
                                value={productFormData.price || 999999}
                                id="price"
                                placeholder="200"
                                onChange={onChange}
                                onClear={onClear}
                                container_className='flex flex-row items-center mt-4'
                                input_className='w-64 ml-2'
                            />
                            <Input
                                label="折扣："
                                type="number"
                                name="discount"
                                value={productFormData.discount}
                                id="discount"
                                placeholder="200"
                                onChange={onChange}
                                onClear={onClear}
                                container_className='flex flex-row items-center mt-4'
                                input_className='w-64 ml-2'
                            />
                            <div className='text-MyWhite mb-2'>小計：<span
                                className='text-Warning-300 text-xl font-bold ml-2'>${productFormData.total}元</span>
                            </div>
                        </BlueModal.Body>
                        <BlueModal.Footer isShowCancelButton={true}
                                          handleCancelButton={() => setToggleEditProductModalShow(false)}>
                            <PrimaryButton onClick={onUpdateBuy}>更新</PrimaryButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}
            </div>
        );
    }
};

export default Buy;