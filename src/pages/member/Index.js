import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { UserCircleIcon, PhotoIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

const Index = () => {

    const pages = [
        { name: 'Projects', href: '#', current: false },
        { name: 'Project Nero', href: '#', current: true },
      ]

    return (
        <>
        <Layout>

        


        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">

            <nav className="flex ps-2" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
            <li>
            <div>
                <a href="#" className="text-breadcrumbColor hover:text-myPrimary">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
                </a>
            </div>
            </li>
            {pages.map((page) => (
            <li key={page.name}>
                <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-menuTextWhite" aria-hidden="true" />
                <a
                    href={page.href}
                    className="ml-4 text-sm font-medium text-breadcrumbColor hover:text-myPrimary"
                    aria-current={page.current ? 'page' : undefined}
                >
                    {page.name}
                </a>
                </div>
            </li>
            ))}
        </ol>
        </nav>



                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 bg-blockColor border border-borderColor">
                    <a href="/member/register" className="p-6 rounded-md hover:bg-blockHoverColor">
                        <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                            <UserCircleIcon className="h-10 w-10 align-middle text-textTitleColor" aria-hidden="true" />
                        </div>
                        <div className="text-menuTextWhite text-textTitleSize hover:text-focusBlue focus:text-focusBlue mt-6">會員資料</div>
                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">檢視或修改會員姓名、暱稱、email等基本資料</div>
                    </a>
                    <div className="p-6 rounded-md hover:bg-blockHoverColor">
                        <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                            <PhotoIcon className="h-10 w-10 align-middle text-textTitleColor" aria-hidden="true" />
                        </div>
                        <div className="text-menuTextWhite text-textTitleSize hover:text-focusBlue focus:text-focusBlue mt-6">上傳頭像</div>
                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">檢視或修改會員姓名、暱稱、email等基本資料</div>
                    </div>
                    <div className="p-6 rounded-md hover:bg-blockHoverColor">
                        <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                            <LockClosedIcon className="h-10 w-10 align-middle text-textTitleColor" aria-hidden="true" />
                        </div>
                        <div className="text-menuTextWhite text-textTitleSize hover:text-focusBlue focus:text-focusBlue mt-6">更新密碼</div>
                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">檢視或修改會員姓名、暱稱、email等基本資料</div>
                    </div>
                </div>
            </main>
        </div>
        </Layout>
        </>
    )
}

export default Index