import {useEffect, useState} from 'react'
import { getHome } from '../context/home/HomeAction';
import Grid from '../component/Grid';

const Home = () => {
    // const {setIsLoading} = useContext(BMContext)
    const [teams, setTeams] = useState([])
    const [arenas, setArenas] = useState([])
    useEffect(() => {
        const fetch = async () => {
            const data = await getHome()
            // data is {team: team, arena: arena}
            // team and arena is {status: 200, data: [{}, {}, {}]}
            setTeams(data.team.data)
            setArenas(data.arena.data)
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        <div className="mx-auto max-w-screen-xl">
            <main className="isolate">
                <div className="row mt-70">
                    <section className="">
                        <div className="py-8 lg:py-16">
                            <div className="mx-auto max-w-screen-sm text-left mb-8 lg:mb-12 lg:ml-2">
                                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">最新登錄球隊</h2>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {teams.map(team =>    
                                <Grid 
                                    key={team.token}
                                    able="team"
                                    featured={process.env.REACT_APP_ASSETS_DOMAIN + team.path}
                                    name={team.name} 
                                    token={team.token}
                                    arena_name={team.arena_name} 
                                    arena_token={team.arena_token}
                                    city_id={team.city_id} 
                                    city_name={team.city_name}
                                    area_id={team.area_id} 
                                    area_name={team.area_name}
                                    nickname={team.nickname}
                                    avatar={process.env.REACT_APP_ASSETS_DOMAIN + team.avatar}
                                    member_token={team.member_token}
                                    created_at={team.created_at}
                                />
                                )}
                            </div>
                            <div className="mt-24 mx-auto max-w-screen-sm text-left mb-8 lg:mb-12 lg:ml-2">
                                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">最新登錄球館</h2>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {arenas.map(arena =>    
                                <Grid 
                                    key={arena.token}
                                    able="arena"
                                    featured={process.env.REACT_APP_ASSETS_DOMAIN + arena.path}
                                    name={arena.name} 
                                    token={arena.token}
                                    // arena_name={team.arena_name} 
                                    // arena_token={team.arena_token}
                                    city_id={arena.city_id} 
                                    city_name={arena.city_name}
                                    area_id={arena.area_id} 
                                    area_name={arena.area_name}
                                    nickname={arena.nickname}
                                    avatar={process.env.REACT_APP_ASSETS_DOMAIN + arena.avatar}
                                    member_token={arena.member_token}
                                    created_at={arena.created_at}
                            />
                                )}
                            </div>
                        </div> 
                    </section>
                    <ul>
                        {teams.map(team => 
                            <li key={team.id}>{team.name}</li>
                        )}
                    </ul>
                    {/* <HomeTeam2 />
                    <HomeArena /> */}
                </div>
            </main>
        </div>
        </>
    );
}

export default Home;