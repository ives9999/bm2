import {CardWithTitle, JustTitleCard} from "../../../component/Card";
import React, {useContext, useEffect, useRef, useState} from "react";
import BMContext from "../../../context/BMContext";
import useQueryParams from "../../../hooks/useQueryParams";
import {getReadAPI as getMemberReadAPI, registerAPI, registerPosAPI} from "../../../context/member/MemberAction";
import UseHr from "../../../component/UseHr";
import {CancelButton, PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../../component/MyButton";
import {FaTimesCircle} from "react-icons/fa";
import {BlueModal} from "../../../component/Modal";
import SearchBar from "../../../component/form/SearchBar";
import {addActive, setActiveByIdx} from "../../../functions/other";
import Input from "../../../component/form/Input";
import {DateSingle} from "../../../component/form/DateSingle";
import SelectNumber from "../../../component/form/SelectNumber";
import {formattedWithSeparator} from "../../../functions/math";
import {Switch} from "../../../component/form/Switch";
import Breadcrumb from "../../../component/Breadcrumb";
import {BsThreeDots} from "react-icons/bs";
import {getGatewayMethodEmptyError} from "../../../errors/OrderError";
import {
    DOBBLANK,
    GetDobBlankError,
    GetMobileBlankError,
    GetNameBlankError,
    MOBILEBLANK, MOBILEEXIST,
    NAMEBLANK,
    NAMEEXIST
} from "../../../errors/MemberError";
import Validate from "../../../functions/validate";
import {getSaleHomeAPI} from "../../../context/pos/PosAction";
import {useLocation, useNavigate} from "react-router-dom";
import {ImSpinner6} from "react-icons/im";
import {getReadAPI, postSaleAPI} from "../../../context/Action";

export function Sale() {
    const {auth, setIsLoading, warning, success} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);
    const navigate = useNavigate();

    const initBreadcrumbs = [
        {name: '後台', href: '/admin', current: false},
        {name: '進銷存', href: '/admin/pos', current: false},
        {name: '銷貨', href: '/admin/pos/sale', current: false},
    ];
    const [breadcrumb, setBreadcrumb] = useState(initBreadcrumbs);

    const [cats, setCats] = useState([]);
    // 銷售員
    const [sales, setSales] = useState([]);
    // 付款方式
    const [gateways, setGateways] = useState([]);
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [buys, setBuys] = useState({
        total: 0,
        discount: '0',
        meno: '',
        products: [],
    });
    const [toggleEditProductModalShow, setToggleEditProductModalShow] = useState(false);
    const [toggleProductModalShow, setToggleProductModalShow] = useState(false);
    const [toggleMemberModalShow, setToggleMemberModalShow] = useState(false);
    const [memberKeyword, setMemberKeyword] = useState('');
    const [productKeyword, setProductKeyword] = useState('');

    //const [productFormData, setProductFormData] = useState({});
    // const [mainFormData, setMainFormData] = useState({
    //     total: 0,
    //     discount: 0,
    //     meno: '',
    // });

    var {page, perpage, k, cat_token} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage;

    const [_page, setPage] = useState(page);
    const [startIdx, setStartIdx] = useState((page-1)*perpage + 1);

    const location = useLocation();
    let baseUrl = location.pathname;// /admin/order
    let initParams = {
        backend: true,
    };
    initParams = (k && k.length > 0) ? {...initParams, k: k} : initParams;
    initParams = (cat_token && cat_token.length > 0) ? {...initParams, cat: cat_token} : initParams;
    const [params, setParams] = useState(initParams);

    // 取得所有分費
    const getSaleHome = async (accessToken, page, perpage) => {
        let data = await getSaleHomeAPI(accessToken, page, perpage);
        data = data.data.data;
        console.info(data);
        let cats = data.cats.rows;
        cats = addActive(cats, -1);
        setCats(cats);

        let gateways = data.gateways;
        gateways = addActive(gateways);
        setGateways(gateways);

        let sales = data.sales;
        sales = addActive(sales);
        setSales(sales);

        setIsGetComplete(true);
    }

    useEffect(() => {
        setIsLoading(true);
        if (cat_token) {
            getProducts(cat_token);
        } else {
            getSaleHome(auth.accessToken, page, perpage);
        }
        setIsLoading(false);
    }, [_page, cat_token]);

    const onSubmit = async () => {
        if (buys.length === 0) {
            warning('沒有購買商品，不能結帳');
            return;
        }

        let params ={};

        // 商品資訊
        params["products"] = buys.products.map(buy => {
            return {token: buy.token, quantity: buy.quantity, total: buy.total, price: buy.price, discount: buy.discount};
        })
        //console.info(products);
        //params["products"] = products1;

        // 會員資訊
        const member = members.find(member => member.active === true);
        //console.info(member);
        if (member) {
            params["member_token"] = member.token;
        }

        // 付款方式
        const gateway = gateways.find(gateway => gateway.active === true);
        params['gateway'] = gateway.value;

        // 發票資訊
        if (invoiceFormData.isInvoice === '1') {
            params['invoice'] = {invoice_type: invoiceFormData.invoice_type, invoice_company_name: invoiceFormData.invoice_company_name, invoice_company_tax: invoiceFormData.invoice_company_tax};
        }

        // 業務資訊
        const sale = sales.find(sale => sale.active === true);
        params['sale'] = sale.token;

        params['amount'] = buys.total;
        params['discount'] = buys.discount;
        params['memo'] = buys.memo;

        console.info(JSON.stringify(params));
        setIsLoading(true);
        let data = await postSaleAPI(auth.accessToken, params);
        setIsLoading(false);
        console.info(data);
        if (data.status === 200) {
            success('送出訂單成功');
        }
    }

    // 點擊分類
    const goCat = (token, idx, childrenIdx = -1) => {
        setActiveByIdx(setCats, idx);

        if (cats[idx].children.length === 0 || childrenIdx >= 0) {
            getProducts(token);
        }

        navigate('/pos/sale?cat_token=' + token);
    }

    var editProductIdx = useRef(-1);

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
                res = [...res, {name: item.name, href:'/pos1/sale?cat_token='+item.token, current: false}];
            })

            return [...initBreadcrumbs, ...res];
        })

        let tmp = data.data.rows;
        //console.info(data);
        // 商品加入active的屬性
        tmp = addActive(tmp, -1);

        // 如果在購買清單中，有該分類的商品，則將active改為true
        buys.products.forEach((buy) => {
            tmp = tmp.map((item) => {
                if (item.id === buy.id) {
                    item.active = true;
                }
                return item;
            });
        })
        setProducts(tmp);
        setIsLoading(false);
        setIsGetComplete(true);
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
        buys.products.forEach((buy) => {
            if (buy.id === product.id) {
                isExist = true;
            }
        })
        if (isExist) {
            warning('商品已經在清單中了');
            return;
        }
        // 將商品active設為true
        //setActiveByIdx(setProducts, idx);
        setProducts((prev) => {
            prev[idx].active = true;
            return [...prev];
        })
        const price = products[idx].prices[0].price_member;
        products[idx]["price"] = price;
        products[idx]["quantity"] = 1;
        products[idx]["total"] = products[idx]["price"] * products[idx]["quantity"];
        products[idx]["discount"] = 0;
        //setBuys([...buys, products[idx]]);
        setBuys(prev => {
            return {...prev, total: prev.total + price, products: [...prev.products, products[idx]]}
        })
    }

    // 從購買清單移出該商品
    const deleteProduct = (idx) => {
        const product_id = buys.products[idx].id;
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
        buys.products.splice(idx, 1);
        //setBuys([...buys]);
        setBuys(prev => {
            return {...prev, total: prev.total - product.prices[0].price_member, products: buys.products}
        })
    }

    // 編輯或刪除要買的商品
    const onProduct = (e, type, idx) => {
        if (type === 'update') {
            setToggleEditProductModalShow(true);
            editProductIdx.current = idx;
            //setProductFormData(buys[idx]);
        } else if (type === 'delete') {
            e.stopPropagation();
            deleteProduct(idx);
        }
    }

    // 增加商品數量
    const plus = (idx) => {
        if (buys.products[idx].quantity + 1 > buys.products[idx].stock) {
            warning("數量已經超過庫存數，無法購買");
        } else {
            setBuys(prev => {
                const after = prev.products[idx];
                after.quantity++;
                after.total = after.quantity*after.price;
                prev.products[idx] = after;
                return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
            })
        }
    }

    // 減少商品數量
    const minus = (idx) => {
        if (buys.products[idx].quantity - 1 < 1) {
            warning("購買數量不得少於一個");
        } else {
            setBuys(prev => {
                const after = prev.products[idx];
                after.quantity--;
                after.total = after.quantity*after.price;
                prev.products[idx] = after;
                return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
            })
            // setBuys((prev) => {
            //     prev[editProductIdx.current].quantity--;
            //     prev[editProductIdx.current].total = prev[editProductIdx.current].price * prev[editProductIdx.current].quantity;
            //     return [...prev];
            // })
            // setTotal((prev) => prev - buys[editProductIdx.current].price);
        }
    }

    // 更新購買商品的數量跟價格
    const onCloseEditProduct = () => {
        setToggleEditProductModalShow(false);
    }

    const onChange = (e) => {
        // 會員選擇生日時
        if ('startDate' in e) {
            setMemberFormData((prev) => {
                return {...prev, dob: e.startDate};
            });
            setDob1({startDate: e.startDate, endDate: e.endDate})
            setErrorMsgs((prev) => ({...prev, dob: ''}));
        } else {
            // 搜尋會員時
            if (e.target.id === "member") {
                setMemberKeyword(e.target.value);
            // 搜尋商品時
            } else if (e.target.id === "product") {
                setProductKeyword(e.target.value);
            // 修改單一傷商品的價格跟折扣時
            } else if (e.target.id === 'price' || e.target.id === 'discount1') {
                // 修改單一傷商品的價格時
                if (e.target.id === 'price') {
                    setBuys(prev => {
                        const product = prev.products[editProductIdx.current];
                        product.price = e.target.value;
                        product.total = (product.price - product.discount) * product.quantity;
                        prev.products[editProductIdx.current] = product;
                        return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
                    })
                    // 修改單一傷商品的折扣時
                } else if (e.target.id === 'discount1') {
                    setBuys(prev => {
                        const product = prev.products[editProductIdx.current];
                        product.discount = e.target.value;
                        product.total = (product.price - product.discount) * product.quantity;
                        prev.products[editProductIdx.current] = product;
                        return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
                    })
                }
           // 修改發票時
            } else if (e.target.id === 'invoice_type' || e.target.id === 'invoice_company_name' || e.target.id === 'invoice_company_tax' || e.target.id === 'isSmall' || e.target.id === 'isInvoice') {
                setInvoiceFormData((prev) => {
                    return {...prev, [e.target.id]: e.target.value}
                });
            // 修改所有商品的折扣跟備註時
            } else if (e.target.id === 'discount' || e.target.id === 'memo') {
                if (e.target.id === 'discount') {
                    if (buys.products.length === 0) {
                        warning('購物車無商品，無法設定折扣');
                        return;
                    }

                    if (parseInt(e.target.value) > parseInt(buys.total)) {
                        warning('折扣不能多於總價格');
                        return;
                    }

                    if (e.target.value !== '') {
                        setBuys(prev => {
                            return {...prev, [e.target.id]: e.target.value, total: buys.total - parseInt(e.target.value)};
                        })
                    } else {
                        setBuys(prev => {
                            return {...prev, [e.target.id]: e.target.value};
                        })
                    }
                } else {
                    setBuys(prev => {
                        return {...prev, [e.target.id]: e.target.value}
                    });
                }
            // 修改會員資料時
            } else {
                setMemberFormData((prev) => {
                    return {...prev, [e.target.id]: e.target.value}
                });
            }
            setErrorMsgs((prev) => ({
                ...prev, [e.target.id]: ''
            }));
        }
    }

    const onClear = (e) => {
        if (e in invoiceFormData) {
            setInvoiceFormData((prev) => {
                return {...prev, [e]: ''}
            });
        } else if (e in memberFormData) {
            setMemberFormData(prev => {
                return {...prev, [e]: ''}
            });
        } else if (e === 'discount1' || e === 'price') {
            if (e === 'price') {
                setBuys(prev => {
                    const product = prev.products[editProductIdx.current];
                    product.price = 0;
                    product.total = (product.price - product.discount) * product.quantity
                    prev.products[editProductIdx.current] = product;
                    return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
                });
            } else if (e === 'discount1') {
                setBuys(prev => {
                    const product = prev.products[editProductIdx.current];
                    product.discount = 0;
                    product.total = (product.price - product.discount) * product.quantity
                    prev.products[editProductIdx.current] = product;
                    return {...prev, total: prev.products.reduce(((acc, obj) => acc + obj.total), 0), products: prev.products};
                });
            }
        } else if (e in buys) {
            setBuys(prev => {
                if (e === 'discount') {
                    return {...prev, [e]: '', total: prev.products.reduce(((acc, obj) => acc + obj.total), 0)};
                }
                return {...prev, [e]: ''};
            })
        } else {
            setMemberKeyword('');
            setProductKeyword('');
        }
    }

    // 商品跟會員的搜尋
    // const onSearch = async (type) => {
    //     if (type === 'member') {
    //         if (memberKeyword.length === 0) {
    //             setMembers([]);
    //         } else {
    //             setIsLoading(true);
    //             const data = await searchMember(memberKeyword);
    //             setIsLoading(false);
    //         }
    //         setToggleMemberModalShow(true);
    //     } else if (type === 'product') {
    //         if (productKeyword.length === 0) {
    //             setProducts([]);
    //             warning("請輸入關鍵字");
    //         } else {
    //             setIsLoading(true);
    //             const data = await searchProduct(productKeyword);
    //             setIsLoading(false);
    //         }
    //         setToggleProductModalShow(true);
    //     }
    // }

    // 搜尋會員
    const addMemberFromSearch = async (row) => {
        console.info(row);
        // var params = [];
        // params.push({k: keyword});
        // setMembers(data);
    }

    // 設定搜尋到的會員
    const setMember = (idx) => {
        setToggleMemberModalShow(false);
        setMembers((prev) => {
            var row = prev[idx];
            row = {...row, active: true};
            prev[idx] = row;
            return [...prev];
        })
        setMemberKeyword(members[idx].name);
    }

    // 搜尋商品
    const addProductFromSearch = async (product) => {
        if (typeof product === 'object' && !Array.isArray(product) && product !== null) {
            // 如果已經在購買清單中，無法再加入
            var isExist = false;
            buys.products.forEach((buy) => {
                if (buy.id === product.id) {
                    isExist = true;
                }
            })
            if (isExist) {
                warning('商品已經在清單中了');
            }
            const price = product.prices[0].buyPrice;
            product["price"] = price;
            product["quantity"] = 1;
            product["total"] = product["price"] * product["quantity"];
            product["discount"] = 0;
            setBuys(prev => {
                return {...prev, total: prev.total + price, products: [...prev.products, product]}
            });
        } else if (typeof product === 'string') {
            setParams(prev => {
                return {...prev, k: product};
            });

            const newParams = {k: product};
            const url = makeUrl(newParams);
            navigate(url);
        }
    }

    const makeUrl = (newParams={}) => {
        let arr = {};
        Object.keys(params).forEach(key => {
            if (key !== 'backend') {
                const value = params[key];
                arr = {...arr, [key]: value};
            }
        })
        arr = {...arr, ...newParams};
        let url = `${baseUrl}`;
        Object.keys(arr).forEach((key, idx) => {
            if (arr[key].length > 0) {
                url += `${idx === 0 ? '?' : '&'}${key}=${arr[key]}`;
            }
        })
        console.info(url);
        return url;
    }

    // 設定搜尋到的商品
    const setProduct = (idx) => {
        setToggleProductModalShow(false);
        addProduct(idx);
        setProductKeyword(products[idx].name);
    }

    // 搜尋的會員資料
    const initMemberData = {
        name: '',
        mobile: '',
        dob: ''
    }
    const [memberFormData, setMemberFormData] = useState(initMemberData);
    // 由於calendar的元件，在設定時需要startDate與endDate的字串，所以另外用一個useState來處理
    const [dob1, setDob1] = useState({startDate: memberFormData.dob, endDate: memberFormData.dob,});
    const addMember = async () => {
        const rules = [
            ['name', 'required', {message: GetNameBlankError().msg}],
            ['mobile', 'required', {message: GetMobileBlankError().msg}],
            ['dob', 'required', {message: GetDobBlankError().msg}],
        ];
        var validate = new Validate(memberFormData, rules);
        const isPass = validate.validate();
        if (!isPass) {
            //console.info(validate.errors);
            validate.showErrors(setErrorMsgs);
            return;
        }

        let data = await registerPosAPI(auth.accessToken, memberFormData);
        console.info(data);
        if (data.status === 200) {
            setMemberKeyword(data.data.name);
            data = [{...data.data, active: true}];
            setMembers(data);
            success("新增會員成功");
            setToggleMemberModalShow(false);
        } else {
            var messages = [];

            Object.keys(data['message']).forEach((key) => {
                //console.info(key);
                // 如果錯誤是發生在輸入項當中，就用輸入項的錯誤來顯示
                if (key in errorMsgs) {
                    setErrorMsgs((prev) => ({
                        ...prev, [key]: data['message'][key]
                    }));
                    // 如果錯誤不是發生在輸入項當中，就用錯誤對話盒來顯示
                } else {
                    messages.push(data['message'][key]);
                }
            })
            if (messages.length > 0) {
                warning(messages);
            }
        }

    }

    const [errorMsgs, setErrorMsgs] = useState({
        name: '',
        mobile: '',
        dob: '',
        invoice_company_name: '',
        invoice_company_tax: '',
    });

    const [invoiceFormData, setInvoiceFormData] = useState(
        {invoice_type: 'personal', invoice_company_name: '', invoice_company_tax: '', isSmall: '1', isInvoice: '1'}
    );

    // 設定銷售員
    const setSale = (idx) => {
        setActiveByIdx(setSales, idx);
    }

    // 設定付款方式
    const setGateway = (idx) => {
        setActiveByIdx(setGateways, idx);
    }

    const ResultRow = ({row, idx}) => {
        //console.info(row);
        return (
            <div className='px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                <p>{idx+1}.</p>
                {/*<img src={row.avatar} alt={row.name} className='w-16' />*/}
                <p>{row.name}</p>
                <p>{row.nickname}</p>
            </div>
        )
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
            <div className='flex flex-row'>
                <aside
                    className="scroll-auto z-40 2xl:w-96 w-72 h-screen pt-2 pl-1 pr-1 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
                    aria-label="Sidenav"
                    id="drawer-navigation"
                >
                    <CardWithTitle title='商品' mainClassName="">
                        <div className='text-MyWhite flex flex-row justify-between items-center'>
                            <SearchBar
                                type='product'
                                accessToken={auth.accessToken}
                                value={productKeyword}
                                setSelected={addProductFromSearch}
                                ResultRow={ResultRow}
                            />
                        </div>
                        <UseHr mb="mb-2" mt="mt-4"/>
                        <ul className="">
                            {buys.products.map((product, idx) => (
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
                        <UseHr/>
                        <Input
                            label="折扣："
                            type="number"
                            name="discount"
                            value={buys.discount}
                            id="discount"
                            placeholder="200"
                            onChange={onChange}
                            onClear={onClear}
                            container_className='flex flex-row items-center mt-4 ml-2'
                            input_className='w-64 ml-2'
                        />
                        <Input
                            label="備註："
                            type="text"
                            name="memo"
                            value={buys.memo || ''}
                            id="memo"
                            placeholder=""
                            onChange={onChange}
                            onClear={onClear}
                            container_className='flex flex-row items-center mt-4 ml-2'
                            input_className='w-64 ml-2'
                        />
                        <div className='flex flex-row justify-between items-center px-2'>
                            <span className='text-MyWhite'>總共</span>
                            <span className='text-hot-pink-400 text-xl'>${formattedWithSeparator(buys.total)}元</span>
                        </div>
                        <UseHr/>
                        <div className='px-2'>
                            <PrimaryButton className='w-full' onClick={onSubmit}>結帳</PrimaryButton>
                        </div>
                    </CardWithTitle>
                    <CardWithTitle title='會員' mainClassName="mt-6">
                        <div className='text-MyWhite flex flex-row justify-between items-center'>
                            <SearchBar
                                type='member'
                                accessToken={auth.accessToken}
                                value={memberKeyword}
                                setSelected={addMemberFromSearch}
                                ResultRow={ResultRow}
                            />
                        </div>
                    </CardWithTitle>
                    <CardWithTitle title='發票' mainClassName="mt-6">
                        <Switch label='是否開小票' yesText='是' noText='否' yesValue='1' noValue='0' id='isSmall'
                                value={invoiceFormData.isSmall} onChange={onChange} className='mb-4'/>
                        <Switch label='是否開發票' yesText='是' noText='否' yesValue='1' noValue='0' id='isInvoice'
                                value={invoiceFormData.isInvoice} onChange={onChange} className='mb-4'/>
                        <Switch label='發票類型' yesText='個人' noText='公司' yesValue='personal' noValue='company'
                                id='invoice_type' value={invoiceFormData.invoice_type} onChange={onChange}
                                className={`${invoiceFormData.isInvoice === '1' ? 'block' : 'hidden'}`}/>
                        <div className={`${invoiceFormData.invoice_type === "personal" ? 'hidden' : 'block'}`}>
                            <Input
                                label="公司名稱"
                                type="text"
                                name="invoice_company_name"
                                value={invoiceFormData.invoice_company_name || ''}
                                id="invoice_company_name"
                                placeholder="藍色行動有限公司"
                                isRequired={true}
                                errorMsg={errorMsgs.invoice_company_name}
                                onChange={onChange}
                                onClear={onClear}
                                container_className='mt-4'
                            />
                            <Input
                                label="公司統編"
                                type="text"
                                name="invoice_company_tax"
                                value={invoiceFormData.invoice_company_tax || ''}
                                id="invoice_company_tax"
                                placeholder="53830194"
                                isRequired={true}
                                errorMsg={errorMsgs.invoice_company_tax}
                                onChange={onChange}
                                onClear={onClear}
                            />
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='付款方式' mainClassName="mt-6">
                        <ul className='flex flex-row gap-4 items-center'>
                            <ul className='flex flex-row gap-4 items-center'>
                                {gateways.map((gateway, idx) => (
                                    <li key={gateway.key}
                                        className={`relative inline-flex items-center font-xs justify-center w-12 h-12 overflow-hidden cursor-pointer bg-gray-100 rounded-full text-gray-600 ring ring-gray-500 ${gateway.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800 dark:hover:text-gray-700' : 'dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 dark:hover:text-MyWhite'}`}
                                        onClick={() => setGateway(idx)}
                                    >
                                        <span className="font-medium">{gateway.text}</span>
                                    </li>
                                ))}
                            </ul>
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

                <main className="p-4 w-full h-auto">
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
                {toggleProductModalShow ?
                    <BlueModal isModalShow={toggleProductModalShow}>
                        <BlueModal.Header setIsModalShow={setToggleProductModalShow}>商品</BlueModal.Header>
                        <BlueModal.Body>
                            <div className=''>

                            </div>
                        </BlueModal.Body>
                        <BlueModal.Footer>
                            <PrimaryButton onClick={() => setToggleProductModalShow(false)}>關閉</PrimaryButton>
                            <PrimaryOutlineButton onClick={goCat}>確定</PrimaryOutlineButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}

                {toggleMemberModalShow ?
                    <BlueModal isModalShow={toggleMemberModalShow} width='w-[600px]'>
                        <BlueModal.Header
                            setIsModalShow={setToggleMemberModalShow}>{members.length > 0 ? '搜尋會員' : '新增會員'}</BlueModal.Header>
                        <BlueModal.Body>
                            {members.length > 0 ?
                                <ul className='text-MyWhite'>
                                    {members.map((member, idx) => (
                                        <li key={member.token} className='cursor-pointer'
                                            onClick={() => setMember(idx)}>{member.name}</li>
                                    ))}
                                </ul>
                                :
                                <div>
                                    <div>
                                        <Input
                                            label="姓名"
                                            type="text"
                                            name="name"
                                            value={memberFormData.name || ''}
                                            id="name"
                                            placeholder="王大明"
                                            isRequired={true}
                                            errorMsg={errorMsgs.name}
                                            onChange={onChange}
                                            onClear={onClear}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="手機"
                                            type="text"
                                            name="mobile"
                                            value={memberFormData.mobile || ''}
                                            id="mobile"
                                            placeholder="0932124335"
                                            isRequired={true}
                                            errorMsg={errorMsgs.mobile}
                                            onChange={onChange}
                                            onClear={onClear}
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <DateSingle
                                            label="生日"
                                            name="dob"
                                            value={dob1}
                                            id="dob"
                                            startFrom='1990-01-01'
                                            minDate={new Date('1940-01-01')}
                                            maxDate={new Date()}
                                            onChange={onChange}
                                            position='down'
                                            isRequired={true}
                                            errorMsg={errorMsgs.dob}
                                        />
                                    </div>
                                </div>
                            }
                        </BlueModal.Body>
                        <BlueModal.Footer>
                            <PrimaryButton onClick={addMember}>新增</PrimaryButton>
                            <CancelButton onClick={() => setToggleMemberModalShow(false)}>取消</CancelButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}

                {toggleProductModalShow ?
                    <BlueModal isModalShow={toggleProductModalShow}>
                        <BlueModal.Header setIsModalShow={setToggleProductModalShow}>搜尋商品</BlueModal.Header>
                        <BlueModal.Body>
                            <ul className='text-MyWhite'>
                                {products.map((product, idx) => (
                                    <li key={product.token} className='cursor-pointer'
                                        onClick={() => setProduct(idx)}>{product.name}</li>
                                ))}
                            </ul>
                        </BlueModal.Body>
                        <BlueModal.Footer>
                            <PrimaryButton onClick={() => setToggleProductModalShow(false)}>關閉</PrimaryButton>
                            <PrimaryOutlineButton onClick={goCat}>確定</PrimaryOutlineButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}

                {toggleEditProductModalShow ?
                    <BlueModal isModalShow={toggleEditProductModalShow}>
                        <BlueModal.Header
                            setIsModalShow={setToggleEditProductModalShow}>{buys.products[editProductIdx.current].name}</BlueModal.Header>
                        <BlueModal.Body>
                            <div className='text-MyWhite mb-2'>庫存：<span
                                className='text-Warning-300 text-xl font-bold'>{buys.products[editProductIdx.current].stock}</span>
                            </div>
                            <SelectNumber label="數量" value={buys.products[editProductIdx.current].quantity}  plus={() => plus(editProductIdx.current)} minus={() => minus(editProductIdx.current)}/>
                            <Input
                                label="價格："
                                type="number"
                                name="price"
                                value={buys.products[editProductIdx.current].price || 0}
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
                                name="discount1"
                                value={buys.products[editProductIdx.current].discount}
                                id="discount1"
                                placeholder="200"
                                onChange={onChange}
                                onClear={onClear}
                                container_className='flex flex-row items-center mt-4'
                                input_className='w-64 ml-2'
                            />
                            <div className='text-MyWhite mb-2'>小計：<span
                                className='text-Warning-300 text-xl font-bold ml-2'>${buys.products[editProductIdx.current].total}元</span>
                            </div>
                        </BlueModal.Body>
                        <BlueModal.Footer
                                          handleCancelButton={() => setToggleEditProductModalShow(false)}>
                            <PrimaryButton onClick={onCloseEditProduct}>關閉</PrimaryButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}

            </div>
        )
    }
}
