import { OKButton, CancelButton } from './MyButton'
import {useNavigate} from 'react-router-dom'

function Flash() {
    const navigate = useNavigate()
    const goPrev = () => {
        navigate(-1);
    }
    const goHome = () => {
        navigate('/')
    }
    return (
        <div className='flex justify-center h-screen'>
            <div className="m-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">權限不足</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">必須要有管理員權限才能進入後台管理系統，請洽管理人員！！</p>
                <div className='flex items-center justify-between mt-12'>
                    <OKButton onClick={goPrev}>回上一頁</OKButton>
                    <CancelButton onClick={goHome}>回首頁</CancelButton>
                </div>
            </div>
        </div>
    )
}

export default Flash
