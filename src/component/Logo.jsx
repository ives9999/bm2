import React from 'react'

function Logo({url, width=200}) {
    const cWidth = 'max-w-[' + width + 'px]'
    return (
        <a href={url} className="flex items-center">
            <img src="/assets/imgs/logo-wide.png" 
                className={`mr-3 h-6 sm:h-9 ${cWidth}`}
                alt={process.env.REACT_APP_TITLE} 
            />
        </a>
    )
}

export default Logo
