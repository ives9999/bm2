import { React, useState, useContext } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import { useRef } from "react";
import {PrimaryButton, OutlineButton, CancelButton} from '../../component/MyButton';
import {postAvatarAPI} from "../../context/member/MemberAction"

const Avatar = () => {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)
    const {token, avatar, nickname} = memberData

    const [selectedImage, setSelectedImage] = useState(null)

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
            setSelectedImage(e.target.files[0])
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
        return (
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-myWhite">
                <img className="absolute w-64 h-64 object-cover" src={(selectedImage !== null)?URL.createObjectURL(selectedImage):avatar} alt={nickname} />
            </div>
        )
    }

    const onSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("token", token)
        formData.append("name", 'avatar')
        formData.append('avatar', selectedImage)
        const data = await postAvatarAPI(formData)
        if (data.status === 200) {
            setAlertModal({
                modalType: 'success',
                modalText: "成功設定頭像！！",
                isModalShow: true,
            })
        } else {
            const message = data["message"][0].message
            setAlertModal({
                modalType: 'alert',
                modalText: message,
                isModalShow: true,
            })
        }
        setIsLoading(false)
    }

    const inputFileRef = useRef(null)
    
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
                        <OutlineButton type="button" extraClassName="w-full" onClick={onSelect}>選擇</OutlineButton>
                        <CancelButton extraClassName="w-full" onClick={onClearImage}>清除</CancelButton>
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