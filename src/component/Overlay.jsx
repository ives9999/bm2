import React from 'react'

function Overlay({isShow, children}) {
    return (
        <div className={`fixed z-50 overflow-auto bg-smoke-dark flex inset-x-0 inset-y-0 w-full h-full ${isShow ? "block" : "hidden"}`}>
            {children}
        </div>


            // <div
            //     className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isShow ? "opacity-80" : "opacity-0 hidden"}`}>
            //     {children}
            // </div>
    )
}
export default Overlay
