import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";
// import { IsLogIn, MobileMenu } from "../api/IsLogIn";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

const Logo = styled.img`
    max-width: 200px;
`;

//cookie
const cookies = new Cookies();
var page = cookies.get("page")
if (page === undefined) {
    page = "home";
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove("token", {
        domain: process.env.REACT_APP_DOMAIN,
        path: '/',
    })
    window.location.reload()
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Header = ({ handleOpen, handleRemove, openClass }) => {
    
    // State to keep track of the scroll position
    const [scroll, setScroll] = useState(0);
    // Effect hook to add a scroll event listener

    const [member, setMember] = useState({
      nickname: "", 
      role: "", 
      avatar: "",
      isLogin: false
    })

    useEffect(() => {

        const cookies = new Cookies();
        var token = cookies.get("token")
        console.info("token is " + token)

        if (token !== undefined) {
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
                if (response.data.success) {
                    console.info("response is " + response.data)
                    setMember({
                        nickname: response.data.row.nickname, 
                        role: response.data.row.role, 
                        avatar: process.env.REACT_APP_ASSETS_DOMAIN + response.data.row.avatar,
                        isLogin: true})
                    //console.info(member.nickname)
                } else {
                    const msgs = response.data.msgs
                    var res = ""
                    for (var i = 0; i < msgs.length; i++) {
                        res = res + msgs[i] + "\n";
                    }
                    // console.info(res)
                }
            })
        }
        // Callback function to handle the scroll event
        const handleScroll = () => {
            // Check if the current scroll position is greater than 100 pixels
            const scrollCheck = window.scrollY > 100;

            // Update the 'scroll' state only if the scroll position has changed
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        };

        // Add the 'handleScroll' function as a scroll event listener
        document.addEventListener("scroll", handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // State to represent whether something is toggled or not
    const [isToggled, setToggled] = useState(false);

    // Function to toggle the value of 'isToggled'
    const toggleTrueFalse = () => setToggled(!isToggled);
        
    // State to track the active status and key
    const [isActive, setIsActive] = useState({
        status: false,
        key: page,
    });

    // Function to handle toggling the active status based on the given key
    const handleToggle = (key) => {

        cookies.set('page', key, {
            domain: process.env.REACT_APP_DOMAIN,
            expire: 60*60*24*30*365*10,
            path: '/',
            secure: 0,
        })
        // Check if the current key matches the active key in the state
        if (isActive.key === key) {
            // If the current key matches, set the active status to false
            setIsActive({
                status: false,
            });
        } else {
            // If the current key does not match, set the active status to true and update the key
            setIsActive({
                status: true,
                key,
            });
        }
    };

    // const user = {
    //     name: 'Tom Cook',
    //     email: 'tom@example.com',
    //     imageUrl:
    //       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //   }
      const navigation = [
        { name: '首頁', href: '/', current: true },
        { name: '球隊', href: '/team', current: false },
        { name: '球館', href: '/arena', current: false },
      ]

    //   const userNavigation = [
    //     { name: 'Your Profile', href: '#' },
    //     { name: 'Settings', href: '#' },
    //     { name: 'Sign out', href: '#' },
    //   ]


    return (
        <>
        <div className="min-h-full">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Logo className="logo-night" alt={process.env.REACT_APP_TITLE} src="/assets/imgs/logo-wide.png"/>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-focusBlue hover:text-focusBlue'
                                : 'text-menuTextWhite hover:bg-gray-700 hover:text-focusBlue',
                              'rounded-md px-3 py-2 text-menuText font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <Big member = {member} />
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <ChevronDownIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <Small member = {member} />
                
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

      </div>     
        </>
    );
  }

  function BigGuest(props) {
    return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
}

function BigMember({member}) {
    return (
        <>
            <Menu as="div" className="relative ml-3">
                <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-myPrimary px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <img className="h-8 w-8 rounded-full" src={member.avatar} alt="" />
                        <span className="text-myWhite ms-2">{member.nickname}</span>
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
                        <BigAdmin member = {member} />
                        <Menu.Item key="account">
                        {({ active }) => (
                            <a
                            href="/member"
                            className={classNames(
                                active ? 'text-focusBlue' : '',
                                'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
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
                                'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
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

function Big({member}) {
    console.info("Big is " + member.isLogin)
    if (member.isLogin) {
        return <BigMember member = {member} />
    } else {
        return <BigGuest />
    }
}

function SmallGuest() {
    return (
        <>
            <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                    <a className="btn btn-linear sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
                </div>
            </div>
        </>
    )
}

function SmallMember({member}) {
    return (
        <>
            <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={member.avatar} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{member.nickname}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <SmallAdmin member = {member} />
                    <Disclosure.Button
                        key="account"
                        as="a"
                        href="/member"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                        帳戶
                    </Disclosure.Button>
                    <Disclosure.Button
                        key="logout"
                        as="a"
                        href={logout}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                        登出
                    </Disclosure.Button>
                  </div>
                </div>
        </>
    )
}

function Small({member}) {
    if (member.isLogin) {
        return <SmallMember member = {member} />
    } else {
        return <SmallGuest />
    }
}

const BigAdmin = ({member}) => {
    if (member.role === 'admin') {
        return (
            <Menu.Item key="account">
            {({ active }) => (
                <a
                href="/admin"
                className={classNames(
                    active ? 'text-focusBlue' : '',
                    'block px-4 py-2 text-sm text-menuTextWhite hover:text-focusBlue'
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

const SmallAdmin = ({member}) => {
    if (member.role === 'admin') {
        return (
            <Disclosure.Button
                key="admin"
                as="a"
                href="/admin"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
                後台
            </Disclosure.Button>
        )
    } else {
        return ""
    }
}

  export default Header  
