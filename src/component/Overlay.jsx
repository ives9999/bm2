import React from 'react'

function Overlay({isHidden}) {
    return (
        <div className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isHidden ? "opacity-0 hidden" : "opacity-80"}`}></div>
    )
}

export default Overlay
