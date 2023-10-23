import { React, useState, useEffect, useCallback, memo } from "react";
import { dump } from "../../functions"
import Cookies from "universal-cookie";
import axios from "axios";
import useFetchOne from "../../api/member/UseFetchOne";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'

import { useRef } from "react";
import { UserCircleIcon } from '@heroicons/react/20/solid'
import Uploady, { 
    useItemProgressListener, 
    useBatchAddListener,
    useItemFinalizeListener,
    FILE_STATES,  
    useUploady, useAbortItem } from "@rpldy/uploady";
import { Circle } from "rc-progress";
import { UploadButton } from "@rpldy/upload-button";
import { UploadPreview } from "@rpldy/upload-preview";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import { FcCheckmark } from "react-icons/fc";

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

    const ItemProgress = memo(({id}) => {
        const {completed } = useItemProgressListener(id) || {completed: 0}

        return (
            <Circle className="w-10 h-10 mr-4"
                percent={completed}
                strokeWidth={2}
                trailColor="rgb(175, 180, 176)"
                strokeColor={{
                    "0%": "#ffecb1",
                    "100%": "#9eea9e"
                }}
            />
        )
    })

    const UploadListItem = ({ item }) => {
        const [itemState, setState] = useState(item.state)

        const abortItem = useAbortItem()

        useItemFinalizeListener((item) => {
            setState(item.state)
        }, item.id)

        const isAborted = itemState === FILE_STATES.ABORTED,
            isSuccess = itemState === FILE_STATES.FINISHED,
            isFinished = ![FILE_STATES.PENDING, FILE_STATES.UPLOADING].includes(itemState)
        
        const onAbortItem = () => {
            abortItem(item.id)
        }
        const lo = "http://localhost:3000/"

        return (
            <div className="flex items-center my-2 justify-start">
                {!isFinished && <ItemProgress id={item.id} />}
                {isAborted && <ImCancelCircle size={36} color="gray" />}
                {isSuccess && <FcCheckmark size={36} />}
                <span className={`inline-block mx-2 text-myWhite `}>
                {/* <span className={`inline-block mx-2 ${isAborted ? "text-red-500" : ""} ${isSuccess ? "text-green-500" : ""} `}></span> */}
                    {item.file.name}
                    <img src={lo + item.file.name} alt="" />
                </span>
                {!isFinished && <RiDeleteBin2Fill size={32} onClick={onAbortItem} />}
            </div>
        )
    }

    const UploadList = () => {
        const { processPending } = useUploady()
        const [items, setItems] = useState([])

        useBatchAddListener((batch) => {
            setItems((items) => items.concat(batch.items))
        })

        return (
            <>
                <section className="flex flex-col items-start justify-center mt-5">
                    {items.map((item) => (
                        <UploadListItem key={item.id} item={item} />
                    ))}

                    {items.length ? <button className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={processPending}>上傳</button> : null}
                </section>
            </>
        )
    }

    // const Browser = () => {
    //     const uploady = useUploady();
    //     const onClick = () => {
    //         uploady.showFileUpload()
    //     }

    //     return (
    //         <>
    //             <button 
    //                 className="rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-myPrimary shadow-sm hover:text-primaryText"
    //                 onClick={onClick}
    //             >選擇</button>
    //         </>
    //     )
    // }

    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault();
    }

    // const [isHidden, setIsHidden] = useState(false)

    // const ImagePreview = ({id, url}) => {
    //     const { completed } = useItemProgressListener(id) || { completed: 0 }
    //     setIsHidden(true)

    //     return (
    //         <>
    //             <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
    //                 <img className="absolute w-64 h-64 object-cover" src={url} completed={completed} alt="" />
    //             </div>
    //         </>
    //     )
    // }

    // const previewMethodsRef = useRef()
    // const [previews, setPreviews] = useState([])
    // const onPreviewsChanged = useCallback((previews) => {
    //     setPreviews(previews)
    //     // dump(previews)
    // }, [])
    // const onClear = useCallback(() => {
    //     if (previewMethodsRef.current?.clear) {
    //         previewMethodsRef.current.clear()
    //         setIsHidden(false)
    //     }
    // }, [previewMethodsRef])

    //const inputRef = useRef(null)
    
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">上傳/更新 頭像</h2>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                        
                    <Uploady 
                        autoUpload={false}
                        destination={{ url: process.env.REACT_APP_API + "/member/avatar" }}
                        //debug
                    >
                        {/* <div className="flex justify-center mb-6">
                            <UserCircleIcon className={`h-64 w-64 text-gray-500 ${isHidden ? "hidden" : "block"}`} aria-hidden="true" />
                            <UploadPreview 
                                loadFirstOnly={true}
                                PreviewComponent={ImagePreview}
                                previewMethodsRef={previewMethodsRef}
                                onPreviewsChanged={onPreviewsChanged}
                            />
                        </div> */}
                        <UploadList />
                        
                        <div className="flex justify-stretch mb-8">
                            <UploadButton 
                                className="rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-myPrimary shadow-sm hover:text-primaryText"
                                text="選擇"
                            />
                            <button
                                type="button"
                                className="rounded-md w-full h-12 mt-8 ml-2 px-5 py-1 bg-borderColor text-sm font-semibold text-primaryText shadow-sm hover:text-myPrimary"
                                //onClick={onClear}
                            >
                                清除
                            </button>
                        </div>
                    </Uploady>

                        {/* <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            送出
                        </button> */}

                    </div>
            </main>
        </div>

        </Layout>
        </>
    );
}



export default Avatar