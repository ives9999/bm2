import React from 'react'

export function Switch({
    label,                  // 此組件的名稱
    yesText,                // 「是」的文字
    noText,                 // 「否」的文字
    yesValue,               // 「是」的值
    noValue,                // 「否」的值
    id,                     // 組件id
    value,                  // 組件值
    onChange,               // 變更選取後要執行的函式
    width='w-36',           // 組件按鈕的寬度
    isHidden=false,         // 是否隱藏
    className=''
}) {
    const formButton = 'text-MyWhite bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-800 border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 me-8 mb-2 ' + width
    const formButtonActive = 'text-MyBlack bg-Primary-500 hover:bg-Primary-400 focus:ring-SwitchActiveFocus focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-8 mb-2 ' + width

    return (
        <div className={`${className}`}>
        <div>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={id} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
            </div>
        </div>
        <div className="flex flex-row">
            <button 
                type="button" 
                className={value === yesValue ? formButtonActive : formButton}
                id={id}
                value={yesValue}
                onClick={onChange}
            >{yesText}</button>
            <button 
                type="button" 
                className={value === noValue ? formButtonActive : formButton}
                id={id}
                value={noValue}
                onClick={onChange}
            >{noText}</button>
        </div>
        </div>
    )
}

