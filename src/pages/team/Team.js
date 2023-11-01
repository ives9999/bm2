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
        // const config = {
        //     method: "GET",
        //     Headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }
        axios.get(api)
        .then(response => {
            dump(response)
            //if (response.data.success) {
                setTeam(response.data)
            //}
        })
    },[])

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
