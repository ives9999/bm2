import React from 'react'

// const obj = {key: type1, text: types[type1], value: type1, active: active}

function Radio({
    label,                  // 此組件的名稱
    id,                     // input value
    items,                  // radio group
    setChecked,             // 更新checked 的 useState
    setStatus,              // setFormData 的 useState
    width='w-36',           // 組件按鈕的寬度
    isRequired = false,   // 組件是否必選
    errorMsg = '',         // 如果組件必選，沒有選時出現的錯誤訊息
    isHidden= false,         // 是否隱藏
    isIcon = false  // 是否使用icon
}) {
    //console.info(items);
    const isError = (errorMsg === undefined || errorMsg === '') ? false : true
    const formButton = 'text-MyWhite bg-PrimaryBlock-900 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-800 border-PrimaryBlock-600 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 ' + width
    const formButtonActive = 'text-MyWhite bg-lunar-green-600 hover:bg-lunar-green-500 focus:ring-SwitchActiveFocus focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 ' + width

    const onClick = (value, checked) => {
        setCheckboxChecked(setChecked, value)
        if (setStatus) {
            setCheckboxStatus(setStatus, id, value)
        }
    }
    return (
        <div className=''>
            <div className="">
                <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                    <label className="block text-MyWhite font-medium leading-6 ml-1">
                        {label}
                    </label>
                    <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`}
                          id={label + "-optional"}>
                        *必選
                    </span>
                </div>
            </div>
            <div className='flex flex-wrap gap-y-3 gap-x-4 items-center'>
                {/* <div className='grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-4 gap-x-6 gap-y-3 lg:gap-8 justify-center items-center'> */}
                {items.map((item, idx) => (
                    <div className='flex flex-col items-center' key={item.key}>
                        {isIcon ? <img src={"/assets/imgs/" + item.key + ".png"} className='w-32'/>
                            : ''
                        }
                        <button
                            type="button"
                            className={item.active ? formButtonActive : formButton}
                            id={item.key}
                            value={item.value}
                            onClick={() => onClick(item.value, item.active)}
                        >{item.text}</button>
                    </div>
                ))}
            </div>
            <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`} id={id + "error"}>
                {errorMsg}
            </p>
        </div>
    )
}

export default Radio

function setCheckboxChecked(fun, value) {
    fun((prev) => {
        const items = prev.map((item) => {
            item.active = (item.value === value) ? true : false
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
function setCheckboxStatus(fun, id, value) {
    fun((prev) => {
        return {...prev, [id]: value}
    })
}

// options is like {"1": "正常", "0": "取消"}
export function renderRadio(options, selected, setFn) {
    //console.info("options: " + JSON.stringify(options));
    if (Number.isInteger(selected)) {
        selected = selected.toString()
    }
    setFn(() => {
        let all = [];
        Object.keys(options).forEach(key => {
            //console.info("key: " + key);
            const value = options[key];
            //console.info("value: " + value);
            const active = (selected === key) ? true : false
            const obj = {key: key, text: value, value: key, active: active};
            all.push(obj)
        });
        //console.info(all);
        return all
    })
}

export function renderRadioCustom(options, selected, callback) {
    callback(options, selected);
}
