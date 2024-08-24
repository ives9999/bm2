import React from 'react'

function Overlay({isShow}) {
    return (
        <div className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isShow ? "opacity-80" : "opacity-0 hidden"}`}></div>
    )
}

export default Overlay
