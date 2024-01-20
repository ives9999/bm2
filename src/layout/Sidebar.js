import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { BsArrowLeftCircle } from 'react-icons/bs'
import { FaRegUser } from "react-icons/fa6"
import { RiProductHuntLine } from "react-icons/ri"
import { BsCart4 } from "react-icons/bs"
import { RiTeamLine } from "react-icons/ri";
import { TiHomeOutline } from "react-icons/ti"
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import Logo from '../component/Logo'
import HamburgerButton from '../component/HamburgerMenuButton/HamburgerButton'

const Sidebar = () => {
    const [open, setOpen] = useState(true)
    const [mobileMenu, setMobileMenu] = useState(false)
    const location = useLocation()

    // /admin/member
    const getKey = () => {
        const path = location.pathname
        const re = /^\/admin\/(.*)$/;
        const found = path.match(re);
        var key = null
        if (found.length > 0) {
            key = found[1];
        }
        return key
    }

    const key = getKey()

    const initMenus = [
        { key: 'member', title: '會員', path: '/admin/member', src: <FaRegUser />, active: (key === 'member') ? true : false, children: [
            {key: 'member_read', title: '列表', path: '/admin/member', active: false,},
            {key: 'member_create', title: '新增', path: '/admin/member/edit', active: false,},
        ]},
        { key: 'product', title: '商品', path: '/admin/produce', src: <RiProductHuntLine />, active: (key === 'product') ? true : false, children: [
            {key: 'product_read', title: '列表', path: '/admin/product', active: false,},
            {key: 'product_create', title: '新增', path: '/admin/product/edit', active: false,},
        ]},
        { key: 'order', title: '訂單', path: '/admin/order', src: <BsCart4 />, active: false, },
        { key: 'team', title: '球隊', path: '/admin/team', src: <RiTeamLine />, active: false, },
        { key: 'home', title: '前台首頁', path: '/', src: <TiHomeOutline />, gap: 'true', active: false, },
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
        setMenus((prev) => {
            var a = []
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].key === key) {
                    prev[i].active = !prev[i].active
                } else {
                    if (prev[i].active === true) {
                        prev[i].active = false
                    }
                }
                a.push(prev[i])
            }
            
            return a
        })
    }

    return (
        <>
            <div
                className={`${
                open ? 'w-64' : 'w-fit'
                } hidden sm:block relative h-screen duration-300 bg-PrimaryBlock-950 border-r border-gray-600 p-5`}
            >
                <BsArrowLeftCircle
                    className={`${
                        !open && 'rotate-180'
                    } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
                    onClick={() => setOpen(!open)}
                />
                <div className={`flex ${open && 'gap-x-4'} items-center`}>
                    {open && (
                        <Logo url="/admin" width='150' />
                    )}
                </div>

                <ul className='pt-6
                 transition-[height] duration-900 ease-out
                '>
                {menus.map((menu) => (
                    <div className='cursor-pointer' onClick={() => (toggle(menu.key))} key={menu.key}>
                        <li
                            className={
                                `flex items-center gap-x-4 p-3 text-base font-[400] rounded-lg cursor-pointer text-MyWhite hover:bg-gray-700
                                ${menu.gap ? 'mt-9' : 'mt-2'} 
                                ${menu.active &&'bg-gray-700'}`
                            }
                        >
                            <span className='text-slate-300'>{menu.src}</span>
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
                        </li>
                        <ul className={`py-2 ${menu.active ? 'block' : 'hidden'}`}>
                            {menu.children && menu.children.map((submenu) => (
                                <li key={submenu.key} className='text-MyWhite font-[400] text-base leading-6 pl-11 p-2 rounded-lg cursor-pointer flex hover:bg-gray-700'>
                                    <Link to={submenu.path} className=''>
                                        {submenu.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
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
            <div className="sm:hidden">
                <div
                    className={`${
                        mobileMenu ? 'flex' : 'hidden'
                    } absolute z-50 flex-col self-end mt-16 space-y-6 font-bold sm:w-auto text-MyWhite bg-PrimaryBlock-900 drop-shadow md rounded-xl`}
                >
                <ul className='pt-6
                    transition-[height] duration-900 ease-out
                '>
                {menus.map((menu) => (
                    <div className='cursor-pointer' onClick={() => (toggle(menu.key))} key={menu.key}>
                        <li
                            className={
                                `flex items-center gap-x-4 p-3 text-base font-[400] rounded-lg cursor-pointer text-MyWhite hover:bg-gray-700
                                ${menu.gap ? 'mt-9' : 'mt-2'} 
                                ${menu.active && 'bg-gray-700'}`
                            }
                        >
                            <span className='text-slate-300'>{menu.src}</span>
                            <span
                                className={` ${
                                menu.active &&
                                'bg-gray-700'
                                } p-2 rounded-xl hover:bg-gray-700`}
                            >
                                {menu.title}
                            </span>
                            <span className="ml-auto" aria-hidden="true"></span>
                            <span className=''>
                                {arrow(menu.key)}
                            </span>
                        </li>
                        <ul className={`py-2 ${menu.active ? 'block' : 'hidden'}`}>
                            {menu.children && menu.children.map((submenu) => (
                                <li key={submenu.key} className='text-MyWhite font-[400] text-base leading-6 pl-11 p-2 rounded-lg cursor-pointer flex hover:bg-gray-700'>
                                    <Link to={submenu.path} className=''>
                                        {submenu.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                </ul>
                </div>
            </div>
        </>
    )
}

export default Sidebar