import React, {useContext, useEffect, useState} from "react";
import BMContext from "../../../context/BMContext";
import {animated, useSpring} from "@react-spring/web";
import {useNavigate} from "react-router-dom";
import {HeroCard} from "../../../component/Card";
import {FaSignInAlt, FaSignOutAlt} from "react-icons/fa";

export function Index() {
    const {auth} = useContext(BMContext);
    const navigate = useNavigate();

    const style = "h-10 w-10";
    const initSpringFrom = {from: {transform: 'rotate(0deg)'}};
    var items = [
        {key: 'sale', title: '銷貨', content: '門市賣貨所用結帳之功能', link: '/admin/pos/sale', icon: FaSignOutAlt, spring: useSpring(()=>(initSpringFrom))},
        {key: 'buy', title: '進貨', content: '門市進貨之功能', link: '/admin/pos/buy', icon: FaSignInAlt, spring: useSpring(()=>(initSpringFrom))},
    ];

    const makeAnimatedIcon = (key) => {
        //const a = items.filter((item) => item.key === key);console.info(a[0].icon);
        const item = items.find((item) => item.key === key);
        const AnimatedIcon = animated(item.icon);
        return (
            <AnimatedIcon className={style} style={{...item.spring[0]}} />
        )
    };

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

    return (
        <div>
            <main className="p-4 h-auto pt-20">
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
                </div>
            </main>
        </div>
)
}
