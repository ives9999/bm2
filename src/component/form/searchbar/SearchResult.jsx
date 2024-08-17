import React from 'react'

function SearchResult({result, setResult}) {

    const onClick = () => {
        setResult({...result, ...{value: result.name, id: result.id}});
    }

    return (
        <div 
            className='text-Primary-300 hover:bg-gray-600 cursor-pointer py-2 px-2'
            onClick={onClick}
        >
            {result.name}
        </div>
    )
}

export default SearchResult
