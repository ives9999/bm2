import { useContext, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import BMContext from '../context/BMContext'
import {PrimaryButton} from '../component/MyButton'
import Logo from '../component/Logo'
import MemberMenu from "../component/MemberMenu";
import { GiHamburgerMenu } from "react-icons/gi";
import MobileDrawer from "../component/MobileDrawer";
import { logoutAPI } from "../context/member/MemberAction";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
    const {auth, setAuth} = useContext(BMContext)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const isLogin = (Object.keys(auth).length === 0) ? false : true;

    //const {nickname, email, avatar, role} = memberData

    const cart = () => {
        navigate("/member/cart")
    }

    const logout = () => {
        logoutAPI(setAuth)
        // localStorage.clear();
        // setAuth({});
    
        //window.location.reload()
    }

    const pathname = window.location.pathname
    const items = [
        { name: '首頁', href: '/', current: pathname === "/" ? true : false },
        { name: '商品', href: '/product', current: pathname === "/product" ? true : false },
        { name: '球隊', href: '/team', current: pathname === "/team" ? true : false },
        { name: '球館', href: '/arena', current: pathname === "/arena" ? true : false },
    ]

    const mobileMenu = () => {
        setIsDrawerOpen(prev => !prev);
    }

    return (
        <header>
            <nav className="px-4 lg:px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mx-auto max-w-screen-xl">
                    <Logo url="/" />
                    {/* desktop menu */}
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {items.map(item => (
                                <li key={item.name}>
                                    <Link to={item.href} className={`
                                        block px-10 py-1 text-xm
                                        ${item.current ? "rounded-full bg-Primary-300 text-MyBlack" : "text-MyWhite hover:rounded-full hover:bg-Primary-300 hover:text-MyBlack"}
                                    `}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* mobile menu */}
                    <div className='flex items-center lg:hidden mt-2 justify-end'>
                        {isLogin 
                        ?
                            <>
                            <div className="flex gap-2 items-center mr-3">
                                <MemberBlock auth={auth} logout={logout} cart={cart} />
                            </div>
                            <GiHamburgerMenu className="mr-2 w-7 h-7 text-MyWhite" onClick={()=>mobileMenu()} />
                            <MobileDrawer 
                                items={items} 
                                isOpen={isDrawerOpen}
                                setIsOpen={setIsDrawerOpen}
                            />
                            </>
                        :
                            <div className="flex items-center gap-2">
                                <GiHamburgerMenu className="mr-2 w-7 h-7 text-MyWhite" onClick={()=>mobileMenu()} />
                                <MobileDrawer 
                                    items={items} 
                                    isOpen={isDrawerOpen}
                                    setIsOpen={setIsDrawerOpen}
                                />
                                <PrimaryButton onClick={()=>navigate("/member/login")}>登入</PrimaryButton>
                            </div>
                        }
                    </div>
                    
                    {/* desktop menu */}
                    <div className='pr-4 hidden lg:block'>
                        {isLogin ?
                            <MemberBlock auth={auth} logout={logout} cart={cart} />
                        :
                            <div>
                                <PrimaryButton onClick={()=>navigate("/member/login")}>登入</PrimaryButton>
                            </div>
                        }
                    </div>

                    {/* <div className={` 
                        ${isLogin ? "flex items-center lg:order-2" : "hidden"}
                    `}>
                        <button type="button" className="flex mx-3 text-sm md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
                            <img className="w-10 h-9 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500" src={auth.avatar} alt={auth.nickname} />
                        </button>
                        <div className="hidden z-50 my-4 w-56 text-base list-none bg-PrimaryBlock-950 border border-PrimaryBlock-800 rounded-lg divide-y divide-MenuDivider shadow" id="dropdown">
                            <div className="py-3 px-4">
                                <span className="block text-sm font-semibold text-MyWhite">{auth.nickname}</span>
                                <span className="block text-sm font-light truncate text-gray-400">{auth.email}</span>
                            </div>
                            <ul className="py-1 font-light text-MyWhite" aria-labelledby="dropdown">
                                {memberItems.map(memberItem => 
                                    <li key={memberItem.name}>
                                        <Link to={memberItem.href} className="block py-2 px-4 text-sm hover:text-Primary-300">{memberItem.name}</Link>
                                    </li>                            
                                )}
                            </ul>
                            <ul className="py-1 font-light" aria-labelledby="dropdown">
                                <li>
                                    <button onClick={logout} className="w-full block py-2 px-4 text-sm text-MyWhite hover:text-Primary-300">登出</button>
                                </li>
                            </ul>
                        </div>
                        <Link to="/" onClick={logout} className="text-primary-600 dark:text-MyWhite ml-1 lg:ml-3 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">登出</Link>
                        <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div> */}

                    
                </div>
            </nav>
        </header>
    )
}

export default Header

function MemberBlock({auth, logout, cart}) {
    return (
        <div className="flex lg:gap-4 items-center">
            {auth.hasCart ?
                <FaShoppingCart className="w-6 h-6 text-white mr-4 cursor-pointer" onClick={cart} />
                : ''
            }
            <div>
                <MemberMenu 
                    avatar={auth.avatar}
                    nickname={auth.nickname}
                    email={auth.email}
                    role={auth.role}
                    logout={logout}
                />
            </div>
            <div className="h-6 flex items-center bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-Primary-400 border border-Primary-400">{auth.nickname}</div>
        </div>
    )
}
