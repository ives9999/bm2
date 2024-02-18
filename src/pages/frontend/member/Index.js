import { React, useContext } from "react";
import BMContext from "../../../context/BMContext";
import { UserCircleIcon, PhotoIcon, LockClosedIcon, ShieldCheckIcon, SquaresPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '../../../layout/Breadcrumb'
import {Link} from 'react-router-dom';

const Index = () => {
    const {memberData} = useContext(BMContext)

    const breadcrumbs = [
        { name: '會員', href: '/member', current: true },
    ]

    const validate = memberData.validate

    function Icon({prop}) {
        const style = "h-10 w-10 align-middle text-Primary-300"
        if (prop.icon === "user") {
            return <UserCircleIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "avatar") {
            return <PhotoIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "changePassword") {
            return <LockClosedIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "validate") {
            return <ShieldCheckIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "moreData") {
            return <SquaresPlusIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "edit") {
            return <PencilSquareIcon className={style} aria-hidden="true" />
        } else {
            return <UserCircleIcon className={style} aria-hidden="true" />
        }
    }

    function Block({prop}) {
        return (
            <>
                <Link to={prop.url} className={`p-6 rounded-md hover:bg-PrimaryBlock-900 ${prop.show ? "block" : "hidden"}`}>
                    <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                        <Icon prop={prop} />
                    </div>
                    <div className="text-menuTextWhite text-textTitleSize hover:text-Primary-300 focus:text-Primary-300 mt-6">{prop.title}</div>
                    <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">{prop.desc}</div>
                </Link>
            </>
        )

    }

    return (
        <>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
            <Breadcrumb items={breadcrumbs}/>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 bg-PrimaryBlock-950 border border-PrimaryBlock-800">
                    <Block prop={
                        {id: "user", url: "/member/register", icon: "user", title: "會員資料", desc: "檢視或修改會員姓名、暱稱、email等基本資料", show: true}
                    } />
                    <Block prop={
                        {id: "avatar", url: "/member/avatar", icon: "avatar", title: "上傳/更新 頭像", desc: "上傳或更新您的頭像，方便其他使用者容易辨認出你", show: true}
                    } />
                    <Block prop={
                        {id: "moreData", url: "/member/moreData", icon: "moreData", title: "會員更多資料", desc: "註冊會員更多的資訊，例如性別、生日、住址等等！！", show: true}
                    } />
                    <Block prop={
                        {id: "changePassword", url: "/member/changePassword", icon: "changePassword", title: "更改密碼", desc: "更改舊密碼，換成新密碼", show: true}
                    } />
                    <Block prop={
                        {id: "validate", url: "/member/validate/email", icon: "validate", title: "email認證", desc: "認證你的email，表示能收到系統寄送的通知訊息", show: ((validate & 1)===0) ? true : false}
                    } />
                    <Block prop={
                        {id: "validate", url: "/member/validate/mobile", icon: "validate", title: "手機認證", desc: "認證你的手機，表示能收到系統寄送的通知訊息", show: ((validate & 2)===0) ? true : false}
                    } />
                    <Block prop={
                        {id: "listTeam", url: "/member/team", icon: "edit", title: "球隊登錄", desc: "您登錄球隊的列表，與您的球隊登錄到羽球密碼系統中，讓球友可以檢視您球隊的資訊", show: true}
                    } />
                    <Block prop={
                        {id: "listArena", url: "/member/arena", icon: "edit", title: "球館登錄", desc: "您登錄球館的列表，與您的球館登錄到羽球密碼系統中，讓球友可以檢視您球館的資訊", show: true}
                    } />
                </div>
            </main>
        </div>
        </>
    )
}

export default Index