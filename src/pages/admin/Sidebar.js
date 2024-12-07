import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { BsArrowLeftCircle, BsNewspaper } from 'react-icons/bs'
import { RiProductHuntLine } from "react-icons/ri"
import { BsCart4 } from "react-icons/bs"
import { RiTeamLine } from "react-icons/ri";
import { TiHomeOutline } from "react-icons/ti"
import { FaAngleUp, FaAngleDown, FaRegUser } from "react-icons/fa6";
import { TbBrandAirtable, TbCategory } from "react-icons/tb";
import Logo from '../../component/Logo'
import HamburgerButton from '../../component/HamburgerMenuButton/HamburgerButton'
import {FaSignInAlt, FaTruck} from "react-icons/fa";

const Sidebar = () => {
    const [open, setOpen] = useState(true)
    const [mobileMenu, setMobileMenu] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();

    // /admin/member
    const getKey = () => {
        const path = location.pathname;//console.info(path);
        /*eslint no-useless-escape: "error"*/
        const re = /([^/\s]+)\/?([^/\s]*)\/?(.*)/;
        const found = path.match(re);
        var key = null
        if (found.length > 0) {
            key = found[2];
        }
        return key
    }


    useEffect(() => {
        const key = getKey();
        // console.info("key: " + key);
        // setPosition(key);
        toggleMenu(key);

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [location.pathname]);

    const initMenus = [
        { key: 'member', title: '會員', path: '/admin/member', src: <FaRegUser />, attribute: 'menu', active: false, children: [
            {key: 'member_read', title: '列表', path: '/admin/member', attribute: 'link', active: false,},
            {key: 'member_create', title: '新增', path: '/admin/member/update', attribute: 'link', active: false,},
        ]},
        { key: 'product', title: '商品', path: '/admin/produce', src: <RiProductHuntLine />, attribute: 'menu', active: false, children: [
            {key: 'product_read', title: '列表', path: '/admin/product', attribute: 'link', active: false,},
            {key: 'product_create', title: '新增', path: '/admin/product/update', attribute: 'link', active: false,},
        ]},
        { key: 'cart', title: '購物車', path: '/admin/cart', src: <BsCart4 />, attribute: 'menu', active: false, children: [
            {key: 'order_read', title: '列表', path: '/admin/cart', attribute: 'link', active: false,},
        ]},
        { key: 'order', title: '訂單', path: '/admin/order', src: <BsCart4 />, attribute: 'menu', active: false, children: [
            {key: 'order_read', title: '列表', path: '/admin/order', attribute: 'link', active: false,},
        ]},
        { key: 'team', title: '球隊', path: '/admin/team', src: <RiTeamLine />, attribute: 'menu', active: false, },
        { key: 'brand', title: '品牌', path: '/admin/brand', src: <TbBrandAirtable />, attribute: 'menu', active: false, children: [
            {key: 'brand_read', title: '列表', path: '/admin/brand', attribute: 'link', active: false,},
            {key: 'brand_create', title: '新增', path: '/admin/brand/update', attribute: 'link', active: false,},
        ]},
        { key: 'cat', title: '分類', path: '/admin/cat', src: <TbCategory />, attribute: 'menu', active: false, children: [
            {key: 'cat_read', title: '列表', path: '/admin/cat', attribute: 'link', active: false,},
            {key: 'cat_create', title: '新增', path: '/admin/cat/update', attribute: 'link', active: false,},
        ]},
        { key: 'supplier', title: '供應商', path: '/admin/supplier', src: <FaTruck />, attribute: 'menu', active: false, children: [
            {key: 'supplier_read', title: '列表', path: '/admin/supplier', attribute: 'link', active: false,},
            {key: 'supplier_create', title: '新增', path: '/admin/supplier/update', attribute: 'link', active: false,},
        ]},
        { key: 'buy', title: '進貨', path: '/admin/buy', src: <FaSignInAlt />, attribute: 'menu', active: false, children: [
            {key: 'buy_read', title: '列表', path: '/admin/buy', attribute: 'link', active: false,},
            {key: 'buy_create', title: '新增', path: '/admin/buy/update', attribute: 'link', active: false,},
        ]},
        { key: 'pos', title: 'pos', path: '/admin/pos', src: <BsNewspaper />, attribute: 'menu', active: false, children: [
            {key: 'pos_member', title: '匯入會員', path: '/admin/pos/member', attribute: 'link', active: false,},
            {key: 'pos_member_sync', title: '會員同步', path: '/admin/pos/memberSync', attribute: 'link', active: false,},
            {key: 'pos_product_cat', title: '匯入商品分類', path: '/admin/pos/productCat', attribute: 'link', active: false,},
            {key: 'pos_product', title: '匯入商品', path: '/admin/pos/product', attribute: 'link', active: false,},
            {key: 'pos_order', title: '匯入訂單', path: '/admin/pos/order', attribute: 'link', active: false,},
            {key: 'pos_order_sn', title: '匯入單一訂單', path: '/admin/pos/orderByNumber', attribute: 'link', active: false,},
            {key: 'pos_gateway_method', title: '匯入付款方式', path: '/admin/pos/gatewayMethod', attribute: 'link', active: false,},
            {key: 'pos_cashier', title: '匯入收銀員', path: '/admin/pos/cashier', attribute: 'link', active: false,},
        ]},
        { key: 'pos1', title: 'pos系統', path: '/pos', src: <BsNewspaper />, attribute: 'link', gap: true, active: false, },
        { key: 'home', title: '前台首頁', path: '/', src: <TiHomeOutline />, attribute: 'link', gap: false, active: false, },
    ]

    const arrow = (key) => {
        var item = menus.filter((menu) => menu.key === key)
        if (item.length > 0) {
            item = item[0]
        }
        if (item.children !== undefined && item.children !== null && item.children.length > 0) {
            return item.active ? <FaAngleUp /> : <FaAngleDown/>
        } else {
            return ''
        }
    }

    const [menus, setMenus] = useState(initMenus)

    const toggle = (key) => {
        //toggleMenu(key);
        const item = menus.filter(menu => menu.key === key)[0]
        if (item.attribute === 'link') {
            navigate(item.path);
        } else {
            toggleMenu(key);
        }
    }

    const toggleMenu = (key) => {
        setMenus((prev) => {
            const a = [];
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].key === key) {
                    prev[i].active = !prev[i].active;
                } else {
                    if (prev[i].active === true) {
                        prev[i].active = false
                    }
                }
                a.push(prev[i])
            }
            return [...a];
        });
    }

    const toPage = (link) => {
        navigate(link);
    }

    return (
        <>
            <div
                className={`${
                open ? 'w-64' : 'w-fit'
                } hidden sm:block relative duration-300 bg-PrimaryBlock-950 border-r border-gray-600 p-5`}
            >
                <BsArrowLeftCircle
                    className={`${
                        !open && 'rotate-180'
                    } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
                    onClick={() => setOpen(!open)}
                />
                <div className={`flex ${open && 'gap-x-4'} items-center`}>
                    {open && (
                        <Logo url="/" width='150' />
                    )}
                </div>

                <ul className='pt-6
                 transition-[height] duration-900 ease-out
                '>
                {menus.map((menu) => (
                    <li
                        key={menu.key}
                        className={
                            `p-3 text-base font-[400] rounded-lg cursor-pointer text-MyWhite hover:bg-gray-700
                            ${menu.gap ? 'mt-9' : 'mt-2'} 
                            ${menu.active &&'bg-gray-700'}`
                        }
                    >
                        <div className={
                            `flex flex-row items-center p-3 text-base font-[400] round-lg cursor-pointer hover:bg-gray-700 
                            ${menu.gap ? 'mt-9' : 'mt-2'}
                            ${menu.active &&'bg-gray-700'}`
                            }
                            onClick={() => (toggle(menu.key))}
                        >
                            <span className='text-slate-300 mr-4'>{menu.src}</span>
                            <span
                                className={`${
                                    !open && 'hidden'
                                } origin-left duration-300 hover:block`}
                                >
                                {menu.title}
                            </span>
                            <span className="ml-auto" aria-hidden="true"></span>
                            <span className=''>
                                {arrow(menu.key)}
                            </span>
                        </div>
                        <ul className={`py-2 ${menu.active ? 'block' : 'hidden'}`}>
                        {menu.children && menu.children.map((submenu) => (
                            <li key={submenu.key} className='text-MyWhite font-[400] text-base leading-6 pl-11 p-2 rounded-lg cursor-pointer flex hover:bg-gray-700'
                                onClick={() => toPage(submenu.path)}
                            >
                                {submenu.title}
                            </li>
                        ))}
                        </ul>
                    </li>
                ))}
                </ul>
            </div>
            {/* Mobile Menu */}
            <div className="pt-3">
                <HamburgerButton
                setMobileMenu={setMobileMenu}
                mobileMenu={mobileMenu}
                />
            </div>
            {/*<div className="sm:hidden">*/}
            {/*    <div*/}
            {/*        className={`${*/}
            {/*            mobileMenu ? 'flex' : 'hidden'*/}
            {/*        } absolute z-50 flex-col self-end mt-16 space-y-6 font-bold sm:w-auto text-MyWhite bg-PrimaryBlock-900 drop-shadow md rounded-xl`}*/}
            {/*    >*/}
            {/*        <ul className='pt-6*/}
            {/*            transition-[height] duration-900 ease-out*/}
            {/*        '>*/}
            {/*        {menus.map((menu) => (*/}
            {/*            <div className='cursor-pointer' onClick={() => (toggle(menu.key))} key={menu.key}>*/}
            {/*                <li*/}
            {/*                    className={*/}
            {/*                        `flex items-center gap-x-4 p-3 text-base font-[400] rounded-lg cursor-pointer text-MyWhite hover:bg-gray-700*/}
            {/*                        ${menu.gap ? 'mt-9' : 'mt-2'} */}
            {/*                        ${menu.active && 'bg-gray-700'}`*/}
            {/*                    }*/}
            {/*                >*/}
            {/*                    <span className='text-slate-300'>{menu.src}</span>*/}
            {/*                    <span*/}
            {/*                        className={` ${*/}
            {/*                        menu.active &&*/}
            {/*                        'bg-gray-700'*/}
            {/*                        } p-2 rounded-xl hover:bg-gray-700`}*/}
            {/*                    >*/}
            {/*                        {menu.title}*/}
            {/*                    </span>*/}
            {/*                    <span className="ml-auto" aria-hidden="true"></span>*/}
            {/*                    <span className=''>*/}
            {/*                        {arrow(menu.key)}*/}
            {/*                    </span>*/}
            {/*                </li>*/}
            {/*                <ul className={`py-2 ${menu.active ? 'block' : 'hidden'}`}>*/}
            {/*                    {menu.children && menu.children.map((submenu) => (*/}
            {/*                        <li key={submenu.key} className='text-MyWhite font-[400] text-base leading-6 pl-11 p-2 rounded-lg cursor-pointer flex hover:bg-gray-700'>*/}
            {/*                            <Link to={submenu.path} className=''>*/}
            {/*                                {submenu.title}*/}
            {/*                            </Link>*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}

export default Sidebar