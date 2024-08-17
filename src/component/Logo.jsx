import React from 'react'
import {Link} from 'react-router-dom';

function Logo({url, width=200}) {
    const cWidth = 'max-w-[' + width + 'px]'
    return (
        <Link to={url} className="flex items-center">
            <img src="/assets/imgs/logo-wide.png" 
                className={`mr-3 h-6 sm:h-9 ${cWidth}`}
                alt={process.env.REACT_APP_TITLE} 
            />
        </Link>
    )
}

export default Logo
