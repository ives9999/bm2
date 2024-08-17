import React from 'react'
import SearchResult from './SearchResult'

function SearchResultsList({lists, setResult}) {
    return (
        <div className='bg-gray-700 px-6 py-2'>
            {lists.map((list, idx) => {
                return <SearchResult key={idx} result={list} setResult={setResult} />
            })}
        </div>
    )
}

export default SearchResultsList
