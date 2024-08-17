import React from 'react'

function JustLabel({
    children,
    label,
    containerClass,
    className,
}) {
    return (
        <div className={`flex flex-row px-4 py-4 bg-PrimaryBlock-900 rounded-md border border-PrimaryBlock-600 items-center ${containerClass}`}>
            <div>{label}：</div>
            <div className={`text-rabbit-400 ${className}`}>{children}</div>
        </div>
    )
}

export default JustLabel
