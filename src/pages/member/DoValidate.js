import {useContext, useEffect, useState} from 'react'
import BMContext from '../../context/BMContext'
import useQueryParams from '../../hooks/useQueryParams'
import {getValidateAPI} from '../../context/member/MemberAction'
import { Info } from '../../component/Info'
import Breadcrumb from '../../layout/Breadcrumb'

// 從使用者郵件按下「驗證」鈕後，會開啟這個頁面，然侯直接進行驗證
function DoValidate() {
    const {setIsLoading} = useContext(BMContext)
    const { type, code, token } = useQueryParams()
    const [alert, setAlert] = useState({
        type: "success",
        message: "恭喜您完成認證！！",
    }) 

    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '認證', href: '/member/validate', current: true },
    ]

    // console.info("type: " + type)
    // console.info("token: " + token)
    // console.info("code: " + code)

    useEffect(() => {
        setIsLoading(true)

        const validate = async (type, code, token) => {
            const data = await getValidateAPI(type, code, token)
            console.info(data)
            if (data.status !== 200) {
                setAlert({type: 'failure', message: data.message.message})
            }
            return data
        }
        validate(type, code, token)
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-8">認證</h2>
                <div className='mx-8'><Info type={alert.type}>{alert.message}</Info></div>
            </main>
        </div>
    )
}

export default DoValidate
