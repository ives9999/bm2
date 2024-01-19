import {useContext, useEffect, useState} from 'react'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import SearchBar from "../../../component/form/searchbar/SearchBar"
import { FaRegTrashAlt } from "react-icons/fa"
import { GoGear } from "react-icons/go"
import { PrimaryButton } from '../../../component/MyButton'
import { getReadAPI } from '../../../context/member/MemberAction'
import useQueryParams from '../../../hooks/useQueryParams'

function Read() {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)

    const [members, setMembers] = useState([])

    var { page, perpage } = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const startIdx = (page-1)*perpage + 1

    const breadcrumbs = [
        { name: '後台首頁', href: '/admin', current: false },
        { name: '會員', href: '/admin/member', current: true },
    ]

    const {token} = memberData

    useEffect(() => {
        const getData = async () => {
            const data = await getReadAPI(token)
            console.info(data)
            if (data.status === 200) {
                setMembers(data.data.rows)
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

        if (token && token.length > 0) {
            setIsLoading(true)
            getData()
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const handleEdit = () => {

    }

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>會員列表</h2>
            <div className='flex justify-between'>
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
                    <PrimaryButton extraClassName='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
                </div>
            </div>

            <div className="relative overflow-x-auto mt-4">
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
                                名稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                匿稱
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                手機
                            </th>
                            <th scope="col" className="px-6 py-3">
                                功能
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, idx) => (
                            <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {startIdx + idx}
                                </th>
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    {member.id}
                                </td>
                                <td class="px-6 py-4">
                                    <img src={member.avatar} className='' alt={member.nickname} />
                                </td>
                                <td class="px-6 py-4">
                                    {member.name}
                                </td>
                                <td class="px-6 py-4">
                                    {member.nickname}
                                </td>
                                <td class="px-6 py-4">
                                    {member.email}
                                </td>
                                <td class="px-6 py-4">
                                    {member.mobile}
                                </td>
                                <td class="px-6 py-4">
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Read
