import {Textarea} from 'flowbite-react'

function TextArea({
    label,                  // 組件標題
    name,                   // 組件的name
    id,                     // 組件的id
    value,                  // 組件的value  
    placeholder,            // 組件的placeholder
    rows=4,                 // 輸入框的列數
    onChange,               // 輸入框內如變更後呼叫的函式
    isRequired=false,       // 是否為必填
    isHidden=false,         // 是否為隱藏
}) {
    return (
        <div>
            <div className="">
                <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                    <label htmlFor={id} className="block text-MyWhite font-medium leading-6 ml-1">
                        {label}
                    </label>
                    <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
						*必填
					</span>
                </div>
            </div>
            <Textarea 
                id={id} 
                name={name} 
                value={value}
                placeholder={placeholder} 
                rows={rows} 
                onChange={onChange}
                className='placeholder-gray-400 text-MyWhite border-gray-600 focus-Primary-300 focus:ring-Primary-300 focus:border-Primary-300'
            />
        </div>
    )
}

export default TextArea
