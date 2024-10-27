import React, {useRef, useState} from 'react';
import {ExclamationCircleIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";

const InputIcon = ({
    name,
    className='',
    placeholder='',
    inputRef,
    Icon,
    value,
    handleChange,
    handleClear,
    isError,
    containerWidth='w-full',
                   }) => {
    const [isFocus, setIsFocus] = useState(document.activeElement === inputRef.current);
    const onFocus = () => {
        //console.info('focus');
        setIsFocus(true);
    }

    const onBlur = () => {
        //console.info('blur');
        setIsFocus(false);
    }
    return (
        <div className={`
                 rounded-lg shadow-sm flex flex-row items-center bg-PrimaryBlock-900 border 
                 ${!isError ? "" : "text-Warning-400 border-Warning-400"}
                 ${containerWidth}
                 ${isFocus ? 'border-Primary-300' : 'border-gray-500'}
            `}>
            <Icon className='items-center text-MyWhite w-5 h-5 cursor-pointer ml-2' />
            <input
                ref={inputRef}
                className={`
                    w-full text-sm border-0 focus:border-0 focus:ring-0 text-MyWhite placeholder:text-gray-400 autofill:transition-colors autofill:duration-[5000000ms] bg-PrimaryBlock-900
                    ${className ? className : ''}
                `}
                placeholder={placeholder || '請輸入關鍵字...'}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <div className="pr-1">
                <span className="cursor-pointer" onClick={handleClear}>
                    <XMarkIcon className="h-5 w-5 text-MyWhite" aria-hidden="true"/>
                </span>
                <ExclamationCircleIcon
                    className={`h-5 w-5 text-Warning-400 ${!isError ? "hidden" : "display"}`}
                    aria-hidden="true"/>
            </div>
        </div>
    );
};

export default InputIcon;