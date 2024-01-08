import {useEffect, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BMContext from '../../context/BMContext'
import { getList } from '../../context/team/TeamAction'
import Breadcrumb from '../../layout/Breadcrumb'
import {ManagerTeamGrid} from '../../component/Grid'
import { PrimaryButton } from '../../component/MyButton'

function ListTeam() {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)
    const {token} = memberData

    const [teams, setTeams] = useState([])
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '球隊', href: '/member/team', current: true },
    ]

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const data = await getList(token)
            if (data.status === 200) {
                setTeams(data.data.rows)
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

    const handleEdit = (token) => {
        var url = "/member/team/edit"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }

    const handleDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDelete,
            params: {token: token},
        })
    }

    const onDelete = (params) => {
        const token = params.token
    };

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">球隊列表</h2>
                <PrimaryButton extraClassName='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
                <div className='mx-4 md:mx-0 mt-8'>
                    {teams.map((team) => (
                        <div key={team.id}>
                            <ManagerTeamGrid row={team} handleEdit={handleEdit} handleDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ListTeam
