import Layout from '../layout/Layout';
import { HomeTeam2 } from '../api/home/team2';
import { HomeArena } from '../api/home/arena';

const Home = () => {

    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <div className="row mt-70">
                    <HomeTeam2 />
                    <HomeArena />
                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Home;