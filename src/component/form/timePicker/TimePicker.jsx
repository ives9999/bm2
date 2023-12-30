import { CalendarIcon } from '@heroicons/react/24/solid'
import TimePickerList from './TimePickerList'

// const [time, setTime] = useState({
//     startTime: play_start,
//     endTime: play_end,
//     isShowStart: false,
//     isShowEnd: false,
// })

export function TimePickerFor2({
    label,              // 此物件名稱
    startName,          // 開始的input name 與 id
    startValue,         // 開始的input value
    startPlaceholder,   // 開始的input placeholder
    endName,            // 結束的input name 與 id
    endValue,           // 結束的input value
    endPlaceholder,     // 結束的input placeholder
    startTime,          // 時間選擇選器的開始時間
    endTime,            // 時間選擇選器的結束時間
    step,               // 時間選擇選器的間隔時間
    time,               // 請看上面的設定      
    setTime,            // 請看上面的設定
    handleChange,       // 當時兼值改變時，主程式要執行的動作
    isRequired=false,   // 是否為必填
    isHidden=false,     // 是否為隱藏
}) {

    // 時間的列表是否往下展開，如果沒有就展開，如果已經展開就關閉
    const toggleList = (e) => {
        if (e.target.id === startName) {
            setTime((prev) => {
                return {...prev, isShowStart: !prev.isShowStart}    
            })    
        } else if (e.target.id === endName) {
            setTime((prev) => {
                return {...prev, isShowEnd: !prev.isShowEnd}    
            })
        }    
    }

    // 當選定時間後設定時間值
    // type: start 表示開始，end 表示結束
    // value: 選定的值
    const setResult = (type, value) => {
        if (type === 'start') {
            setTime((prev) => {
                return {...prev, isShowStart: !prev.isShowStart, startTime: value} 
            })
            const e = {target: {id: "play_start", value: value}}
            handleChange(e)
        } else if (type === 'end') {
            setTime((prev) => {
                return {...prev, isShowEnd: !prev.isShowEnd, endTime: value} 
            })
            const e = {target: {id: "play_end", value: value}}
            handleChange(e)
        }
    }

    const onChange = (e) => {
    }
    
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
                    <input type="text" name={startName} id={startName}
                         placeholder={startPlaceholder} value={time.startTime || ''} onClick={toggleList} onChange={onChange} 
                         className="text-sm rounded-lg block w-24 pl-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-MyWhite ring-Primary focus:border-Primary cursor-pointer" 
                    />
                </div>
                <div className="mx-3 text-gray-400">到</div>
                <div className='flex items-center rounded-md shadow-sm'>
                    <CalendarIcon className='ml-2 text-MyWhite w-5 h-5' />
                    <input type="text" name={endName} id={endName} 
                        placeholder={endPlaceholder} value={time.endTime || ''} onClick={toggleList} onChange={onChange} 
                        className="text-sm rounded-lg block w-24 pl-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-MyWhite ring-Primary focus:border-Primary cursor-pointer" 
                    />
                </div>
            </div>
            {time.isShowStart && 
                <TimePickerList 
                    start={startTime} 
                    end={endTime}
                    step={step}
                    selectedTime={startValue} 
                    setResult={setResult}
                    type="start"
                />
            }
            {time.isShowEnd && 
                <TimePickerList 
                    start={startTime} 
                    end={endTime}
                    step={step}
                    selectedTime={endValue}
                    setResult={setResult}
                    ml='ml-48'
                    type="end"
                />
            }            
        </>
    )
}