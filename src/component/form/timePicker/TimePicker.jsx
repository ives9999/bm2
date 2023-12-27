import {useState} from 'react'
import { CalendarIcon } from '@heroicons/react/24/solid'
import TimePickerList from './TimePickerList'

export function TimePickerFor2({
    label,
    startName,
    startValue,
    startId,
    startPlaceholder,
    endName,
    endValue,
    endId,
    endPlaceholder,
    handleChange,
    isRequired=false,
    isHidden=false,
}) {
    const [isShowStartEnd, setIsShowStartEnd] = useState(false)
    const toggle = () => {
        setIsShowStartEnd(!isShowStartEnd)
    }

    const [time, setTime] = useState({
        startTime: startValue,
        endTime: endValue,
        isShowStart: false,
        isShowEnd: false,
    })
    const toggleStart = () => {
        setTime((prev) => {
            return {...prev, isShowStart: !prev.isShowStart}    
        })
    }

    const toggleEnd = () => {
        setTime((prev) => {
            return {...prev, isShowEnd: !prev.isShowEnd}    
        })
    }

    const handleStart = (time) => {
        setTime((prev) => {
            return {...prev, startTime: time, isShowStart: !prev.isShowStart}    
        })
    }
    const handleEnd = (time) => {
        setTime((prev) => {
            return {...prev, endTime: time, isShowEnd: !prev.isShowEnd}    
        })
    }

    const onChange = () => {
    }

    

    const startArr = timeRange(time.startTime)
    const endArr = timeRange(time.endTime)

    return (
        <>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={startName} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning ${isRequired ? "block" : "hidden"}`} id={startName + "-optional"}>
                    *必填
                </span>
            </div>

            <div className="flex items-center bg-gray-700 rounded-md py-1">
                <div className='flex items-center rounded-md shadow-sm'>
                    <CalendarIcon className='ml-2 text-MyWhite w-5 h-5' />
                    <input type="text" name={startName} id={startId}
                         placeholder={startPlaceholder} value={time.startTime} onClick={toggleStart} onChange={onChange} 
                         className="text-sm rounded-lg block w-24 pl-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-MyWhite ring-Primary focus:border-Primary cursor-pointer" 
                    />
                </div>
                <div className="mx-3 text-gray-400">到</div>
                <div className='flex items-center rounded-md shadow-sm'>
                    <CalendarIcon className='ml-2 text-MyWhite w-5 h-5' />
                    <input type="text" name={endName} id={endId} 
                        placeholder={endPlaceholder} value={time.endTime} onClick={toggleEnd} onChange={onChange} 
                        className="text-sm rounded-lg block w-24 pl-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-MyWhite ring-Primary focus:border-Primary cursor-pointer" 
                    />
                </div>
            </div>

            {/* <div className={`bg-gray-700 mt-1 w-1/4 lg:w-1/6 ${time.isShowStart ? "block" : "hidden"}`}>
                <ul className='text-PrimaryText'>
                    {startArr.map((item, idx) => (
                        <li key={idx} 
                            className={`px-6 py-1 hover:bg-gray-500 hover:text-MyWhite cursor-pointer ${item.selected ? "bg-gray-500 text-MyWhite" : ""}`} 
                            onClick={() => handleStart(item.time)}
                        >{item.time}</li>
                    ))}
                </ul>
            </div> */}

            
        </>
    )
}