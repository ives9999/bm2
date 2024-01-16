import { React, useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from '../../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'

const api = process.env.REACT_APP_API + "/arena"
const domain = process.env.REACT_APP_ASSETS_DOMAIN

const breadcrumbs = [
    { name: '球館', href: '/arena', current: true },
]


const Arena = () => {

    const [ arena, setArena ] = useState({rows: []})
    const toArena = (id) => {
        window.location.href = "/arena/" + id
    }
    useEffect(() => {
        axios.get(api)
        .then(response => {
            //dump(response)
            setArena(response.data)
        })
    })

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2 xl:gap-x-8">
                    {arena.rows.map((row) => (
                        <div key={row.id} className="bg-blockColor rounded-md border border-borderColor">
                            <div className="group relative">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                                    <a href={"/arena/" + row.id}>
                                    <img
                                        src={domain + row.featured}
                                        alt={row.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                    </a>
                                </div>
                            </div>
                            <div className="mt-4 justify-between">
                                <div className="mb-6 flex flex-row justify-between">
                                    <div className=""><a className="text-tagColor text-sm hover:text-focusBlue" href={"/arena/" + row.zone["city_id"]}>{row.zone["city_name"]}</a></div>
                                    <div className="">
                                        <div className="text-tagColor text-sm hover:text-focusBlue flex">
                                            <UserIcon className="h-5 w-5 align-middle" aria-hidden="true" />
                                            <div className="">{row.pv} 次</div>
                                        </div>
                                    </div>
                                </div>
                                <a href={"/arena/" + row.id} className="text-textTitleColor text-textTitleSize hover:text-focusBlue focus:text-focusBlue">{row.name}</a>
                                <div className="mt-8 mb-6 flex flex-row justify-between">
                                    <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue flex flex-row">
                                        <a className="" href={"/member/" + row.member["id"]}><img className="w-12 h-12 rounded-full" src={domain + row.member["avatar"]} alt={row.member["nickname"]} /></a>
                                        <div className="-mt-2">
                                            <a href={"/member/" + row.member["token"]} className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["nickname"]}</a>
                                            <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["created_at"]}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            toArena(row.id)
                                        }}
                                    >
                                        更多...
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
        </>
    );
}

export default Arena;
