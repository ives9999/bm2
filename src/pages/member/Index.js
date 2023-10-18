import Layout from '../../layout/Layout';
import { React, useState, Fragment } from "react";
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'

const Index = () => {

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
                <div className="mt-6 p-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 bg-blockColor border border-borderColor">
                    <div className="p-6 rounded-md hover:bg-blockHoverColor">
                        <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                            <UserCircleIcon className="h-10 w-10 align-middle text-textTitleColor" aria-hidden="true" />
                        </div>
                        <div className="text-menuTextWhite text-textTitleSize hover:text-focusBlue focus:text-focusBlue mt-6">會員資料</div>
                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">檢視或修改會員姓名、暱稱、email等基本資料</div>
                    </div>
                    <div className="p-6 rounded-md hover:bg-blockHoverColor">
                        <div className="h-16 w-16 bg-myBlack rounded-full grid place-items-center">
                            <PhotoIcon className="h-10 w-10 align-middle text-textTitleColor" aria-hidden="true" />
                        </div>
                        <div className="text-menuTextWhite text-textTitleSize hover:text-focusBlue focus:text-focusBlue mt-6">上傳頭像</div>
                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue mt-6">檢視或修改會員姓名、暱稱、email等基本資料</div>
                    </div>
                    <div className="p-6 rounded-md">
                        <div className="text-textTitleColor text-textTitleSize hover:text-focusBlue focus:text-focusBlue">更新密碼</div>
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