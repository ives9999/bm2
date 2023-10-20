import { React, useState, useEffect } from "react";
import { dump } from "../../functions"
import Cookies from "universal-cookie";
import axios from "axios";
import useFetchOne from "../../api/member/UseFetchOne";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'

import { useRef } from "react";
import { UserCircleIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import Uploady, { useItemProgressListener } from "@rpldy/uploady";
import { UploadButton } from "@rpldy/upload-button";
import { UploadPreview } from "@rpldy/upload-preview";
//import styled from "styled-components";


const Avatar = () => {
    const cookies = new Cookies();
    var token = cookies.get("token")
    const url = process.env.REACT_APP_API + "/member/getOne?token=" + token
    const one = useFetchOne(url)
    if (one !== null) {
        dump(one)
    }

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '上傳/更新 頭像', href: '/member/avatar', current: true },
    ]
    const handleAvatar = (event) => {
    }

    const clearAvatar = (event) => {

    }

    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault();
    }

    // const PreviewImage = styled.img`
    //     margin: 5px;
    //     max-width: 200px;
    //     height: auto;
    //     transition: opacity 0.4s;

    //     ${({ completed }) => `opacity: ${completed / 100};`}
    // `;

    const MyPreview = ({ type, url, id, name, isFallback, foo }) => {

        const { completed } = useItemProgressListener(id) || { completed: 0 }
        return <img className="w-36 h-36 bg-myWhite" src={url} completed={completed} alt="" />
    };

    const ImagePreview = ({id, url}) => {
        const { completed } = useItemProgressListener(id) || { completed: 0 }

        return <img className="w-36 h-36" src={url} completed={completed} alt="" />
    }

    const inputRef = useRef(null)
    
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">選擇頭像</h2>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                        
                    <Uploady 
                        autoUpload={false}
                        destination={{ url: process.env.REACT_APP_API + "/member/avatar" }}
                        debug
                    >
                        <UploadPreview
                            PreviewComponent={MyPreview}
                            previewComponentProps={{
                                foo: "bar"
                            }}
                        />
                        {/* <div className="flex justify-center mb-6">
                            <UserCircleIcon className="h-36 w-36 text-gray-500" aria-hidden="true" />
                        </div> */}
                        <UploadButton 
                            ref={inputRef}
                            className="w-full mb-8 rounded-md border border-myPrimary px-3 py-2 text-sm font-semibold text-myWhite shadow-sm hover:bg-myPrimary hover:text-myBlack"
                            text="選擇"
                        />
                    </Uploady>
                    {/* <Avatar
                        label="頭像"
                        name="avatar"
                        value=""
                        id="avatar"
                        isRequired={false}
                        isError={false}
                        errorMsg=""
                        onChange={handleAvatar}
                        onClear={clearAvatar}
                    /> */}


                        <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            送出
                        </button>

                    </div>
            </main>
        </div>

        {/* <Alert isOpen={isOpenAlert} text={alertText} close={handleClose} /> */}

        </Layout>
        </>
    );
}



export default Avatar
