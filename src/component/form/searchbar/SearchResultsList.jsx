import React from 'react'
import SearchResult from './SearchResult'

function SearchResultsList({results}) {
    return (
        <div className='bg-gray-700 px-6 py-2'>
            {results.map((result, id) => {
                return <SearchResult result={result.name} key={id} />
            })}
        </div>
    )
}

export default SearchResultsList
