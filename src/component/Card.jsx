import React from 'react'

export function JustTitleCard({title, onClick=null}) {

    return (
        <div className={`flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800
        ${onClick != null ? ' cursor-pointer' : ''}`} onClick={onClick}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </div>
    )
}
export function Card({
    title,
    content
}) {
    return (
        <div
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
        </div>
    )
}

export function HeroCard({
    title,
    content,
    icon = null,
    onClick = null,
    onMouseEnter = null,
    onMouseLeave = null,
}) {


    return (
        <div
            className="block max-w-sm p-6 bg-white border border-gray-500 rounded-lg shadow hover:bg-gray-100 dark:hover:border-solid dark:bg-PrimaryBlock-900 dark:border-gray-600 dark:hover:bg-PrimaryBlock-800 cursor-pointer"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <h5 className="flex items-center gap-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {icon}
                {title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
        </div>
    )
}

export function CardWithTitle({title, children, mainClassName}) {
    return (
        <div
            className={"w-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 " + mainClassName}>
            <div
                className="flex flex-wrap text-sm font-medium text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-500 dark:text-gray-400 dark:bg-gray-700">
                <h2 className='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
                    {title}
                </h2>
                <div className="w-full"
                     aria-labelledby="accordion-collapse-heading-1">
                    <div
                        className="p-4 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
