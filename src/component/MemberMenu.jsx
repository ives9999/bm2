import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {useNavigate} from 'react-router-dom';
import { RiHomeOfficeLine, RiLockPasswordLine, RiAdminLine } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";
import { RxAvatar } from "react-icons/rx";
import { IoLogOutOutline } from "react-icons/io5";
import UseHr from './UseHr';

export default function MemberMenu({
    avatar,
    nickname,
    email,
    role,
    logout,
}) {
    const navigate = useNavigate();
    const memberItems = [
        {key: 'member_home', name: '會員首頁', href: '/member',},
        {key: 'member_register', name: '會員資料', href: '/member/register',},
        {key: 'member_avatar', name: '頭像', href: '/member/avatar',},
        {key: 'member_password', name: '更改密碼', href: '/member/changePassword',},
    ]
    // console.info(memberItems);

    if (role === 'admin') {
        memberItems.unshift({key: 'member_admin', name: '後台', href: '/admin',})
    }

    const onClick = (key) => {
        const active = memberItems.filter((item) => item.key === key);
        const href = active[0].href;
        navigate(href);
        //console.info(href);
    }

    return (
        <div className="text-right">
        <Menu as="div" className="relative inline-block text-left">
            <div>
            <Menu.Button className="inline-flex w-full justify-center items-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <img className="w-10 h-9 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500" src={avatar} alt={nickname} />
                <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
                />
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
                <Menu.Items className="absolute right-0 mt-2 p-3 w-56 origin-top-right rounded-md bg-PrimaryBlock-950 border border-PrimaryBlock-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-[100]">
                    <div className="text-rabbit-200 p-2">{nickname}</div>
                    <div className="text-rabbit-200 p-2">{email}</div>
                    <UseHr mt='mt-2' mb='mb-2' />
                    {memberItems.map((item) => (
                        <Menu.Item key={item.name} className='px-1 py-1'>
                            {({ active }) => (
                            <button
                                className={`${
                                active ? 'bg-PrimaryBlock-800 text-rabbit-50' : 'text-rabbit-300'
                                } group mb-1 flex w-full items-center rounded-md px-2 py-2 text-sm =`}
                                onClick={() => onClick(item.key)}
                            >
                                <Icon name={item.key} />
                                {item.name}
                            </button>
                            )}
                        </Menu.Item>
                    ))}
                    <UseHr mt='mt-2' mb='mb-2' />
                    <Menu.Item key='logout' className='px-1 py-1'>
                        {({ active }) => (
                        <button
                            className={`${
                                active ? 'bg-PrimaryBlock-800 text-rabbit-50' : 'text-rabbit-300'
                                } group mb-1 flex w-full items-center rounded-md px-2 py-2 text-sm =`}
                            onClick={() => logout()}
                        >
                            <IoLogOutOutline className='mr-2 h-5 w-5 text-Primary-500' />
                            登出
                        </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
        </div>
    )
}

function Icon({name}) {
    const wh = 'mr-2 h-5 w-5 text-Primary-500';
    if (name === 'member_home') {
        return (<RiHomeOfficeLine className={`${wh}`} />);
    } else if (name === 'member_register') {
        return (<CgDatabase className={`${wh}`} />);    
    } else if (name === 'member_avatar') {
        return (<RxAvatar className={`${wh}`} />);
    } else if (name === 'member_password') {
        return (<RiLockPasswordLine className={`${wh}`} />);
    } else if (name === 'member_admin') {
        return (<RiAdminLine className={`${wh}`} />);
    } else {
        return (<RiHomeOfficeLine className={`${wh}`} />);
    }
}

