import React from 'react'
import SearchResult from './SearchResult'

function SearchResultsList({lists, setResult}) {
    return (
        <div className='absolute bdivide-y z-10 bg-white divide-y divide-gray-100 w-44 dark:bg-PrimaryBlock-950'>
            <ul id="autocomplete-list"
                className="mt-2 py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow"
                role="listbox">
                {lists.map((list, idx) => {
                    return <SearchResult key={idx} result={list} setResult={setResult}/>
                })}
            </ul>
        </div>
)
}

export default SearchResultsList
