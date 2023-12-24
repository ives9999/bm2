import {useEffect, useContext, useState} from 'react'
import BMContext from '../../context/BMContext'
import { getList } from '../../context/arena/ArenaAction'
import Breadcrumb from '../../layout/Breadcrumb'
import {ManagerArenaGrid} from '../../component/Grid'
import { PrimaryButton } from '../../component/MyButton'

function ListArena() {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)
    const {token} = memberData

    const [arenas, setArenas] = useState([])
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '球館', href: '/member/arena', current: true },
    ]

    useEffect(() => {
        const getData = async () => {
            const data = await getList(token)
            if (data.status === 200) {
                setArenas(data.data.rows)
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
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary text-center text-4xl font-bold mb-8">球隊列表</h2>
                <PrimaryButton extraClassName='ml-auto mr-4 md:mr-0'>新增</PrimaryButton>
                <div className='mx-4 md:mx-0 mt-8'>
                    {arenas.map((arena) => (
                        <div key={arena.id}>
                            <ManagerArenaGrid row={arena}/>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ListArena
