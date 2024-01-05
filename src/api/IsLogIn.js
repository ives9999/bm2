import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import MenuHeader from "../component/tailwind/MenuHeader";

import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'




//const queryClient = new QueryClient();

// export function IsLogIn() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <IsLogIn1 />
//         </QueryClientProvider>
//     )
// }

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove("token", {
        domain: process.env.REACT_APP_DOMAIN,
        path: '/',
    })
    window.location.reload()
}

const IsLogIn = () => {

    const [member, setMember] = useState({nickname: "", role: ""})
        
    const isAdmin = (() => {
        return member.role === "admin" ? true : false;
    })

    const Admin = () => {
        if (isAdmin) {
            return (
                <Menu.Item key="account">
                {({ active }) => (
                    <a
                    href="/admin"
                    className={classNames(
                        active ? 'text-focusBlue' : '',
                        'block px-4 py-2 text-sm text-gray-700 hover:text-focusBlue'
                    )}
                    >
                    後台
                    </a>
                )}
                </Menu.Item>
            )
        } else {
            return ""
        }
    }


    function GuestGreeting(props) {
        return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
    }
    
    function MemberGreeting(props) {
        return (
            <>
                <Menu as="div" className="relative ml-3">
                    <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-Primary-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                        <ChevronDownIcon className="h-6 w-6 ms-2 text-myWhite" aria-hidden="true" />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-backgroundFocus py-1 shadow-lg ring-1 ring-black ring-opacity-5 border">
                            <Admin />
                            <Menu.Item key="account">
                            {({ active }) => (
                                <a
                                href="/member"
                                className={classNames(
                                    active ? 'text-focusBlue' : '',
                                    'block px-4 py-2 text-sm text-gray-700 hover:text-focusBlue'
                                )}
                                >
                                帳戶
                                </a>
                            )}
                            </Menu.Item>
                            <Menu.Item key="logout">
                            {({ active }) => (
                                <a
                                href="/"
                                className={classNames(
                                    active ? 'text-focusBlue' : '',
                                    'block px-4 py-2 text-sm text-gray-700 hover:text-focusBlue'
                                )}
                                onClick={logout}
                                >
                                登出
                                </a>
                            )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
                {/* <MenuHeader nickname={member.nickname} isAdmin={isAdmin} logout={logout} /> */}
                
                {/* <Link className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="#" onClick={toggleMemberMenu}>{member.nickname}</Link>
                <div className={isMemberToggled ? "form-search p-20 d-block" : " form-search p-20 d-none"} style={menuStyle}>
                    <div className="popular-keywords text-start">
                        <Admin />
                        <div><a className="color-gray-600 mr-10 font-xs" href="/member">帳戶</a></div>
                        <div><Link className="color-gray-600 mr-10 font-xs" href="#" onClick={logout}>登出</Link></div>
                    </div>
                </div> */}
            </>
        )
    }

    function Greeting(props) {
        if (member.nickname !== "") {
            return <MemberGreeting />
        } else {
            return <GuestGreeting />
        }
    }

    // const mutation = useMutation({
    //     mutation: (params) => {
    //         return axios.post(url, params)
    //     }
    // })

    useEffect( () => {
        const cookies = new Cookies();
        var token = cookies.get("token")
        const params = {token: token}
        const url = process.env.REACT_APP_API + "/member/postIsLogIn"
    
        const config = {
            method: "POST",
            Headers: {
                'Content-Type': 'application/json'
            }
        }
        
        axios.post(url, params, config)
        .then(response => {
            // console.info(response)
            if (response.data.success) {
                setMember({nickname: response.data.row.nickname, role: response.data.row.role})
            }
        })
    }, [])
    
    return <Greeting />
}

const MobileMenu = () => {

    const Admin = () => {
            return (
                <Disclosure.Button
                key="admin"
                as="a"
                href="/admin"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                帳戶
                </Disclosure.Button>
            )
    }

    return (
        <>
            <Disclosure.Button
            key="account"
            as="a"
            href="/member"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
            帳戶
            </Disclosure.Button>
            <Disclosure.Button
            key="account"
            as="a"
            onClick = {logout}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
            登出
            </Disclosure.Button>
        </>
    )
}

export { IsLogIn, MobileMenu }