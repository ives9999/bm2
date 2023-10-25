import { React, useState, useEffect, useCallback, memo } from "react";
import { dump } from "../../functions"
import Cookies from "universal-cookie";
import axios from "axios";
import useFetchOne from "../../api/member/UseFetchOne";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'

import { useRef } from "react";
import { UserCircleIcon } from '@heroicons/react/20/solid'

//import styled from "styled-components";


const Avatar = () => {
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '上傳/更新 頭像', href: '/member/avatar', current: true },
    ]

    const [selectedImage, setSelectedImage] = useState()
    const [isRemote, setIsRemote] = useState(false)
    const [isNoAvatarHidden, setIsNoAvatarHidden] = useState(false)
    const [token, setToken] = useState(null)
    const [one, setOne] = useState([])

    useEffect(() => {
        const cookies = new Cookies();
        var token1 = cookies.get("token")
        // dump(token1)
        if (token1 !== undefined) {
            setToken(token1)
            const url = process.env.REACT_APP_API + "/member/getOne?token=" + token1

            const config = {
                method: "GET",
                Headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios.get(url, {}, config)
            .then(response => {
                if (response.data.success) {
                    setOne(response.data.row)
                    setIsRemote(true)
                    setIsNoAvatarHidden(true)
                }
            })
        }
    }, [])

    // const cookies = new Cookies();
    // var token = cookies.get("token")
    // const url = process.env.REACT_APP_API + "/member/getOne?token=" + token
    // const one = useFetchOne(url)
    // if (one !== null) {
    //     const avatar = process.env.REACT_APP_ASSETS_DOMAIN + "/uploads" + one.row.avatar
    //     setSelectedImage(avatar)
    // }
    
    const onSelect = () => {
        inputFileRef.current.click()
    }

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsNoAvatarHidden(true)
            setIsRemote(false)
            setSelectedImage(e.target.files[0])
        }
    }

    // This functin will be triggered when the "Remove This Image" button is clicked
    const onClearImage = () => {
        setIsRemote(false)
        setSelectedImage()
        setIsNoAvatarHidden(false)
    }

    const AvatarPreview = () => {
        const src = 
        (isRemote) 
        ? process.env.REACT_APP_ASSETS_DOMAIN + "/uploads" + one.avatar 
        : (selectedImage) ? URL.createObjectURL(selectedImage) : ""
        return (
            <>
            {(selectedImage || isRemote) && (
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                <img className="absolute w-64 h-64 object-cover" src={src} alt="avatar" />
            </div>
            )}
            </>
        )
    }

    const handleSubmit = (event) => {
        //console.info("form submit")
        event.preventDefault()
        
        const formData = new FormData()
        formData.append('File', selectedImage)
        const url = process.env.REACT_APP_API + "/member/postAvatar"
        //axios.post(url, params, config)
    }

    const inputFileRef = useRef(null)
    
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">上傳/更新 頭像</h2>
                    <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    <input 
                        ref={inputFileRef}
                        type="file"
                        accept="image/*" // only accept image file types
                        onChange={imageChange}
                        className="hidden"
                    />
                        
                        <div className="flex justify-center mb-6">
                            <UserCircleIcon className={`h-64 w-64 text-gray-500 ${isNoAvatarHidden ? "hidden" : "block"}`} aria-hidden="true" />
                            <AvatarPreview />
                        </div>
                        
                        <div className="flex justify-stretch mb-8">
                            <button
                                type="button" 
                                className="rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-myPrimary shadow-sm hover:text-primaryText"
                                onClick={onSelect}
                            >選擇</button>
                            <button
                                type="button"
                                className="rounded-md w-full h-12 mt-8 ml-2 px-5 py-1 bg-borderColor text-sm font-semibold text-primaryText shadow-sm hover:text-myPrimary"
                                onClick={onClearImage}
                            >清除</button>
                        </div>

                        <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >送出</button>
                    </div>
            </main>
        </div>
        </Layout>
        </>
    );
}



export default Avatar