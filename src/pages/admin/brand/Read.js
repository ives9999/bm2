import {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import SearchBar from "../../../component/form/searchbar/SearchBar"
import StatusForTable from '../../../component/StatusForTable'
import { FaRegTrashAlt } from "react-icons/fa"
import { GoGear } from "react-icons/go"
import { PrimaryButton, DeleteButton, EditButton } from '../../../component/MyButton'
import { getReadAPI } from '../../../context/product/ProductAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination, getPageParams} from '../../../component/Pagination'
import { formattedWithSeparator } from '../../../functions/math'

function ReadBrand() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState(null)

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const startIdx = (page-1)*perpage + 1

    const navigate = useNavigate()

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '商品', href: '/admin/product', current: true },
    ]

    const {token} = auth

    useEffect(() => {
        const getData = async () => {
            const data = await getReadAPI(page, perpage)
            if (data.status === 200) {
                setRows(data.data.rows)

                var meta = data.data._meta
                const pageParams = getPageParams(meta)
                meta = {...meta, ...pageParams}
                setMeta(meta)
            } else {
                var msgs1 = ""
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
                }
                if (msgs1.length > 0) {
                    setAlertModal({
                        modalType: 'alert',
                        modalText: msgs1,
                        isModalShow: true,
                        isShowOKButton: true,
                        isShowCancelButton: false,
                    })
                }
            }
        }

        setIsLoading(true)
        getData()
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const handleEdit = (token) => {
        var url = "/admin/product/update"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }
    const handleDelete = () => {

    }

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>商品列表</h2>
            <div className='flex justify-between mb-6'>
                <div className="flex items-center justify-center">
                    <div className="mr-4">
                        <SearchBar 
                            name="arena" 
                            // value={(arena !== null && arena !== undefined && arena.value !== null && arena.value !== undefined) ? arena.value : ''} 
                            // placeholder="請輸入球館名稱"
                            // isShowList={arenas.isShowArenasList}
                            // list={arenas.list}
                            // handleChange={onChange}
                            // onClear={handleClear}
                            // setResult={setArena}
                            // isRequired={true}
                            // errorMsg={errorObj.arenaError.message}
                        />
                    </div>
                    <div className='h-full w-4 border-l border-gray-600'></div>
                    <div className='flex gap-4'>
                        <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/>
                    </div>
                </div>
                <div>
                    <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                代表圖
                            </th>
                            <th scope="col" width='20%' className="px-6 py-3">
                                名稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                狀態
                            </th>
                            <th scope="col" className="px-6 py-3">
                                功能
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {startIdx + idx}
                                </th>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {row.id}
                                </td>
                                <td className="px-6 py-4">
                                    <img src={row.featured} className='w-12 h-12 rounded-full' alt={row.name} />
                                </td>
                                <td className="px-6 py-4">
                                    {row.name}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusForTable status={row.status} status_text={row.status_text} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex flex-col sm:flex-row gap-2'>
                                        <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                                        <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='100'>
                               {meta && <Pagination token={token} meta={meta} />}
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    )
}

export default ReadBrand

function tag(type, text) {
    if (type === 'clothes') {
        return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{text}</span>
    } else if (type === 'racket') {
        return <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{text}</span>
    } else if (type === 'shoes') {
        return <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{text}</span>
    } else if (type === 'coin') {
        return <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{text}</span>
    } else if (type === 'match') {
        return <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{text}</span>
    } else if (type === 'subscription') {
        return <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">{text}</span>
    } else if (type === 'mejump') {
        return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">{text}</span>
    }
}
