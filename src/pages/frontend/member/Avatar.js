import { React, useState, useContext } from "react";
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import { useRef } from "react";
import {PrimaryButton, PrimaryOutlineButton, DeleteOutlineButton, CancelButton} from '../../../component/MyButton';
import {postAvatarAPI} from "../../../context/member/MemberAction"

const Avatar = () => {
    const {auth, setIsLoading, setAlertModal, effectEnd, setEffectEnd} = useContext(BMContext)
    const {token, avatar, nickname} = auth

    const noAvatar = process.env.REACT_APP_ASSETS_DOMAIN + "/imgs/noavatar.png"
    const [selectedImage, setSelectedImage] = useState({
        src: null,
        file: null,
    })

    const avatarProcess = useRef({
        name: noAvatar,
        status: 'localhost',
    })

    if (effectEnd) {
        if (avatar.length > 0) {
            avatarProcess.current = {
                name: avatar,
                status: 'remote',
            }
        }
        setEffectEnd(false)
    }

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '上傳/更新 頭像', href: '/member/avatar', current: true },
    ]
    
    const onSelect = () => {
        inputFileRef.current.click()
    }

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // const src = URL.createObjectURL(e.target.files[0])
            setSelectedImage((prev) => {
                return {...prev, file: e.target.files[0], src: null}
            })

            avatarProcess.current = {
                name: e.target.files[0].name,
                status: 'create',
            }
            console.info(avatarProcess.current)
        }
    }

    // This functin will be triggered when the "Remove This Image" button is clicked
    const onClearImage = () => {
        setSelectedImage((prev) => {
            return {...prev, file: null, src: noAvatar}
        })
        avatarProcess.current.status = "delete"
        console.info(avatarProcess.current)
    }

    const AvatarPreview = () => {
        var src = null
        if (selectedImage.file !== null) {
            src = URL.createObjectURL(selectedImage.file)
        } else if (selectedImage.src !== null) {
            src = selectedImage.src
        } else {
            src = avatar
        }
        return (
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                <img className="absolute w-64 h-64 object-cover" src={src} alt={nickname} />
            </div>
        )
    }

    const onSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("token", token)
        formData.append("name", 'avatar')
        if (selectedImage.file !== null) {
            formData.append('avatar', selectedImage.file)
        }
        formData.append('avatarProcess', JSON.stringify(avatarProcess.current))
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        const data = await postAvatarAPI(formData)
        if (data.status === 200) {
            setAlertModal({
                modalType: 'success',
                modalText: "成功設定頭像！！",
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
            })
        } else {
            const message = data["message"][0].message
            setAlertModal({
                modalType: 'alert',
                modalText: message,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
            })
        }
        setIsLoading(false)
    }

    const inputFileRef = useRef(null)

    const onCancel = () => {
        window.history.back()
    }
    
    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-20">上傳/更新 頭像</h2>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
                    <input 
                        ref={inputFileRef}
                        type="file"
                        accept="image/*" // only accept image file types
                        onChange={imageChange}
                        className="hidden"
                    />
                        
                    <div className="flex justify-center mb-6">
                        {/* <img className={`h-64 w-64 text-gray-500 ${avatar ? "block" : "hidden"}`} src={process.env.REACT_APP_ASSETS_DOMAIN + "/uploads/noavatar.png"} alt="" aria-hidden="true" /> */}
                        {/* <img className="w-8 h-8 rounded-full" src={avatar} alt={nickname} /> */}
                        <AvatarPreview />
                    </div>
                    
                    <div className="flex justify-stretch mb-8 h-12 gap-4">
                        <PrimaryOutlineButton type="button" className="w-full" onClick={onSelect}>選擇</PrimaryOutlineButton>
                        <DeleteOutlineButton className="w-full" onClick={onClearImage}>清除</DeleteOutlineButton>
                    </div>
                    <div className='mt-12'>
                        <PrimaryButton className="w-full" type="button" onClick={onSubmit}>送出</PrimaryButton>
                        <CancelButton type="button" onClick={onCancel} className="w-full mt-6">取消</CancelButton>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}

export default Avatar