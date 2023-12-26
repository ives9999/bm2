import {useState} from 'react'

export function TimePickerFor2({
    label,
    name,
    value,
    id,
    start,
    end,
    isRequired=false,
    isHidden=false,
}) {
    const [isShowStartEnd, setIsShowStartEnd] = useState(false)
    const toggle = () => {
        setIsShowStartEnd(!isShowStartEnd)
    }

    const toggleTime = () => {

    }

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
            const isSelected = (start == selectedTime) ? true : false
            arr = [...arr, {time: start, selected: isSelected}]
            startTime += step
        }
        
        return arr
    }

    const startArr = timeRange(start)
    const endArr = timeRange(end)

    return (
        <>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={name} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
                    *必填
                </span>
            </div>
            <button type="button" onClick={toggle} className="inline-flex items-center text-Primary font-medium hover:underline">
                {start} <p className="ms-1"> - {end} </p> 
                <svg className="w-3 h-3 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>

            <div className={`z-10 divide-y rounded-lg shadow w-80 lg:w-96 bg-gray-700 divide-gray-600 ${isShowStartEnd ? "block" : "hidden"}`}>
                <div className="p-3" aria-labelledby="dateRangeButton">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                            <input name="start" type="text" className="text-sm rounded-lg ring-Primary block w-full ps-10 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-MyWhite focus:Primary focus:Primary cursor-pointer" placeholder="開始時間" onClick={toggleTime} />
                        </div>
                        <span className="mx-2 text-gray-500 dark:text-gray-400">to</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                            <input name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="End date" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-gray-700 px-6 py-2 mt-1'>
                <ul className='text-PrimaryText'>
                    {startArr.map((time, idx) => (
                        <li key={idx}>{time.time}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}