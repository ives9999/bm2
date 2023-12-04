import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import BMContext from "../context/BMContext";
import Button from "../component/Button"
import {logoutAPI} from "../context/member/MemberAction"
import toCookie from "../api/toCookie"
import {memberGetOneAPI} from '../context/member/MemberAction';

const Header = () => {
    const {setIsLoading, memberData, setMemberData} = useContext(BMContext)
    // const isLoginRef = useRef(false)
    //var isLogin = false

    
    useEffect(() => {
        const token = toCookie('GET_TOKEN')
        if (token.length > 0) {
            const getMemberData = async (token) => {
                const data = await memberGetOneAPI(token)
                setMemberData(data.data)
            }
            getMemberData(token)
        } else {
            setMemberData({
                nickname: '',
                email: '',
                avatar: '',
                token: token
            })
        }
        setIsLoading(false)
    }, [])

    const {nickname, email, avatar, token} = memberData

    const logout = (e) => {
        e.preventDefault()
        logoutAPI()
    }
    
    const navigate = useNavigate()

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
            <nav className="px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="flex items-center">
                        <img src="/assets/imgs/logo-wide.png" className="max-w-[200px] mr-3 h-6 sm:h-9" alt={process.env.REACT_APP_TITLE} />
                    </a>
                    {(token !== null && token !== undefined && token.trim().length > 0) ? (
                    <div className="flex items-center lg:order-2">
                        <div id="tooltip-dark" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                            Toggle dark mode
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <div id="tooltip-statistics" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                            View analytics
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button type="button" className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src={process.env.REACT_APP_ASSETS_DOMAIN + avatar} alt={nickname} />
                        </button>
                            <div className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown">
                            <div className="py-3 px-4">
                                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{nickname}</span>
                                <span className="block text-sm font-light text-gray-500 truncate dark:text-gray-400">{email}</span>
                            </div>
                            <ul className="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                                {memberItems.map(memberItem => 
                                    <li key={memberItem.name}>
                                        <a href={memberItem.href} className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">{memberItem.name}</a>
                                    </li>                            
                                )}
                            </ul>
                            <ul className="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                                <li>
                                    <button onClick={logout} className="w-full block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">登出</button>
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
                    ) : (
                    <div className="flex items-center lg:order-2">
                        <Button onClick={()=>navigate("/member/login")}>登入</Button>
                    </div>
                    )}
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {items.map(item => (
                                <li key={item.name}>
                                    <a href={item.href} className={`
                                        block px-10 py-1 text-xm
                                        ${item.current ? "rounded-full bg-Primary text-MyBlack" : "text-MyWhite hover:rounded-full hover:bg-Primary hover:text-MyBlack"}
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

// function BigGuest(props) {
//     return <a className="rounded-md bg-Primary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" href="/member/login">登入</a>
// }

// function BigMember({member, logout}) {
//     return (
//         <>
//             <Menu as="div" className="relative ml-3">
//                 <div>
//                     <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-Primary py-2 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                         <span className="absolute -inset-1.5" />
//                         <img className="h-8 w-8 rounded-full" src={member.avatar} alt="" />
//                         <span className="text-myBlack ms-2">{member.nickname}</span>
//                         <ChevronDownIcon className="h-6 w-6 ms-2 text-myBlack" aria-hidden="true" />
//                     </Menu.Button>
//                 </div>
//                 <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                 >
//                     <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-backgroundFocus py-1 shadow-lg ring-1 ring-black ring-opacity-5 border">
//                         <BigAdmin member = {member} />
//                         <Menu.Item key="home">
//                         {({ active }) => (
//                             <a
//                             href="/member"
//                             className={classNames(
//                                 active ? 'text-focusBlue' : '',
//                                 'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                             )}
//                             >
//                             會員首頁
//                             </a>
//                         )}
//                         </Menu.Item>
//                         <Menu.Item key="account">
//                         {({ active }) => (
//                             <a
//                             href="/member/register"
//                             className={classNames(
//                                 active ? 'text-focusBlue' : '',
//                                 'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                             )}
//                             >
//                             會員資料
//                             </a>
//                         )}
//                         </Menu.Item>
//                         <Menu.Item key="avatar">
//                         {({ active }) => (
//                             <a
//                             href="/member/avatar"
//                             className={classNames(
//                                 active ? 'text-focusBlue' : '',
//                                 'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                             )}
//                             >
//                             頭像
//                             </a>
//                         )}
//                         </Menu.Item>
//                         <Menu.Item key="change_password">
//                         {({ active }) => (
//                             <a
//                             href="/member/changePassword"
//                             className={classNames(
//                                 active ? 'text-focusBlue' : '',
//                                 'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                             )}
//                             >
//                             更換密碼
//                             </a>
//                         )}
//                         </Menu.Item>
//                         <Menu.Item key="logout">
//                         {({ active }) => (
//                             <a
//                             href="/"
//                             className={classNames(
//                                 active ? 'text-focusBlue' : '',
//                                 'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                             )}
//                             onClick={logout}
//                             >
//                             登出
//                             </a>
//                         )}
//                         </Menu.Item>
//                     </Menu.Items>
//                 </Transition>
//             </Menu>
//             {/* <MenuHeader nickname={member.nickname} isAdmin={isAdmin} logout={logout} /> */}
            
//             {/* <Link className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="#" onClick={toggleMemberMenu}>{member.nickname}</Link>
//             <div className={isMemberToggled ? "form-search p-20 d-block" : " form-search p-20 d-none"} style={menuStyle}>
//                 <div className="popular-keywords text-start">
//                     <Admin />
//                     <div><a className="color-gray-600 mr-10 font-xs" href="/member">帳戶</a></div>
//                     <div><Link className="color-gray-600 mr-10 font-xs" href="#" onClick={logout}>登出</Link></div>
//                 </div>
//             </div> */}
//         </>
//     )
// }

// function Big({member}) {
//     // console.info("Big is " + member.isLogin)
//     if (member.isLogin) {
//         return <BigMember member = {member} />
//     } else {
//         return <BigGuest />
//     }
// }

// function SmallGuest() {
//     return (
//         <>
//             <div className="border-t border-gray-700 pb-3 pt-4">
//                 <div className="flex items-center px-5">
//                     <a className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" href="/member/login">登入</a>
//                 </div>
//             </div>
//         </>
//     )
// }

// function SmallMember({member, logout}) {
//     return (
//         <>
//             <div className="border-t border-gray-700 pb-3 pt-4">
//                   <div className="flex items-center px-3">
//                     <div className="flex-shrink-0">
//                       <img className="h-10 w-10 rounded-full" src={member.avatar} alt="" />
//                     </div>
//                     <div className="ml-3">
//                       <div className="text-base font-medium leading-none text-myBlack">{member.nickname}</div>
//                     </div>
//                   </div>
//                   <div className="mt-3 space-y-1 px-2">
//                     <SmallAdmin member = {member} />
//                     <Disclosure.Button
//                         key="home"
//                         as="a"
//                         href="/member"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//                     >
//                         會員首頁
//                     </Disclosure.Button>
//                     <Disclosure.Button
//                         key="account"
//                         as="a"
//                         href="/member/register"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//                     >
//                         會員資料
//                     </Disclosure.Button>
//                     <Disclosure.Button
//                         key="avatar"
//                         as="a"
//                         href="/member/avatar"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//                     >
//                         頭像
//                     </Disclosure.Button>
//                     <Disclosure.Button
//                         key="change_password"
//                         as="a"
//                         href="/member/changePassword"
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//                     >
//                         更換密碼
//                     </Disclosure.Button>
//                     <Disclosure.Button
//                         key="logout"
//                         as="a"
//                         href={logout}
//                         className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//                     >
//                         登出
//                     </Disclosure.Button>
//                   </div>
//                 </div>
//         </>
//     )
// }

// function Small({member}) {
//     if (member.isLogin) {
//         return <SmallMember member = {member} />
//     } else {
//         return <SmallGuest />
//     }
// }

// const BigAdmin = ({member}) => {
//     if (member.role === 'admin') {
//         return (
//             <Menu.Item key="account">
//             {({ active }) => (
//                 <a
//                 href="/admin"
//                 className={classNames(
//                     active ? 'text-focusBlue' : '',
//                     'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
//                 )}
//                 >
//                 後台
//                 </a>
//             )}
//             </Menu.Item>
//         )
//     } else {
//         return ""
//     }
// }

// const SmallAdmin = ({member}) => {
//     if (member.role === 'admin') {
//         return (
//             <Disclosure.Button
//                 key="admin"
//                 as="a"
//                 href="/admin"
//                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
//             >
//                 後台
//             </Disclosure.Button>
//         )
//     } else {
//         return ""
//     }
// }

  export default Header  
