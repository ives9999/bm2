import React from 'react'

function SearchResult({result, setResult}) {

    const onClick = () => {
        setResult({...result, value: result.name})
    }

    return (
        <div 
            className='text-Primary hover:bg-gray-600 cursor-pointer py-2 px-2'
            onClick={onClick}
        >
            {result.name}
        </div>
    )
}

export default SearchResult
