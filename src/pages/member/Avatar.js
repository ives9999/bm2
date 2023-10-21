import { React, useState, useEffect, useCallback } from "react";
import { dump } from "../../functions"
import Cookies from "universal-cookie";
import axios from "axios";
import useFetchOne from "../../api/member/UseFetchOne";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'

import { useRef } from "react";
import { UserCircleIcon } from '@heroicons/react/20/solid'
import Uploady, { useItemProgressListener, useUploady } from "@rpldy/uploady";
import { UploadButton } from "@rpldy/upload-button";
import { UploadPreview } from "@rpldy/upload-preview";
//import styled from "styled-components";


const Avatar = () => {
    const cookies = new Cookies();
    var token = cookies.get("token")
    const url = process.env.REACT_APP_API + "/member/getOne?token=" + token
    const one = useFetchOne(url)
    if (one !== null) {
        //dump(one)
    }

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '上傳/更新 頭像', href: '/member/avatar', current: true },
    ]

    const {processPending} = useUploady()
    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault()
        processPending({params: []})
    }
    const [isHidden, setIsHidden] = useState(false)

    const ImagePreview = ({id, url}) => {
        const { completed } = useItemProgressListener(id) || { completed: 0 }
        setIsHidden(true)

        return (
            <>
                <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                    <img className="absolute w-full h-full object-cover" src={url} completed={completed} alt="" />
                </div>
            </>
        )
    }

    const previewMethodsRef = useRef()
    const [previews, setPreviews] = useState([])
    const onPreviewsChanged = useCallback((previews) => {
        setPreviews(previews)
        //dump(previews)
    }, [])
    const onClear = useCallback(() => {
        if (previewMethodsRef.current?.clear) {
            previewMethodsRef.current.clear()
            setIsHidden(false)
        }
    }, [previewMethodsRef])

    const inputRef = useRef(null)
    
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-myPrimary text-center text-4xl font-bold mb-12">選擇頭像</h2>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                        
                    <form>    
                    <Uploady 
                        destination={{ url: process.env.REACT_APP_API + "/member/avatar" }}
                        //debug
                    >
                        <div className="flex justify-center mb-6">
                            <UserCircleIcon className={`h-64 w-64 text-gray-500 ${isHidden ? "hidden" : "block"}`} aria-hidden="true" />
                            <UploadPreview 
                                PreviewComponent={ImagePreview}
                                previewMethodsRef={previewMethodsRef}
                                onPreviewsChanged={onPreviewsChanged}
                            />
                        </div>
                        <div className="flex justify-stretch mb-8">
                            <UploadButton 
                                ref={inputRef}
                                className="rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-myPrimary shadow-sm hover:text-primaryText"
                                text="選擇"
                            />
                            <button
                                type="button"
                                className="rounded-md w-full h-12 mt-8 ml-2 px-5 py-1 bg-borderColor text-sm font-semibold text-primaryText shadow-sm hover:text-myPrimary"
                                onClick={onClear}
                            >
                                清除
                            </button>
                        </div>
                    </Uploady>

                        <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            送出
                        </button>
                    </form>
                    </div>
            </main>
        </div>


        </Layout>
        </>
    );
}



export default Avatar
