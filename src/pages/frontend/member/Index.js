import { React, useContext } from "react";
import BMContext from "../../../context/BMContext";
import { UserCircleIcon, PhotoIcon, LockClosedIcon, ShieldCheckIcon, SquaresPlusIcon, PencilSquareIcon, ShoppingCartIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '../../../component/Breadcrumb'
import {Link, useNavigate} from 'react-router-dom';
import {HeroCard} from '../../../component/Card'
import {animated, useSpring} from "@react-spring/web";
import { FaHistory } from "react-icons/fa";

const Index1 = () => {
    const {auth} = useContext(BMContext);
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: '會員', href: '/member', current: true },
    ]

    const validate = auth.validate
    const style = "h-10 w-10"

    // const [springs, api] = useSpring(() =>({
    //     from: {x: 0},
    // }));
    // const onClick = () => {
    //     api.start({
    //         from: {x: 0},
    //         to: {x: 100},
    //     });
    // }

    const initSpringFrom = {from: {transform: 'rotate(0deg)'}};
    var items = [
        {key: 'register', title: '會員資料', content: '檢視或修改會員姓名、暱稱、email等基本資料', link: '/member/register', icon: UserCircleIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'order', title: '購買紀錄', content: '查詢你曾在羽球密碼購買的訂單詳細資料', link: '/member/order', icon: FaHistory, spring: useSpring(()=>(initSpringFrom))},
        {key: 'card', title: '購物車', content: '查詢你購物車的內容', link: '/member/cart', icon: ShoppingCartIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'avatar', title: '上傳/更新 頭像', content: '上傳或更新您的頭像，方便其他使用者容易辨認出你', link: '/member/avatar', icon: PhotoIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'moreData', title: '會員更多資料', content: '註冊會員更多的資訊，例如性別、生日、住址等等！！', link: '/member/moreData', icon: SquaresPlusIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'changePassword', title: '更改密碼', content: '更改舊密碼，換成新密碼', link: '/member/changePassword', icon: LockClosedIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'validateEmail', title: '認證Email', content: '認證你的email，表示能收到系統寄送的通知訊息', link: '/member/validate/email', icon: ShieldCheckIcon, spring: useSpring(()=>(initSpringFrom))},
        {key: 'validateMobile', title: '認證手機', content: '認證你的手機，表示能收到系統寄送的通知訊息', link: '/member/validate/mobile', icon: ShieldCheckIcon, spring: useSpring(()=>(initSpringFrom))},
        // {key: 'history', title: '購買記錄', content: '檢視您曾在羽球密碼的消費紀錄', link: '/member/history', icon: FaHistory, spring: useSpring(()=>(initSpringFrom))},
        // {key: 'listTeam', title: '球隊登錄', content: '您登錄球隊的列表，與您的球隊登錄到羽球密碼系統中，讓球友可以檢視您球隊的資訊', link:'/member/team', icon: PencilSquareIcon, spring: useSpring(()=>(initSpringFrom))},
        // {key: 'listArena', title: '球館登錄', content: '您登錄球館的列表，與您的球館登錄到羽球密碼系統中，讓球友可以檢視您球館的資訊', link: '/member/arena', icon: PencilSquareIcon, spring: useSpring(()=>(initSpringFrom))},
    ];
    const makeAnimatedIcon = (key) => {
        //const a = items.filter((item) => item.key === key);console.info(a[0].icon);
        const item = items.find((item) => item.key === key);
        const AnimatedIcon = animated(item.icon);
        return (
            <AnimatedIcon className={style} style={{...item.spring[0]}} />
        )
    };

    // 已經通過email認證
    if ((validate & 1) > 0) {
        items = items.filter(item => item.key !== 'validateEmail');
    }

    // 已經通過手機認證
    if ((validate & 2) > 0) {
        items = items.filter(item => item.key !== 'validateMobile');
    }

    //console.info(...items[0])
    items = items.map((item, idx) => {
        item = {
            ...item,
            animatedIcon: makeAnimatedIcon(item.key),
            onClick: () => onClick(item.link),
            onMouseEnter: () => onMouseEnter(item.key),
            onMouseLeave: () => onMouseLeave(item.key),
        };
        return item;
    });
    //console.info(items);

    const onClick = (url) => {
        //console.info(url);
        navigate(url);
    }

    const onMouseEnter = (key) => {
        const item = items.find((item) => item.key === key);
        item.spring[1].start({
            from: {transform: 'rotate(0deg)'},
            to: {transform: 'rotate(75deg)'},
            config: { duration: 600 },
            // from: {x: 0},
            // to: {x: 10},
            // //reverse: true, //回到原來位置
            // // duration: 動作延遲毫秒數
            // config: { duration: 400 }
        });
    }

    const onMouseLeave = (key) => {
        const item = items.find((item) => item.key === key);
        item.spring[1].start({
            from: {transform: 'rotate(75deg)'},
            to: {transform: 'rotate(0deg)'},
            config: {duration: 600},
        });
    }

    // const toggle = true;
    // const hangingBarSpring = useSpring({
    //     transform: toggle ? `translate3d(0px, 0px, 0px)` : `translate3d(-100px, -20px, 0px)`,
    //     config: { duration: 3000 },
    // });

    // const { transform } = useSpring({
    //     from: {transform: 'rotate(0deg)'},
    //     to: {transform: 'rotate(25deg)'},
    //     config: { duration: 600 },
    //     //loop: { reverse: true }
    // });

    return (
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
            <Breadcrumb items={breadcrumbs}/>
                {/*<animated.div onClick={onClick} className='bg-Primary-300 rounded-2xl w-48 h-48' style={{...springs}}>This is a block</animated.div>*/}
                {/*<animated.div className='w-48 h-48 bg-Primary-300 rounded-md mb-4 ...springs'/>*/}
                <div className="mx-2 p-6 rounded-md grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 bg-PrimaryBlock-950 border border-PrimaryBlock-800">
                    {items.map((item, idx) => (
                        <HeroCard
                            key={item.key}
                            title={item.title}
                            content={item.content}
                            icon={item.animatedIcon}
                            onClick={item.onClick}
                            onMouseEnter={item.onMouseEnter}
                            onMouseLeave={item.onMouseLeave}
                        />
                    ))}
                    {/*<HeroCard*/}
                    {/*    title={"會員資料"}*/}
                    {/*    content={"檢視或修改會員姓名、暱稱、email等基本資料"}*/}
                    {/*    icon={<AUserCircleIcon />}*/}
                    {/*    onClick={() => onClick('/member/register')}*/}
                    {/*    onMouseEnter={onMouseEnter}*/}
                    {/*    onMouseLeave={onMouseLeave}*/}
                    {/*/>*/}
                    {/*<HeroCard*/}
                    {/*    title={"訂單"}*/}
                    {/*    content={"查詢你曾在羽球密碼購買的訂單詳細資料"}*/}
                    {/*    icon={<AShoppingBagIcon />}*/}
                    {/*    onClick={() => onClick('/member/order')}*/}
                    {/*    onMouseEnter={onMouseEnter1}*/}
                    {/*    onMouseLeave={onMouseLeave1}*/}
                    {/*/>*/}
                </div>
            </main>
        </div>
    )
}

export default Index1