import { React, useState, useEffect } from "react";
import axios from "axios";
import Layout from '../../layout/Layout';
import Breadcrumb from '../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'

import { dump } from "../../functions"

const domain = process.env.REACT_APP_ASSETS_DOMAIN

const breadcrumbs = [
    { name: '球隊', href: '/team', current: true },
]

const TeamShow = () => {

    const windowUrl = window.location.search
    const params =new URLSearchParams(windowUrl)
    const token = params.get("token")
    const api = process.env.REACT_APP_API + "/team/show?token=" + token
    dump(api);
    const [ team, setTeam ] = useState({})

    // useEffect(() => {
    //     axios.get(api)
    //     .then(response => {
    //         //dump(response)
    //         setTeam(response.data)
    //     })

    // })
}

export default TeamShow;
