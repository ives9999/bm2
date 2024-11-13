import React from 'react'
import {Link} from 'react-router-dom';
import { ClockIcon, CalendarDaysIcon, CogIcon, StopIcon, EyeIcon, MapIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { SecondaryButton, DeleteButton, EditButton } from './MyButton'
import { formattedWithSeparator } from '../functions/math';
import {FaShoppingCart} from "react-icons/fa";
import Featured from './Featured'

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
            <Link to={"/"+able+"/"+token}>
                <img
                className="w-full rounded-4xl p-4"
                src={featured}
                alt={name}
                />
            </Link>
            <div className="px-5 pb-5">
                <h3 className="text-xl font-bold tracking-tight text-MyWhite hover:text-Primary-300">
                    <Link to={"/"+able+"/"+token}>{name}</Link>
                </h3>
                <div className="mb-6 mt-3 flex flex-row justify-between">
                    <Link to={`/arena/${arena_token}`} className="text-SubText hover:text-Primary-300">{arena_name}</Link>
                    <div>
                        <Link className='text-SubText hover:text-Primary-300 mr-4' to={`/team?city_id=${city_id}`}>{city_name}</Link>
                        <Link className='text-SubText hover:text-Primary-300' to={`/team?area_id=${area_id}`}>{area_name}</Link>
                    </div>
                </div>
                <div className="mt-8 mb-6 flex flex-row justify-between">
                    <div className="text-base font-bold text-SubText hover:text-Primary-300 focus:text-Primary-300 flex flex-row">
                        <Link className="" to={`/member/${member_token}`}><img className="w-12 h-12 rounded-full" src={avatar} alt={nickname} /></Link>
                        <div className="-mt-2">
                            <Link to={`/member/${member_token}`} className="text-base text-SubText hover:text-Primary-300 focus:text-Primary-300 ms-2">{nickname}</Link>
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

export function ManagerTeamGrid({idx, row, handleEdit, handleDelete}) {
    return (
        <div className="mb-8 py-4 px-2 flex items-center gap-2 rounded-lg border shadow-sm border-PrimaryBlock-800 bg-PrimaryBlock-950">
            {/* 圖片 */}
            <div className='flex flex-col w-20'>
                <Link className='flex justify-center' to={`/team/${row.token}`} alt={row.name}>
                    <img className='w-16 h-16 rounded-full' src={row.featured} alt={row.name} />
                </Link>
                <div className='flex justify-center items-center gap-2 text-SubText mt-2'>
                    <EyeIcon className='w-4 h-4' />{formattedWithSeparator(row.pv)}
                </div>
            </div>

            {/* 資料 */}
            <div className='grow ml-2'>
                <div className='flex flex-col lg:flex-row lg:gap-2'>
                    <div className='flex gap-1 items-center'>
                        <div className='text-2xl text-Primary-300 mb-1'>{idx}.</div>
                        <Link to={`/team/${row.token}`} className='text-Primary-300 text-2xl mb-1'>{row.name}</Link>
                    </div>
                    {row.arena ?
                        <Link className='text-PrimaryBlock-200 text-xl mb-1 lg:mt-0.5' to={`/arena/${row.arena.token}`}>{row.arena.name}</Link>
                        : <div></div>
                    }
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
                            <StopIcon className='w-4 h-4' />
                            {row.block || row.block !== null ?
                                row.block + "塊"
                            : "未提供"
                            }
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

export function ManagerArenaGrid({idx, row, handleEdit, handleDelete}) {
    return (
        <div className="mb-8 py-4 px-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950">
            {/* 圖片 */}
            <div className='flex-col w-20'>
                <Link className='flex justify-center' to={`/arena/${row.token}`} alt={row.name}>
                    <img className='w-16 h-16 rounded-full' src={row.featured} alt={row.name} />
                </Link>
                <div className='flex justify-center items-center gap-2 text-SubText mt-2'>
                    <EyeIcon className='w-4 h-4' />{formattedWithSeparator(row.pv)}
                </div>
            </div>

            {/* 資料 */}
            <div className='grow ml-2'>
                <Link to={`/arena/${row.token}`} className='text-Primary-300 text-2xl'>{row.name}</Link>
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
            <div className='flex flex-col md:flex-row gap-2'>
                <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
            </div>
        </div>
    )
}

export function ProductHomeGrid({
    idx=-1,
    product,
    addCart
}) {
    // console.info(product.cat);
    return (
        <div key={product.token} className="rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950">
            <Featured src={product.images} link={"/product/show/"+product.token} alt={product.name} />
            <div className="px-5 pb-5">
                <h3 className="text-xl font-bold tracking-tight text-MyWhite hover:text-Primary-300">
                    <Link to={`/product/show/${product.token}`}>
                        {idx >= 0 ? <span className=''>{idx}. </span> : ''}
                        {product.name}
                    </Link>
                </h3>
                <div className="mb-6 mt-3 flex flex-row justify-between">
                    <div className='flex flex-row gap-2 items-center text-MyWhite'>
                        <Link to={`/product?cat=${product.cat[product.cat.length-1].token}`} className="text-SubText hover:text-Primary-300">{product.cat[product.cat.length-1].name}</Link>
                        <div className="">
                            <FaShoppingCart className='w-5 h-5 cursor-pointer'
                                            onClick={() => addCart(product.token)}/>
                        </div>
                    </div>
                    <div>
                        <span className='text-Warning-500 mr-4'>
                            {(product.prices[0].sellPrice) ? "NT$ " + formattedWithSeparator(product.prices[0].sellPrice) : '洽詢'}
                        </span>
                        <del className='text-SubText'>
                            {(product.prices[0].price_nonmember) ? "NT$ "+formattedWithSeparator(product.prices[0].price_nonmember) : ''}
                        </del>
                    </div>
                </div>
                <div className="mt-8 mb-6 flex flex-row justify-end">
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
