import React from 'react'

function TimePickerList({
    start,           // 時間列表的開始時間
    end,             // 時間列表的結束時間
    step,            // 時間列表的間隔
    selectedTime,    // 已經選定的時間
    setResult,       // 選擇完後的設定函式
    type='',         // type: start or end
    ml=''            // 左邊的位移
}) {

    const onClick = (time) => {
        setResult(type, time)
    }

    // 設定時間間隔的函式
    const timeRange = (start, end, step, selectedTime) => {
        // var start = "07:00"
        // const end = "23:00"
        step = step*60*1000

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

    const arr = timeRange(start, end, step, selectedTime)

    return (
        <div className="">
            <div className={`bg-gray-700 mt-1 w-1/4 lg:w-1/6 ${ml.length > 0 ? ml : ''}`}>
                <ul className='text-PrimaryText'>
                    {arr.map((item, idx) => (
                        <li key={idx} 
                            className={`px-6 py-1 hover:bg-gray-500 hover:text-MyWhite cursor-pointer ${item.selected ? "bg-gray-500 text-MyWhite" : ""}`} 
                            onClick={() => onClick(item.time)}
                        >{item.time}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TimePickerList
