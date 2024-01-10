import React from 'react'

export function Checkbox({
    label,
    name,
    items,              // [{key, value}]的物件陣列
    isRequired=false,
    onChange,
    isHidden=false,
}) {
    return (
        <div>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={name} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
                    *必填
                </span>
            </div>
            <div className="flex items-center bg-gray-700 h-full lg:h-11 rounded-md p-2 mb-4">
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-3 lg:gap-8 justify-center items-center">
                    {items.map((item) => (
                        <div key={item.key} className="flex items-center">
                            <input id={item.key} type="checkbox" value={item.key} name={name} checked={item.checked} onChange={onChange} 
                                className="appearance-none w-4 h-4 border-1 rounded border-MyWhite bg-BG text-BG focus:ring-1 focus:ring-Primary-300 accent-Primary-300" />
                            <label htmlFor={item.key} className="ml-2 text-sm font-medium text-gray-300">{item.value}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// 設定form data的status
// param fun function setFormData
// param name string 該屬性在formData 的 名稱，例如weekday或degree
// param key string 該checkbox選項的名稱
// param checked boolean 是否被選取，true for checked unless false  
// checkbox 傳回值一律是 1, 2, 3...
export function setCheckboxStatus(fun, name, key, checked) {
    fun((prev) => {
        // 1.先取出原來儲存在form data的值
        var old = (prev[name] === null || prev[name] === undefined) ? "" : prev[name]

        // 2.如果是選取的話，將值加入原來的字串 
        if (checked) {
            old = (old.length === 0) ? key : old + "," + key
        // 2. 如果沒有選取的話，將值移出
        } else {
            var olds = old.split(",")
            olds = olds.filter((item) => item !== key.toString())
            old = olds.join(",")
        }

        // 3.把結果值存入form data
        return {...prev, [name]: old}
    })
}

// 設定checkbox的status
// param fun function 設定checkbox是否被選取
// param key string 該checkbox選項的名稱
export function setCheckboxChecked(fun, key) {
    fun((prev) => {
        // 設定checkbox checked or unchecked
        var obj = prev.map((item) => {
            if (item.key === key) {
                item.checked = !item.checked
            }
            return item
        })
        return obj
    })
}
