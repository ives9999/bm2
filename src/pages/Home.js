import {useEffect, useContext} from 'react'
import BMContext from '../context/BMContext';
import { HomeTeam2 } from '../api/home/team2';
import { HomeArena } from '../api/home/arena';

const Home = () => {
    const {setIsLoading} = useContext(BMContext)
    // useEffect(() => {
    //     setIsLoading(false)
    //     console.info("aaa")
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <div className="row mt-70">
                    {/* <HomeTeam2 />
                    <HomeArena /> */}
                </div>
            </main>
        </div>
        </>
    );
}

export default Home;