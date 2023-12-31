import { React, useState, useEffect } from "react";
import axios from "axios";
import { UserIcon } from '@heroicons/react/24/outline'

const api = process.env.REACT_APP_API + "/home/arena"
const domain = process.env.REACT_APP_ASSETS_DOMAIN

  export function HomeArena() {

    const [ arena, setArena ] = useState([
        // {id:1, name: 'a', path: ''}, 
        // {id:2, name: 'b', path: ''}, 
    ])

    const toArena = (id) => {
        window.location.href = "/arena/" + id
    }

    useEffect(() => {
        const config = {
            method: "POST",
            Headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post(api, {}, config)
        .then(response => {
            if (response.data.success) {
            //     var rows = []
            //     for (var i = 0; i < response.data.rows.length; i++) {
            //         const temp = response.data.rows[i]
            //         const _row = {
            //             id: temp.id,
            //             name: temp.name,
            //             path: temp.path,
            //         }
            //         rows.push(_row)
            //     }
                setArena(response.data.rows)
            }
        })
    },[])

    return (
        <div className="mx-auto max-w-2xl py-8 sm:py-16 lg:max-w-7xl">
          <h2 className="text-4xl font-bold tracking-tight text-Primary-300 mb-16">最新登錄球館</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">

            {arena?.map((row) => (
                <div key={row.id} className="bg-blockColor rounded-md border border-borderColor">
                    <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                            <a href={"/arena/" + row.id}>
                            <img
                                src={domain + row.path}
                                alt={row.name}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                            </a>
                        </div>
                        <div className="mt-4 justify-between">
                            <div className="mb-6 flex flex-row justify-between">
                                <div className=""><a className="text-tagColor text-sm hover:text-focusBlue" href={"/arena/" + row.city_id}>{row.city_name}</a></div>
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
                                    <a className="" href={"/member/" + row.member_id}><img className="w-12 h-12 rounded-full" src={domain + row.avatar} alt={row.nickname} /></a>
                                    <div className="-mt-2">
                                        <a href={"/member/" + row.member_id} className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.nickname}</a>
                                        <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.created_at}</div>
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
                </div>
            ))}

          </div>
        </div>
    )
  }
  