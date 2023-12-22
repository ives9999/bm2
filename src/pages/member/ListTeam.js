import {useEffect, useContext, useState} from 'react'
import BMContext from '../../context/BMContext'
import { getList } from '../../context/team/TeamAction'

function ListTeam() {
    const {memberData, setIsLoading, setAlertModal} = useContext(BMContext)
    const {token} = memberData

    const [teams, setTeams] = useState([])

    useEffect(() => {
        const getData = async () => {
            const data = await getList(token)
            //console.info(data)
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
    return (
        <ul>
            {teams.map((team) => (
                <li key={team.id} className='text-Primary'>{team.name}</li>
            ))}
        </ul>
    )
}

export default ListTeam
