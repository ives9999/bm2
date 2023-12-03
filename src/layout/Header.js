import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import BMContext from "../context/BMContext";
import Button from "../component/Button"
import {logoutAPI} from "../context/member/MemberAction"
import toCookie from "../api/toCookie"
import {memberGetOneAPI} from '../context/member/MemberAction';

const Header = () => {
    const {setIsLoading} = useContext(BMContext)
    var isLogin = false

    const [memberData, setMemberData] = useState({})
    useEffect(() => {
        const data = memberGetOneAPI(toCookie('GET_TOKEN'))
        setMemberData(data)
        //isLogin = (memberData.token !== null && memberData.token !== undefined && memberData.token.trim().length > 0) ? true : false
        setIsLoading(false)
    }, [])
    
    // const isLogin = (memberData.token !== null && memberData.token !== undefined && memberData.token.legnth > 0) ? true : false
    // console.info(isLogin)
    const navigate = useNavigate()

    const pathname = window.location.pathname
    const items = [
        { name: '首頁', href: '/', current: pathname === "/" ? true : false },
        { name: '球隊', href: '/team', current: pathname === "/team" ? true : false },
        { name: '球館', href: '/arena', current: pathname === "/arena" ? true : false },
    ]

    return (
        <>
            <header>
                <nav className="border-gray-200 px-0 lg:px-0 py-2.5">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <a href="https://flowbite.com" className="flex items-center">
                            <img src="/assets/imgs/logo-wide.png" className="max-w-[200px] mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        </a>
                        <div className="flex items-center lg:order-2">
                            {isLogin && (<div>
                            <button type="button" className="!mr-4 flex mx-3 text-sm bg-Primary rounded-full md:mr-0 focus:ring-4" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
                                <span className="sr-only">Open user menu</span>
                                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                            </button>        
                                <div className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown">
                                    <div className="py-3 px-4">
                                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">Neil sims</span>
                                        <span className="block text-sm font-light text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                                    </div>
                                    <ul className="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                                        <li>
                                            <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-Primary dark:text-gray-400 dark:hover:text-white">My profile</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Account settings</a>
                                        </li>
                                    </ul>
                                    <ul className="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                                        <li>
                                            <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><svg className="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg> My likes</a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><svg className="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg> Collections</a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                <span className="flex items-center">
                                                    <svg className="mr-2 w-5 h-5 text-primary-600 dark:text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg> Pro version
                                                </span>
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                            </a>
                                        </li>
                                        
                                    </ul>
                                    <ul className="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                                        <li>
                                            <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>)}
                            <Button onClick={()=>navigate("/member/login")}>登入</Button>
                            {isLogin && (
                            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            )}
                        </div>
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
