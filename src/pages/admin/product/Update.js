import {useContext, useState, useEffect} from 'react'
import BMContext from '../../../context/BMContext'
import {useParams} from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction'

function UpdateProduct() {
    const {memberData, setAlertModal, setIsLoading} = useContext(BMContext)
    const {token} = useParams()
    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '商品', href: '/admin/product', current: false },
        { name: '新增商品', href: '/admon/product/update', current: true },
    ]
    const [formData, setFormData] = useState({
        name: '',
        status: 'online',
    })

    useEffect(() => {
        const getOne = async (token) => {
            var data = await getOneAPI(token, 'update')
        }

        getOne(token)
    })

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>編輯商品</h2>
        
        </div>
    )
}

export default UpdateProduct
