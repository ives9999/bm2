import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import BMContext from "../context/BMContext";
import {PrimaryButton} from "../component/MyButton"
import {logoutAPI} from "../context/member/MemberAction"

const Header = () => {
    const {memberData, isLogin} = useContext(BMContext)
    const navigate = useNavigate()

    const {nickname, email, avatar} = memberData

    const logout = (e) => {
        e.preventDefault()
        logoutAPI()
        window.location.reload()
    }

    const pathname = window.location.pathname
    const items = [
        { name: '首頁', href: '/', current: pathname === "/" ? true : false },
        { name: '球隊', href: '/team', current: pathname === "/team" ? true : false },
        { name: '球館', href: '/arena', current: pathname === "/arena" ? true : false },
    ]

    const memberItems = [
        {name: '會員首頁', href: '/member',},
        {name: '會員資料', href: '/member/register',},
        {name: '頭像', href: '/member/avatar',},
        {name: '更換密碼', href: '/changePassword',},
    ]

    return (
        <>
            <header>
            <nav className="px-4 lg:px-6 py-4">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="flex items-center">
                        <img src="/assets/imgs/logo-wide.png" className="max-w-[250px] mr-3 h-6 sm:h-9" alt={process.env.REACT_APP_TITLE} />
                    </a>

                    <div className={`
                        ${!isLogin ? "lg:order-3" : "hidden"}
                    `}>
                        <PrimaryButton onClick={()=>navigate("/member/login")}>登入</PrimaryButton>
                    </div>

                    <div className={` 
                        ${isLogin ? "flex items-center lg:order-2" : "hidden"}
                    `}>
                        {/* <div id="tooltip-dark" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                            Toggle dark mode
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div> */}
                        {/* <div id="tooltip-statistics" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                            View analytics
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div> */}
                        <button type="button" className="flex mx-3 text-sm md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
                            {/* <span className="sr-only">Open user menu</span> */}
                            <img className="w-10 h-9 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500" src={avatar} alt={nickname} />
                        </button>
                        <div className="hidden z-50 my-4 w-56 text-base list-none bg-MenuBG border border-MenuBorder rounded-lg divide-y divide-MenuDivider shadow" id="dropdown">
                            <div className="py-3 px-4">
                                <span className="block text-sm font-semibold text-MyWhite">{nickname}</span>
                                <span className="block text-sm font-light truncate text-gray-400">{email}</span>
                            </div>
                            <ul className="py-1 font-light text-MyWhite" aria-labelledby="dropdown">
                                {memberItems.map(memberItem => 
                                    <li key={memberItem.name}>
                                        <a href={memberItem.href} className="block py-2 px-4 text-sm hover:text-Primary-300">{memberItem.name}</a>
                                    </li>                            
                                )}
                            </ul>
                            <ul className="py-1 font-light" aria-labelledby="dropdown">
                                <li>
                                    <button onClick={logout} className="w-full block py-2 px-4 text-sm text-MyWhite hover:text-Primary-300">登出</button>
                                </li>
                            </ul>
                        </div>
                        <a href="/" onClick={logout} className="text-primary-600 dark:text-MyWhite ml-1 lg:ml-3 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">登出</a>
                        <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {items.map(item => (
                                <li key={item.name}>
                                    <a href={item.href} className={`
                                        block px-10 py-1 text-xm
                                        ${item.current ? "rounded-full bg-Primary-300 text-MyBlack" : "text-MyWhite hover:rounded-full hover:bg-Primary-300 hover:text-MyBlack"}
                                    `}>
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
            </header>
        </>
    )
}

  export default Header  
