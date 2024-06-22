import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import SearchResultsList from './SearchResultsList'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

// const [arenas, setArenas] = useState({
//     isShowArenasList: false,
//     list: [],
// })

function SearchBar({
    label,
    name,               // input name and id
    value,              // input value
    placeholder,        // input placeholder
    isShowList,         // 是否顯示搜尋結果列表
    list,               // 搜尋結果的列表
    handleChange,       // 搜尋框的直改變時執行的動作
    onClear,            // 清除的動作
    setResult,          // 選擇列表值時要設定的函式
    isRequired=false,   // 是否為必填
    errorMsg,           // 錯誤訊息
    isHidden=false,     // 是否隱藏
}) {
    // 當搜尋框關鍵字變更時，就會啟動此函式
    const onChange = (e) => {
        handleChange(e)
    }

	const isError = (errorMsg === undefined || errorMsg === '') ? false : true;

    return (
        <>
            {label !== undefined && label !== null && label.length > 0 &&
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={name} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
                    *必填
                </span>
            </div>
            }
            <div className="">
                <div className='relative rounded-md shadow-sm'>
                    <MagnifyingGlassIcon className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5' />
                    <input
                        className={`
                            w-full pl-10 border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] 
                            ${!isError ? "focus:ring-Primary-300 focus:border-Primary-300 border-gray-600" : "text-Warning-400 border-Warning-400"}
                        `}
                
                        // className='w-full pl-10 border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms] focus:ring-Primary-300 focus:border-Primary-300 border-gray-600'
                        placeholder={placeholder || '請輸入關鍵字...'}
                        name={name}
                        value={value}
                        id={name}
                        onChange={onChange}
                    />
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <span className="cursor-pointer" onClick={() => onClear(name)}>
                            <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true" />
                        </span>
                        <ExclamationCircleIcon className={`h-5 w-5 text-Warning-400 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
            </div>
            <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`} id={name + "error"}>
                {errorMsg}
            </p>
            {isShowList && <SearchResultsList lists={list} setResult={setResult} />}
        </>
    )
}

export default SearchBar
