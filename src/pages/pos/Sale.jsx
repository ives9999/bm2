import {CardWithTitle, JustTitleCard} from "../../component/Card";
import React, {useContext, useEffect, useState} from "react";
import BMContext from "../../context/BMContext";
import useQueryParams from "../../hooks/useQueryParams";
import {getReadAPI as getCatReadAPI} from "../../context/cat/CatAction";
import {getReadAPI as getProductReadAPI} from "../../context/product/ProductAction";
import {getReadAPI as getMemberReadAPI} from "../../context/member/MemberAction";
import UseHr from "../../component/UseHr";
import {PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../component/MyButton";
import { FaTimesCircle } from "react-icons/fa";
import {BlueModal} from "../../component/Modal";
import SearchBar from "../../component/form/searchbar/SearchBar";
import {addActive, setActiveByIdx} from "../../functions/other";

export function Sale() {
    const {auth, isLoading, setIsLoading, warning} = useContext(BMContext)
    const [imBusy, setImBusy] = useState(true);

    const [cats, setCats] = useState([]);
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [buys, setBuys] = useState([]);
    const [total, setTotal] = useState(0);
    const [toggleProductModalShow, setToggleProductModalShow] = useState(false);
    const [toggleMemberModalShow, setToggleMemberModalShow] = useState(false);
    const [memberKeyword, setMemberKeyword] = useState('');
    const [productKeyword, setProductKeyword] = useState('');

    var { page, perpage, k } = useQueryParams();
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

    const getProducts = async(token) => {
        setIsLoading(true);
        const params = [{cat: token}];
        var data = await getProductReadAPI(page, perpage, params);
        data = data.data.rows;
        //console.info(data);
        data = addActive(data);
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

    const addProduct = (idx) => {
        const product = products[idx];
        var isExist = false;
        buys.forEach((buy) => {
            if (buy.id === product.id) {
                isExist = true;
            }
        })
        if (!isExist) {
            setActiveByIdx(setProducts, idx);
            products[idx]["quantity"] = 1;
            setBuys([...buys, products[idx]]);
            setTotal((prev) => prev + products[idx].prices[0].price_member);
        } else {
            warning('商品已經在清單中了');
        }
    }

    const deleteProduct = (idx) => {
        buys.splice(idx, 1);
        setBuys([...buys]);
        setTotal((prev) => prev - products[idx].prices[0].price_member);
    }

    const onChange = (e) => {
        if (e.target.name === "member") {
            setMemberKeyword(e.target.value);
        } else if (e.target.name === "product") {
            setProductKeyword(e.target.value);
        }
    }

    const handleClear = (e) => {
        setMemberKeyword('');
        setProductKeyword('');
    }

    const handleSearch = async (type) => {
        if (type === 'member') {
            setIsLoading(true);
            const data = await searchMember(memberKeyword);
            setIsLoading(false);
        } else if (type === 'product') {
            setIsLoading(true);
            const data = await searchProduct(productKeyword);
            setIsLoading(false);

        }
    }

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
        setToggleMemberModalShow(true);
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
        setToggleProductModalShow(true);
    }

    const setProduct = (idx) => {
        setToggleProductModalShow(false);
        addProduct(idx);
        setProductKeyword(products[idx].name);
    }

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

    if (isLoading || imBusy) { return <div className='text-MyWhite'>Loading</div>}
    else {return (
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
                    <UseHr />
                    <ul className="">
                        {buys.map((product, idx) => (
                            <li key={product.token + "_" + idx} className='hover:bg-gray-700 cursor-pointer'
                                onClick={() => {
                                    setToggleProductModalShow(true)
                                }}>
                                <div className='flex flex-row justify-between items-center px-2 py-6'>
                                    <div className='flex flex-row gap-4 items-center'>
                                        <div className='text-MyWhite'>{product.name}</div>
                                        <div className='text-gray-200'>x{product.quantity}</div>
                                    </div>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <div
                                            className='text-hot-pink-400 text-xl font-bold mr-4'>${product.prices[0].price_member}</div>
                                        <FaTimesCircle className='w-6 h-6 text-Warning-500 cursor-pointer'
                                                       onClick={() => deleteProduct(idx)}/>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <UseHr/>
                    <div className='flex flex-row justify-between items-center px-2'>
                        <span className='text-MyWhite'>總共</span>
                        <span className='text-MyWhite'>${total}</span>
                    </div>
                    <UseHr/>
                    <div className='px-2'>
                        <PrimaryButton className='w-full'>結帳</PrimaryButton>
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
                        <PrimaryOutlineButton onClick={() => handleSearch('member')}>搜尋</PrimaryOutlineButton>
                    </div>
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
                <div className='mb-8 grid grid-cols-4 gap-4 xl:grid-cols-8 xl:gap-10'>
                    {cats.map((cat, idx) => (
                        <div key={cat.token} className={`flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-100 ${cat.active ? 'dark:bg-Success-400 dark:hover:bg-Success-300 dark:text-gray-800' : 'dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800 dark:text-white'}`}
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
                                <div className={`text-l ${product.active ? 'text-Success-100': 'text-Success-200'}`}>庫存：{product.stock}</div>
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
                <BlueModal isModalShow={toggleMemberModalShow}>
                    <BlueModal.Header setIsModalShow={setToggleMemberModalShow}>會員</BlueModal.Header>
                    <BlueModal.Body>
                        <ul className='text-MyWhite'>
                            {members.map((member, idx) => (
                                <li key={member.token} className='cursor-pointer' onClick={() => setMember(idx)}>{member.name}</li>
                            ))}
                        </ul>
                    </BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleMemberModalShow(false)}>關閉</PrimaryButton>
                        <PrimaryOutlineButton onClick={goCat}>確定</PrimaryOutlineButton>
                    </BlueModal.Footer>
                </BlueModal>
                : ''}

            {toggleProductModalShow ?
                <BlueModal isModalShow={toggleProductModalShow}>
                    <BlueModal.Header setIsModalShow={setToggleProductModalShow}>商品</BlueModal.Header>
                    <BlueModal.Body>
                        <ul className='text-MyWhite'>
                            {products.map((product, idx) => (
                                <li key={product.token} className='cursor-pointer' onClick={() => setProduct(idx)}>{product.name}</li>
                            ))}
                        </ul>
                    </BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleProductModalShow(false)}>關閉</PrimaryButton>
                        <PrimaryOutlineButton onClick={goCat}>確定</PrimaryOutlineButton>
                    </BlueModal.Footer>
                </BlueModal>
                : ''}

        </div>
    )
    }
}
