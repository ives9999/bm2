import React, {useState} from 'react';
import {ImSpinner6} from "react-icons/im";

const Buy = () => {
    const [isGetComplete, setIsGetComplete] = useState(false);

    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div>

            </div>
        );
    }
};

export default Buy;