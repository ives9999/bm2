import {useContext, useEffect, useState} from 'react'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import SearchBar from "../../../component/form/searchbar/SearchBar"
import StatusForTable from '../../../component/StatusForTable'
import { FaRegTrashAlt } from "react-icons/fa"
import { GoGear } from "react-icons/go"
import { PrimaryButton, DeleteButton, EditButton } from '../../../component/MyButton'
import { getReadAPI } from '../../../context/member/MemberAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination, getPageParams} from '../../../component/Pagination'

function ReadMember() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState(null)

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const startIdx = (page-1)*perpage + 1

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員', href: '/admin/member', current: true },
    ]

    const {token} = auth

    const getData = async () => {
        const a = await getReadAPI(token, page, perpage)
        console.info(a);
        // .then(data => {
        //     console.info(data);
        // });
        // if (data.status === 200) {
        //     setRows(data.data.rows)

        //     var meta = data.data._meta
        //     const pageParams = getPageParams(meta)
        //     meta = {...meta, ...pageParams}
        //     setMeta(meta)
        // } else {
        //     var msgs1 = ""
        //     for (let i = 0; i < data["message"].length; i++) {
        //         const msg = data["message"][i].message
        //         msgs1 += msg + "\n"
        //     }
        //     if (msgs1.length > 0) {
                // setAlertModal({
                //     modalType: 'alert',
                //     modalText: msgs1,
                //     isModalShow: true,
                //     isShowOKButton: true,
                //     isShowCancelButton: false,
                // })
        //     }
        // }
    }

    useEffect(() => {
        setIsLoading(true)
        getData()
        .then((res) => {
            console.info(res);
        })
        .catch((e) => {
            const msg = e.response.data.message;
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: msg,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: false,
            })

        });
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEdit = () => {

    }
    const handleDelete = () => {

    }

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>會員列表</h2>
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
                                頭像
                            </th>
                            <th scope="col" className="px-6 py-3">
                                名稱/暱稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email/手機
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
                                    <img src={row.avatar} className='w-12' alt={row.nickname} />
                                </td>
                                <td className="px-6 py-4">
                                    {row.name}<br/>{row.nickname}
                                </td>
                                <td className="px-6 py-4">
                                    {row.email}<br/>{row.mobile}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusForTable status={row.status} status_text={row.status_text} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex flex-col md:flex-row gap-2'>
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

export default ReadMember
