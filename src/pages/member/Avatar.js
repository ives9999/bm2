import { React, useState, useContext, useEffect } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import { useRef } from "react";
import {PrimaryButton, OutlineButton, CancelButton} from '../../component/MyButton';
import {postAvatarAPI} from "../../context/member/MemberAction"


const Avatar = () => {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)
    const {token, avatar, nickname} = memberData

    // const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
    // var src = (avatar === null || avatar.trim().length === 0) ?  noavatar : process.env.REACT_APP_ASSETS_DOMAIN + avatar

    const [selectedImage, setSelectedImage] = useState(avatar)
    // useEffect(() => {
    //     setTimeout(() => {
    //         console.info(src)
    //         console.info(avatar)
    //         console.info(memberData)
    //         console.info(memberData.avatar)
    //         setSelectedImage(src)    
    //     }, 1000)
    // }, [])

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '上傳/更新 頭像', href: '/member/avatar', current: true },
    ]

    // const [isRemote, setIsRemote] = useState(true)
    // const [isNoAvatarHidden, setIsNoAvatarHidden] = useState(true)
    
    const onSelect = () => {
        inputFileRef.current.click()
    }

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            //setIsNoAvatarHidden(true)
            //setIsRemote(false)
            const src = URL.createObjectURL(e.target.files[0])
            setSelectedImage(src)
        }
    }

    // This functin will be triggered when the "Remove This Image" button is clicked
    const onClearImage = () => {
        //setIsRemote(false)
    const noavatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
    setSelectedImage(noavatar)
        //setIsNoAvatarHidden(false)
    }

    const AvatarPreview = () => {
        // const src = 
        // (avatar !== null) 
        // ? show 
        // : (selectedImage) ? URL.createObjectURL(selectedImage) : ""
        return (
            <>
            {/* {selectedImage && ( */}
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                <img className="absolute w-64 h-64 object-cover" src={selectedImage} alt={nickname} />
            </div>
            {/* )} */}
            </>
        )
    }

    const onSubmit = async () => {
        setIsLoading(true)
        const data = await postAvatarAPI(token, "token", selectedImage)
        if (data.status === 200) {
            setAlertModal({
                modalType: 'success',
                modalText: "成功更新完密碼，請用新密碼來登入",
                isModalShow: true,
            })
        } else {

        }
        setIsLoading(false)
    }

    const inputFileRef = useRef(null)
    
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-20">上傳/更新 頭像</h2>
                <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                    <input 
                        ref={inputFileRef}
                        type="file"
                        accept="image/*" // only accept image file types
                        onChange={imageChange}
                        className="hidden"
                    />
                        
                    <div className="flex justify-center mb-6">
                        {/* <img className={`h-64 w-64 text-gray-500 ${avatar ? "block" : "hidden"}`} src={process.env.REACT_APP_ASSETS_DOMAIN + "/uploads/noavatar.png"} alt="" aria-hidden="true" /> */}
                        <AvatarPreview />
                    </div>
                    
                    <div className="flex justify-stretch mb-8 h-12">
                        <OutlineButton type="button" extraClassName="w-full" onClick={onSelect}>選擇</OutlineButton>
                        {/* <button
                            type="button" 
                            className="rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-Primary shadow-sm hover:text-primaryText"
                            onClick={onSelect}
                        >選擇</button> */}
                        <CancelButton extraClassName="w-full" onClick={onClearImage}>清除</CancelButton>
                        {/* <button
                            type="button"
                            className="rounded-md w-full h-12 mt-8 ml-2 px-5 py-1 bg-borderColor text-sm font-semibold text-primaryText shadow-sm hover:text-Primary"
                            onClick={onClearImage}
                        >清除</button> */}
                    </div>
                    <div className='mt-12'>
                        <PrimaryButton extraClassName="w-full" type="button" onClick={onSubmit}>送出</PrimaryButton>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}

export default Avatar