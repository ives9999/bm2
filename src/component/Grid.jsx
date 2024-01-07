import React from 'react'
import { ClockIcon, CalendarDaysIcon, CogIcon, StopIcon, EyeIcon, MapIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { SecondaryButton, DeleteButton, EditButton } from './MyButton'

export function Grid({
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
        <div className="rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950">
            <a href={"/"+able+"/"+token}>
                <img
                className="w-full rounded-4xl p-4"
                src={featured}
                alt={name}
                />
            </a>
            <div className="px-5 pb-5">
                <h3 className="text-xl font-bold tracking-tight text-PrimaryEnd hover:text-Primary-300">
                    <a href={"/"+able+"/"+token}>{name}</a>
                </h3>
                <div className="mb-6 mt-3 flex flex-row justify-between">
                    <a href={"/arena/"+arena_token} className="text-SubText hover:text-Primary-300">{arena_name}</a>
                    <div>
                        <a className='text-SubText hover:text-Primary-300 mr-4' href={"/team?city_id="+city_id}>{city_name}</a>
                        <a className='text-SubText hover:text-Primary-300' href={"/team?area_id="+area_id}>{area_name}</a>
                    </div>
                </div>
                <div className="mt-8 mb-6 flex flex-row justify-between">
                    <div className="text-base font-bold text-SubText hover:text-Primary-300 focus:text-Primary-300 flex flex-row">
                        <a className="" href={"/member/" + member_token}><img className="w-12 h-12 rounded-full" src={avatar} alt={nickname} /></a>
                        <div className="-mt-2">
                            <a href={"/member/" + member_token} className="text-base text-SubText hover:text-Primary-300 focus:text-Primary-300 ms-2">{nickname}</a>
                            <div className="ms-2">{created_at}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export function ManagerTeamGrid({row, handleEdit, handleDelete}) {
    return (
        <div className="mb-8 py-4 px-2 flex items-center gap-2 rounded-lg border shadow-sm border-PrimaryBlock-800 bg-PrimaryBlock-950">
            {/* 圖片 */}
            <div className='flex-col w-20'>
                <a className='flex justify-center' href={"/team/"+row.token} alt={row.name}>
                    <img className='w-16 h-16 rounded-full' src={row.featured} alt={row.name} />
                </a>
                <div className='flex justify-center items-center gap-2 text-SubText mt-2'>
                    <EyeIcon className='w-4 h-4' />{row.pv}
                </div>
            </div>

            {/* 資料 */}
            <div className='grow ml-2'>
                <div className='flex flex-col lg:flex-row lg:gap-2'>
                    <a href={"/team/"+row.token} className='text-Primary-300 text-2xl mb-1'>{row.name}</a>
                    <a className='text-PrimaryBlock-200 text-xl mb-1 lg:mt-0.5' href={"/arena/"+row.arena.token}>{row.arena.name}</a>
                </div>
                <div className='flex-row gap-4 lg:flex mt-2'>
                    <div className='text-SubText flex items-center gap-2'>
                        <div className='flex items-center'>
                            <CalendarDaysIcon className='w-4 h-4 mr-1' />{row.weekdays.chineses.map((chinese, idx) => (
                                <div key={row.id + "-" + idx}>
                                    <span>{chinese}</span>
                                    <span className={`${idx === row.weekdays.chineses.length-1 ? "" : "mr-1"}`}>{`${idx === row.weekdays.chineses.length-1 ? "" : ","}`}</span>
                                </div>
                            ))}
                        </div>
                        <div className='flex items-center'>
                            <ClockIcon className='w-4 h-4 mr-1' />{row.play_start} ~ {row.play_end}
                        </div>
                    </div>
                    <div className='text-SubText flex items-center gap-2'>
                        <div className='flex items-center gap-1'>
                            <CogIcon className='w-4 h-4' />{row.ball}
                        </div>
                        <div className='flex items-center gap-1'>
                            <StopIcon className='w-4 h-4' />{row.block}塊
                        </div>
                    </div>
                </div>
            </div>

            {/* 編輯 */}
            <div className='flex flex-col md:flex-row gap-2'>
                <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
            </div>
        </div>
    )
}

export function ManagerArenaGrid({row}) {
    return (
        <div className="mb-8 py-4 px-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950">
            {/* 圖片 */}
            <div className='flex-col w-20'>
                <a className='flex justify-center' href={"/arena/"+row.token} alt={row.name}>
                    <img className='w-16 h-16 rounded-full' src={row.featured} alt={row.name} />
                </a>
                <div className='flex justify-center items-center gap-2 text-SubText mt-2'>
                    <EyeIcon className='w-4 h-4' />{row.pv}
                </div>
            </div>

            {/* 資料 */}
            <div className=''>
                <a href={"/arena/"+row.token} className='text-Primary-300 text-2xl'>{row.name}</a>
                <div className='flex-row gap-4 lg:flex mt-2'>
                    <div className='text-SubText lg:flex items-center'>
                        <div className='flex items-center'>
                            <MapIcon className='w-4 h-4 mr-1' />
                            <span>{row.zone.city_name}</span>
                            <span>{row.zone.area_name}</span>
                            <span className=''>{row.zip}</span>
                        </div>
                        <span className=''>{row.road}</span>
                    </div>
                    <div className='text-SubText flex items-center gap-2'>
                        <div className='flex items-center gap-1'>
                            <PhoneIcon className='w-4 h-4' />{row.tel}
                        </div>
                    </div>
                    <div className='text-SubText flex items-center gap-2'>
                        <div className='flex items-center'>
                            <ClockIcon className='w-4 h-4 mr-1' />{row.open_time} ~ {row.close_time}
                        </div>
                    </div>
                </div>
            </div>

            {/* 編輯 */}
            <div className='grow flex flex-row-reverse w-32'>
                <SecondaryButton>編輯</SecondaryButton>
            </div>
        </div>
    )
}
