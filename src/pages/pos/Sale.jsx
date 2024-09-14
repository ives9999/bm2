import {CardWithTitle, JustTitleCard} from "../../component/Card";
import React, {useContext, useEffect, useRef, useState} from "react";
import BMContext from "../../context/BMContext";
import useQueryParams from "../../hooks/useQueryParams";
import {getReadAPI as getCatReadAPI} from "../../context/cat/CatAction";
import {getReadAPI as getProductReadAPI} from "../../context/product/ProductAction";
import {getReadAPI as getMemberReadAPI} from "../../context/member/MemberAction";
import UseHr from "../../component/UseHr";
import {PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../component/MyButton";
import {FaTimesCircle} from "react-icons/fa";
import {BlueModal} from "../../component/Modal";
import SearchBar from "../../component/form/searchbar/SearchBar";
import {addActive, setActiveByIdx} from "../../functions/other";
import Input from "../../component/form/Input";
import {DateSingle} from "../../component/form/DateSingle";
import SelectNumber from "../../component/form/SelectNumber";
import {formattedWithSeparator} from "../../functions/math";
import {Switch} from "../../component/form/Switch";
import Breadcrumb from "../../layout/Breadcrumb";

export function Sale() {
    const {auth, isLoading, setIsLoading, warning} = useContext(BMContext)
    const [imBusy, setImBusy] = useState(true);

    const initBreadcrumbs = [
        {name: '主分類', href: '/pos/sale', current: false},
    ];
    const [breadcrumb, setBreadcrumb] = useState(initBreadcrumbs);

    const [cats, setCats] = useState([]);
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [buys, setBuys] = useState([]);
    const [total, setTotal] = useState(0);
    const [toggleEditProductModalShow, setToggleEditProductModalShow] = useState(false);
    const [toggleProductModalShow, setToggleProductModalShow] = useState(false);
    const [toggleMemberModalShow, setToggleMemberModalShow] = useState(false);
    const [memberKeyword, setMemberKeyword] = useState('');
    const [productKeyword, setProductKeyword] = useState('');

    const [productForm, setProductForm] = useState({});

    var {page, perpage, k} = useQueryParams();
    var params = {backend: true};
    if (k !== undefined && k.length > 0) {
        params = {...params, ...{k: k}};
    }
    //console.info("1.:" + JSON.stringify(params));
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const [_page, setPage] = useState(page);

    const getCats = async (page, perpage) => {
        var data = await getCatReadAPI(page, perpage);
        data = data.data.rows;
        //console.info(data);
        data = addActive(data);

        setCats(data)
        setImBusy(false);
    }

    useEffect(() => {
        setIsLoading(true);
        getCats(page, perpage);
        setIsLoading(false);
    }, [_page]);

    const goCat = (token, idx) => {
        setActiveByIdx(setCats, idx);
        getProducts(token);
    }

    var editProductIdx = useRef(-1);

    // 取得分類下的商品
    const getProducts = async (token) => {
        setIsLoading(true);
        const params = [{cat_token: token}];
        var data = await getProductReadAPI(page, perpage, params);
        data = data.data.rows;
        //console.info(data);
        // 商品加入active的屬性
        data = addActive(data);

        // 如果在購買清單中，有該分類的商品，則將active改為true
        buys.forEach((buy) => {
            data = data.map((item) => {
                if (item.id === buy.id) {
                    item.active = true;
                }
                return item;
            });
        })
        setProducts(data);
        setIsLoading(false);
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
        //setActiveByIdx(setProducts, idx);
        setProducts((prev) => {
            prev[idx].active = true;
            return [...prev];
        })
        const price = products[idx].prices[0].price_member;
        products[idx]["price"] = price;
        products[idx]["quantity"] = 1;
        products[idx]["total"] = products[idx]["price"] * products[idx]["quantity"];
        setBuys([...buys, products[idx]]);
        setTotal((prev) => prev + price);
    }

    // 從購買清單移出該商品
    const deleteProduct = (idx) => {
        const product_id = buys[idx].id;
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
        setTotal((prev) => prev - products[idx].prices[0].price_member);
    }

    // 編輯或刪除要買的商品
    const handleProduct = (e, type, idx) => {
        if (type === 'update') {
            setToggleEditProductModalShow(true);
            editProductIdx.current = idx;
            setProductForm(buys[idx]);
        } else if (type === 'delete') {
            e.stopPropagation();
            deleteProduct(idx);
        }
    }

    // 增加商品數量
    const plus = () => {
        const selectedProduct = products.find((product) => productForm.id === product.id);
        if (productForm.quantity + 1 > selectedProduct.stock) {
            warning("數量已經超過庫存數，無法購買");
        } else {
            setProductForm((prev) => ({...prev, quantity: prev.quantity + 1, total: prev.price * (prev.quantity + 1)}));
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
        if (productForm.quantity - 1 < 1) {
            warning("購買數量不得少於一個");
        } else {
            setProductForm((prev) => ({...prev, quantity: prev.quantity - 1, total: prev.price * (prev.quantity - 1)}));
            // setBuys((prev) => {
            //     prev[editProductIdx.current].quantity--;
            //     prev[editProductIdx.current].total = prev[editProductIdx.current].price * prev[editProductIdx.current].quantity;
            //     return [...prev];
            // })
            // setTotal((prev) => prev - buys[editProductIdx.current].price);
        }
    }

    // 更新購買商品的數量跟價格
    const handleUpdateBuy = () => {
        setToggleEditProductModalShow(false);
        const idx = buys.findIndex(item => item.id === productForm.id);
        const prevTotal = buys[idx].total;
        setBuys((prev) => {
            prev[idx] = productForm;
            return [...prev];
        });

        setTotal(prev => {
            return prev - prevTotal + productForm.total;
        });
    }

    const onChange = (e) => {
        if (e.target.name === "member") {
            setMemberKeyword(e.target.value);
        } else if (e.target.name === "product") {
            setProductKeyword(e.target.value);
        } else if (e.target.name === 'price') {
            setProductForm((prev) => {
                return {...prev, [e.target.id]: e.target.value, total: prev.quantity * e.target.value}
            })
        } else if (e.target.id === 'invoice_type' || e.target.id === 'invoice_company_name' || e.target.id === 'invoice_company_tax' || e.target.id === 'isSmall' || e.target.id === 'isInvoice') {
            setInvoiceFormData((prev) => {
                return {...prev, [e.target.id]: e.target.value}
            });
        } else {
            setMemberFormData((prev) => {
                return {...prev, [e.target.id]: e.target.value}
            });
        }
    }

    const handleClear = (e) => {
        if (e === 'invoice_type' || e === 'invoice_company_name' || e === 'invoice_company_tax') {
            setInvoiceFormData((prev) => {
                return {...prev, [e]: ''}
            });
        } else {
            setMemberKeyword('');
            setProductKeyword('');
        }
    }

    // 商品跟會員的搜尋
    const handleSearch = async (type) => {
        if (type === 'member') {
            if (memberKeyword.length === 0) {
                setMembers([]);
            } else {
                setIsLoading(true);
                const data = await searchMember(memberKeyword);
                setIsLoading(false);
            }
            setToggleMemberModalShow(true);
        } else if (type === 'product') {
            if (productKeyword.length === 0) {
                setProducts([]);
                warning("請輸入關鍵字");
            } else {
                setIsLoading(true);
                const data = await searchProduct(productKeyword);
                setIsLoading(false);
            }
            setToggleProductModalShow(true);
        }
    }

    // 搜尋會員
    const searchMember = async (keyword) => {
        var params = [];
        params.push({k: keyword});
        var data = await getMemberReadAPI(auth.accessToken, 1, 20, params);
        console.info(data);
        data = data.data.data.rows;
        data = data.map((row) => {
            return {...row, active: false};
        })
        setMembers(data);
    }

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
    const searchProduct = async (keyword) => {
        var params = [];
        params.push({k: keyword});
        var data = await getProductReadAPI(auth.accessToken, 1, 20, params);
        console.info(data);
        data = data.data.rows;
        data = data.map((row) => {
            return {...row, active: false};
        })
        setProducts(data);
    }

    const setProduct = (idx) => {
        setToggleProductModalShow(false);
        addProduct(idx);
        setProductKeyword(products[idx].name);
    }

    // 銷售員
    const initSales = [
        {key: 'wei', name: '偉哲', active: false},
        {key: 'abc', name: '小孟', active: false},
        {key: 'reny', name: '小朱', active: false},
        {key: 'ives', name: '孫', active: false},
    ];

    const [sales, setSales] = useState(initSales);

    const setSale = (idx) => {
        setActiveByIdx(setSales, idx);
    }

    // 付款方式
    const initGateways = [
        {key: 'cash', name: '現金', active: false},
        {key: 'linePay', name: 'line pay', active: false},
        {key: 'credit', name: '信用卡', active: false},
        {key: 'other', name: '其他', active: false},
    ];

    const [gateways, setGateways] = useState(initGateways);

    const setGateway = (idx) => {
        setActiveByIdx(setGateways, idx);
    }

    // 搜尋的會員資料
    const [memberFormData, setMemberFormData] = useState({});
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

    if (isLoading || imBusy) {
        return <div className='text-MyWhite'>Loading</div>
    } else {
        return (
            <div>
                <aside
                    className="fixed top-0 left-0 z-40 w-96 h-screen pt-16 pl-1 pr-1 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
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
                                onClear={handleClear}
                            />
                            <PrimaryOutlineButton onClick={() => handleSearch('product')}>搜尋</PrimaryOutlineButton>
                        </div>
                        <UseHr mb="mb-2" mt="mt-4" />
                        <ul className="">
                            {buys.map((product, idx) => (
                                <li key={product.token + "_" + idx} className='hover:bg-gray-700 cursor-pointer mb-4'
                                    onClick={(e) => {
                                        handleProduct(e,'update', idx)
                                    }}>
                                    <div className='flex flex-row justify-between items-center px-2 py-2'>
                                        <div className='text-MyWhite'>{product.name}</div>

                                        <div className='flex flex-row items-center'>
                                            <div className='flex flex-col mr-4'>
                                                <div className='text-gray-200 text-right font-bold text-2xl'>{product.quantity}</div>
                                                <div
                                                    className='text-hot-pink-400 text-xl'>${formattedWithSeparator(product.total)}</div>
                                            </div>
                                            <FaTimesCircle className='w-6 h-6 text-Warning-500 cursor-pointer'
                                                           onClick={(e) => handleProduct(e, 'delete', idx)}/>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <UseHr/>
                        <div className='flex flex-row justify-between items-center px-2'>
                            <span className='text-MyWhite'>總共</span>
                            <span className='text-hot-pink-400 text-xl'>${formattedWithSeparator(total)}元</span>
                        </div>
                        <UseHr/>
                        <div className='px-2'>
                            <PrimaryButton className='w-full'>結帳</PrimaryButton>
                        </div>
                    </CardWithTitle>
                    <CardWithTitle title='發票' mainClassName="mt-6">
                        <Switch label='是否開小票' yesText='是' noText='否' yesValue='1' noValue='0' id='isSmall' value={invoiceFormData.isSmall} onChange={onChange} className='mb-4' />
                        <Switch label='是否開發票' yesText='是' noText='否' yesValue='1' noValue='0' id='isInvoice' value={invoiceFormData.isInvoice} onChange={onChange} className='mb-4' />
                        <Switch label='發票類型' yesText='個人' noText='公司' yesValue='personal' noValue='company' id='invoice_type' value={invoiceFormData.invoice_type} onChange={onChange} className={`${invoiceFormData.isInvoice === '1' ? 'block' : 'hidden'}`} />
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
                            onClear={handleClear}
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
                            onClear={handleClear}
                        />
                        </div>
                    </CardWithTitle>

                    <CardWithTitle title='會員' mainClassName="mt-6">
                        <div className='text-MyWhite flex flex-row justify-between items-center'>
                            <SearchBar
                                name="member"
                                value={memberKeyword}
                                placeholder="請輸入關鍵字"
                                handleChange={onChange}
                                onClear={handleClear}
                            />
                            <PrimaryOutlineButton
                                onClick={() => handleSearch('member')}>搜尋/新增</PrimaryOutlineButton>
                        </div>
                    </CardWithTitle>
                    <CardWithTitle title='付款方式' mainClassName="mt-6">
                        <ul className='flex flex-row gap-4 items-center'>
                            <ul className='flex flex-row gap-4 items-center'>
                                {gateways.map((gateway, idx) => (
                                    <li key={gateway.key}
                                        className={`relative inline-flex items-center justify-center w-14 h-14 overflow-hidden cursor-pointer bg-gray-100 rounded-full text-gray-600 ring ring-gray-500 ${gateway.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800 dark:hover:text-gray-700' : 'dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 dark:hover:text-MyWhite'}`}
                                        onClick={() => setGateway(idx)}
                                    >
                                        <span className="font-medium">{gateway.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </ul>
                    </CardWithTitle>
                    <CardWithTitle title='業務' mainClassName="mt-6">
                        <ul className='flex flex-row gap-4 items-center'>
                            {sales.map((sale, idx) => (
                                <li key={sale.key}
                                    className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden cursor-pointer bg-gray-100 rounded-full text-gray-600 ring ring-gray-500 ${sale.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800 dark:hover:text-gray-700' : 'dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 dark:hover:text-MyWhite'}`}
                                    onClick={() => setSale(idx)}
                                >
                                    <span className="font-medium">{sale.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardWithTitle>
                </aside>

                <main className="p-4 md:ml-96 h-auto pt-20">
                    <Breadcrumb items={breadcrumb}/>
                    <div className='mb-8 grid grid-cols-4 gap-4 xl:grid-cols-8 xl:gap-10'>
                        {cats.map((cat, idx) => (
                            <div key={cat.token}
                                 className={`flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-100 ${cat.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800' : 'dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800 dark:text-white'}`}
                                 onClick={() => goCat(cat.token, idx)}>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight">{cat.name}</h5>
                            </div>
                        ))}
                    </div>
                    <UseHr/>
                    <div className='mb-8 grid grid-cols-4 gap-4 xl:grid-cols-8 xl:gap-10'>
                        {products.map((product, idx) => (
                            <div key={product.token}
                                 className={`flex flex-col justify-center p-2 bg-white border-2 border-dashed border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${product.active ? 'dark:bg-PrimaryBlock-500' : ' dark:bg-PrimaryBlock-700 dark:border-PrimaryBlock-500 dark:hover:bg-PrimaryBlock-800'}`}
                                 onClick={() => addProduct(idx)}
                            >
                                <h5 className={`mb-2 text-base font-bold tracking-tight text-gray-900 ${product.active ? 'dark:text-MyBlack' : ' dark:text-white'}`}>{product.name}</h5>
                                <div className='flex flex-row items-center justify-between'>
                                    <div
                                        className={`text-l ${product.active ? 'text-Success-100' : 'text-Success-200'}`}>庫存：{product.stock}</div>
                                    <div
                                        className={`text-xl font-bold ${product.active ? 'text-hot-pink-200' : 'text-hot-pink-400'}`}>${product.prices[0].price_member}</div>
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
                        <BlueModal.Body height='h-[600px]'>
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
                                            onClear={handleClear}
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
                                            onClear={handleClear}
                                        />
                                    </div>
                                    <DateSingle
                                        label="生日"
                                        name="dob"
                                        value={memberFormData.dob}
                                        id="dob"
                                        minDate={new Date('1940-01-01')}
                                        maxDate={new Date()}
                                        onChange={onChange}
                                        position='down'
                                    />
                                </div>
                            }
                        </BlueModal.Body>
                        <BlueModal.Footer>
                            <PrimaryButton onClick={() => setToggleMemberModalShow(false)}>關閉</PrimaryButton>
                            <PrimaryOutlineButton onClick={goCat}>確定</PrimaryOutlineButton>
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
                        <BlueModal.Header setIsModalShow={setToggleEditProductModalShow}>{buys[editProductIdx.current].name}</BlueModal.Header>
                        <BlueModal.Body>
                            <div className='text-MyWhite mb-2'>庫存：<span
                                className='text-Warning-300 text-xl font-bold'>{buys[editProductIdx.current].stock}</span>
                            </div>
                            <SelectNumber label="數量" value={productForm.quantity} plus={plus} minus={minus}/>
                            <Input
                                label="價格："
                                type="text"
                                name="price"
                                value={productForm.price}
                                id="price"
                                placeholder="200"
                                onChange={onChange}
                                onClear={handleClear}
                                container_className='flex flex-row items-center mt-4'
                                input_className='w-64 ml-2'
                            />
                            <div className='text-MyWhite mb-2'>小計：<span
                                className='text-Warning-300 text-xl font-bold ml-2'>${productForm.total}元</span>
                            </div>
                        </BlueModal.Body>
                        <BlueModal.Footer isShowCancelButton={true}
                                          handleCancelButton={() => setToggleEditProductModalShow(false)}>
                        <PrimaryButton onClick={handleUpdateBuy}>更新</PrimaryButton>
                        </BlueModal.Footer>
                    </BlueModal>
                    : ''}

            </div>
        )
    }
}
