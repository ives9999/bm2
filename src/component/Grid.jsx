import React from 'react'

function Grid({
    able,
    featured, 
    name,
    token, 
    arena_token, 
    arena_name,
    city_id, 
    city_name, 
    area_id, 
    area_name, 
    nickname,
    avatar,
    member_token, 
    created_at, 
}) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-MenuBG">
            <a href={"/"+able+"/"+token}>
                <img
                className="w-full rounded-4xl p-4"
                src={featured}
                alt={name}
                />
            </a>
            <div className="px-5 pb-5">
                <h3 className="text-xl font-bold tracking-tight text-PrimaryEnd hover:text-Primary">
                    <a href={"/"+able+"/"+token}>{name}</a>
                </h3>
                <div className="mb-6 mt-3 flex flex-row justify-between">
                    <a href={"/arena/"+arena_token} className="text-SubText hover:text-Primary">{arena_name}</a>
                    <div>
                        <a className='text-SubText hover:text-Primary mr-4' href={"/team?city_id="+city_id}>{city_name}</a>
                        <a className='text-SubText hover:text-Primary' href={"/team?area_id="+area_id}>{area_name}</a>
                    </div>
                </div>
                <div className="mt-8 mb-6 flex flex-row justify-between">
                    <div className="text-base font-bold text-SubText hover:text-Primary focus:text-Primary flex flex-row">
                        <a className="" href={"/member/" + member_token}><img className="w-12 h-12 rounded-full" src={avatar} alt={nickname} /></a>
                        <div className="-mt-2">
                            <a href={"/member/" + member_token} className="text-base text-SubText hover:text-Primary focus:text-Primary ms-2">{nickname}</a>
                            <div className="ms-2">{created_at}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={(e) => {
                            e.preventDefault()
                            //toTeam(row.id)
                        }}
                    >
                        更多...
                    </button>
                </div>
                <div className="mb-4 mt-3 font-light text-gray-500 dark:text-gray-400">
                
                </div>
                
            </div>
        </div>
    )
}

export default Grid
