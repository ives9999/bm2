import React from 'react'

function Checkbox1({
    label,                  // 此組件的名稱
    id,                     // input value
    items,                  // radio group
    setChecked,             // 更新checked 的 useState
    setStatus,              // setFormData 的 useState
    width='w-36',           // 組件按鈕的寬度
    isHidden=false,         // 是否隱藏
}) {
    const formButton = 'text-MyWhite bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-800 border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 me-8 mb-2 ' + width
    const formButtonActive = 'text-MyBlack bg-hot-pink-400 hover:bg-hot-pink-300 focus:ring-SwitchActiveFocus focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-8 mb-2 ' + width

    const onClick = (value, checked) => {
        setCheckboxChecked(setChecked, value, !checked)
        setCheckboxStatus(setStatus, id, value, !checked)
    }
    return (
        <div>
            <div className="">
                <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                    <label className="block text-MyWhite font-medium leading-6 ml-1">
                        {label}
                    </label>
                </div>
            </div>
            <div className='grid grid-cols-2 lg:grid-cols-7 gap-x-6 gap-y-3 lg:gap-8 justify-center items-center'>
                {items.map((item) => (
                    <button 
                        type="button" 
                        key={item.key}
                        className={item.active ? formButtonActive : formButton}
                        id={item.key}
                        value={item.value}
                        onClick={() => onClick(item.value, item.active)}
                    >{item.text}</button>
                ))}
            </div>
        </div>
    )
}

export default Checkbox1

function setCheckboxChecked(fun, value, checked) {
    fun((prev) => {
        const items = prev.map((item) => {
            if (item.value === value) {
                item.active = checked
            }
            return item
        })
        return items
    })
}

// 設定form data的status
// param fun function setFormData
// param name string 該屬性在formData 的 名稱，例如weekday或degree
// param key string 該checkbox選項的名稱
// param checked boolean 是否被選取，true for checked unless false  
// checkbox 傳回值一律是 1, 2, 3...
function setCheckboxStatus(fun, name, key, checked) {
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