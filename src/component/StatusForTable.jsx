import React from 'react'

function StatusForTable({status, status_text}) {
    if (status === 'online') {
        return (
            <div className='flex flex-row gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-green-400'></div>
                <div>{status_text}</div>
            </div>
        )
    } else if (status === 'offline') {
        return (
            <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-red-500'></div>
                <div>{status_text}</div>
            </div>
        )
    } else if (status === 'trash') {
        return (
            <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                <div>{status_text}</div>
            </div>
        )
    } else {
        return (
            <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-green-400'></div>
                <div>{status_text}</div>
            </div>
        )
    }
}

export default StatusForTable
