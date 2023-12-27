import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import SearchResultsList from './SearchResultsList'

// const [arenas, setArenas] = useState({
//     isShowArenasList: false,
//     list: [],
// })

function SearchBar({
    name,               // input name and id
    value,              // input value
    placeholder,        // input placeholder
    isShowList,         // 是否顯示搜尋結果列表
    list,               // 搜尋結果的列表
    handleChange,       // 搜尋框的直改變時執行的動作
    setResult,          // 選擇列表值時要設定的函式
}) {
    const onChange = (e) => {
        handleChange(e)
    }

    return (
        <>
            <div className='flex justify-between'>
                <label htmlFor='filter' className="block text-MyWhite font-medium leading-6 ml-1">
                    所在球館
                </label>
                <span className='text-sm leading-6 mr-1 text-Warning' id='filter-optional'>
                    *必填
                </span>
            </div>
            <div className="">
                <div className='relative mt-2 rounded-md shadow-sm'>
                    <MagnifyingGlassIcon className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5' />
                    <input
                        className='w-full pl-10 border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms] focus:ring-Primary focus:border-Primary border-gray-600'
                        placeholder={placeholder || '請輸入關鍵字...'}
                        name={name}
                        value={value}
                        id={name}
                        onChange={onChange}
                    />
                </div>
            </div>
            {isShowList && <SearchResultsList lists={list} setResult={setResult} />}
        </>
    )
}

export default SearchBar
