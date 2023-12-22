import React from 'react'

function SearchResult({result}) {
    const onClick = (e) => {

    }
    return (
        <div 
            className='text-Primary hover:bg-gray-600 cursor-pointer py-2 px-2'
            onClick={onClick}
        >
            {result}
        </div>
    )
}

export default SearchResult
