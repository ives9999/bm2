import { React, useState, useEffect } from "react";
import axios from "axios";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

const api = process.env.REACT_APP_API + "/home/team"
const domain = process.env.REACT_APP_ASSETS_DOMAIN

  export function HomeTeam2() {

    const [ team, setTeam ] = useState([
        // {id:1, name: 'a', path: ''}, 
        // {id:2, name: 'b', path: ''}, 
    ])

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
                setTeam(response.data.rows)
            }
        })
    },[])

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-myPrimary">最新登錄球隊</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">

            {team?.map((row) => (
                <div className="bg-blockColor p-6 rounded-md border border-borderColor">
                    <div key={row.id} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            <img
                                src={domain + row.path}
                                alt={row.name}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3><a className="text-tagColor text-sm hover:text-focusBlue" href={"/arena/" + row.arena_id}>{row.arena_name}</a></h3>
                                <p className="mt-1 text-textTitleColor text-textTitleSize hover:text-focusBlue focus:text-focusBlue">{row.name}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{row.id}</p>
                        </div>
                    </div>
                </div>
            ))}

          </div>
        </div>
    )
  }
  