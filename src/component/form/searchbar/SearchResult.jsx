import React from 'react'

function SearchResult({result, setResult}) {

    const onClick = () => {
        setResult({...result, ...{value: result.name, id: result.id}});
    }

    return (
        <li
            className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
            onClick={onClick}
        >
            {result.name}
        </li>
    )
}

export default SearchResult
