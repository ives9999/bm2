import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'

const breadcrumbs = [
    { name: '球隊', href: '/team', current: true },
]

const Team = () => {
    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2 xl:gap-x-8">

                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Team;
