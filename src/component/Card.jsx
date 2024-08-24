import React from 'react'
import {formattedWithSeparator} from "../functions/math";
import {noSec} from "../functions/date";

export function Card({
    title,
    content
}) {
    return (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
        </div>
    )
}

export function HeroCard({
    title,
    content
                         }) {
    return (
        <div className="block max-w-sm p-6 bg-white border-dashed border-2 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:hover:border-solid dark:bg-PrimaryBlock-900 dark:border-PrimaryBlock-600 dark:hover:bg-PrimaryBlock-800 cursor-pointer">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
        </div>
    )
}

export function CardWithTitle({ title, children, mainClassName }) {
    return(
    <div
        className={"w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 " + mainClassName}>
        <div
            className="flex flex-wrap text-sm font-medium text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
            <h2 className='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
                {title}
            </h2>
            <div className="w-full"
                 aria-labelledby="accordion-collapse-heading-1">
                <div
                    className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    {children}
                </div>
            </div>
        </div>
    </div>
    )
}
