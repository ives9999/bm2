import React, {useContext} from 'react'
import BMContext from '../context/BMContext'
import {ImSpinner6} from "react-icons/im";
import Overlay from "./Overlay";

function Loading() {
    const {isLoading} = useContext(BMContext)

    return isLoading && (
        <Overlay isShow={isLoading}>
            <div className={`w-full h-full fixed block top-0 left-0 bg-gray-900 z-40 ${isLoading ? "opacity-80" : "opacity-0 hidden"}`}>
                <div role="status" className='w-full h-full flex flex-col items-center justify-center gap-2'>
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-Primary-300"/>
                    <div className="text-Primary-300 text-base">載入中...</div>
                </div>
            </div>
        </Overlay>
    )
}

export default Loading
