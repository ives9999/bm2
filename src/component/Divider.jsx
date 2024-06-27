import React from 'react'

export default function Divider({
    text,
    lineColor="bg-gray-700",
    textColor="white",
    textSize="font-medium",
    textBG="gray-900",
    width='w-full'
}) {
    return (
        <div className="inline-flex items-center justify-center w-full">
            <hr className={`${width} h-px my-8 bg-gray-200 border-0 dark:${lineColor}`} />
            <span className={`absolute px-3 ${textSize} -translate-x-1/2 left-1/2 text-${textColor} bg-${textBG}`}>{text}</span>
        </div>
    )
}
