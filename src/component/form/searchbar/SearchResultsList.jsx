import React from 'react'
import SearchResult from './SearchResult'

function SearchResultsList({results, setResult}) {
    return (
        <div className='bg-gray-700 px-6 py-2'>
            {results.list.map((result, idx) => {
                return <SearchResult key={idx} result={result} setResult={setResult} />
            })}
        </div>
    )
}

export default SearchResultsList
