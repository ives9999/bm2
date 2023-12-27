import React from 'react'

function TimePickerList({
    start,
    end,
    step,
    selectedTime
}) {
    const timeRange = (selectedTime) => {
        var start = "07:00"
        const end = "23:00"
        var step = 30*60*1000

        var startTime = Date.parse('01 Jan 1970 ' + start + ':00')
        const endTime = Date.parse('01 Jan 1970 ' + end + ':00')
        var arr = []
        while (startTime <= endTime) {
            const date = new Date(startTime)
            const h = (date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()
            const m = (date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()
            start = h + ":" + m
            const isSelected = (start === selectedTime) ? true : false
            arr = [...arr, {time: start, selected: isSelected}]
            startTime += step
        }
        return arr
    }

    return (
        <div className="">
            <div className={`ml-48 bg-gray-700 mt-1 w-1/4 lg:w-1/6 ${time.isShowEnd ? "block" : "hidden"}`}>
                <ul className='text-PrimaryText'>
                    {endArr.map((item, idx) => (
                        <li key={idx} 
                            className={`px-6 py-1 hover:bg-gray-500 hover:text-MyWhite cursor-pointer ${item.selected ? "bg-gray-500 text-MyWhite" : ""}`} 
                            onClick={() => handleEnd(item.time)}
                        >{item.time}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TimePickerList
