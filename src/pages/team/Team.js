import { React, useState, useEffect } from "react";
import axios from "axios";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'
import { dump } from "../../functions"

const api = process.env.REACT_APP_API + "/team"
const domain = process.env.REACT_APP_ASSETS_DOMAIN

const breadcrumbs = [
    { name: '球隊', href: '/team', current: true },
]


const Team = () => {

    const [ team, setTeam ] = useState([])
    useEffect(() => {
        axios.get(api)
        .then(response => {
            //dump(response)
            setTeam(response.data)
        })
    })

    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2 xl:gap-x-8">
                    {team.rows.map((row) => (
                        <div className="bg-blockColor rounded-md border border-borderColor">
                            <div key={row.id} className="group relative">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                                    <a href={"/team/" + row.id}>
                                    <img
                                        src={domain + row.featured}
                                        alt={row.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Team;
