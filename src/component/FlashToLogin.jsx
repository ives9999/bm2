import { OKButton, CancelButton } from './MyButton'
import {useNavigate} from 'react-router-dom'

function FlashToLogin() {
    const navigate = useNavigate()
    const goPrev = () => {
        navigate(-1);
    }
    const goLogin = () => {
        navigate('/member/login');
    }
    return (
        <div className='flex justify-center h-screen'>
            <div className="m-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">請先登入</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">必須先登入才能使用會員系統的功能，或請洽管理人員！！</p>
                <div className='flex items-center justify-between mt-12'>
                    <OKButton onClick={goLogin}>登入</OKButton>
                    <CancelButton onClick={goPrev}>回上一頁</CancelButton>
                </div>
            </div>
        </div>
    )
}

export default FlashToLogin
