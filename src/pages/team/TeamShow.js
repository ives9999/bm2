import { React, useState, useEffect } from "react";
import axios from "axios";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'

import { dump } from "../../functions"

const domain = process.env.REACT_APP_ASSETS_DOMAIN

const TeamShow = () => {

    const windowUrl = window.location.search
    const params =new URLSearchParams(windowUrl)
    const token = params.get("token")
    // dump(token)
    const api = process.env.REACT_APP_API + "/team/show?token=" + token
    //dump(api);
    const [breadcrumbs, setBreadcrumbs] = useState([
        { name: '球隊', href: '/team', current: false },
    ])
    
    const [ team, setTeam ] = useState({})

    useEffect(() => {
        axios.get(api)
        .then(response => {
            //dump(response)
            if (response.data.success) {
                //setTeam(response.data.row)
                //breadcrumbs.push({name: response.data.row.name, href:'/team/show?token='+token, current: true})
                //dump(breadcrumbs)
                //setBreadcrumbs(breadcrumbs.push([{name: response.data.row.name, href:'/team/show?token='+token, current: true}]))
            }
        }, [team])
    })

    return (
        <>
        <Layout>
        <div className="mx-auto max-w-7xl">
            {/* <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10 xl:gap-x-8">
                            
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-blockColor ms-8 rounded-md border border-borderColor">
                        
                    </div> 
                </div>
            </main> */}
        </div>
        </Layout>
        </>
    );
}

export default TeamShow;
