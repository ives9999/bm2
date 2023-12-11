import { React } from "react";
import { UserCircleIcon, PhotoIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '../../layout/Breadcrumb'
const Index = () => {
    const breadcrumbs = [
        { name: '會員', href: '/member', current: true },
    ]

    function Icon({prop}) {
        const style = "h-10 w-10 align-middle text-Primary"
        if (prop.icon === "user") {
            return <UserCircleIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "avatar") {
            return <PhotoIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "changePassword") {
            return <LockClosedIcon className={style} aria-hidden="true" />
        } else if (prop.icon === "validate") {
            return <ShieldCheckIcon className={style} aria-hidden="true" />
        } else {
            return <UserCircleIcon className={style} aria-hidden="true" />
        }
    }

    function Block({prop}) {
        return (
            <>
                <a href={prop.url} className="p-6 rounded-md hover:bg-blockHoverColor">
                    <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                        <Icon prop={prop} />
                    </div>
                    <div className="text-menuTextWhite text-textTitleSize hover:text-Primary focus:text-Primary mt-6">{prop.title}</div>
                    <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">{prop.desc}</div>
                </a>
            </>
        )

    }

    return (
        <>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
            <Breadcrumb items={breadcrumbs}/>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 bg-MenuBG border border-MenuBorder">
                    <Block prop={
                        {id: "user", url: "/member/register", icon: "user", title: "會員資料", desc: "檢視或修改會員姓名、暱稱、email等基本資料"}
                    } />
                    <Block prop={
                        {id: "avatar", url: "/member/avatar", icon: "avatar", title: "上傳/更新 頭像", desc: "上傳或更新您的頭像，方便其他使用者容易辨認出你"}
                    } />
                    <Block prop={
                        {id: "changePassword", url: "/member/changePassword", icon: "changePassword", title: "更改密碼", desc: "更改舊密碼，換成新密碼"}
                    } />
                    <Block prop={
                        {id: "validate", url: "/member/validate/email", icon: "validate", title: "email認證", desc: "認證你的email，表示能收到系統寄送的通知訊息"}
                    } />
                    <Block prop={
                        {id: "validate", url: "/member/validate/mobile", icon: "validate", title: "手機認證", desc: "認證你的手機，表示能收到系統寄送的通知訊息"}
                    } />
                </div>
            </main>
        </div>
        </>
    )
}

export default Index