import * as React from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

//import Errors from "./Errors";    

const Input = ({
    label,
    type="text",
    name,
    value,
    id,
    placeholder,
    isRequired=false,
    isError=false,
    errorMsg,
    onChange,
    onClear,
}) => {
    const inputRef = React.useRef(null)

    const clear = (event) => {
        event.preventDefault()
        console.info("clear function is on")
        event.target.value = ""
    }

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor={name} className="block text-base font-medium leading-6 text-formLabelColor">
                    {label}
                </label>
                <span className={`text-sm leading-6 text-red-500 ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
                    *必填
                </span>
            </div>
            <div className="mb-12">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                    ref={inputRef}
                    type={type}
                    name={name}
                    id={id}
                    className={`block w-full bg-blockColor rounded-lg border-0 p-5 ring-1 ring-inset placeholder:text-slate-500 focus:ring-2 ${!isError ? "focus:ring-menuTextWhite sm:text-sm sm:leading-6 text-menuTextWhite ring-borderColor" : " text-red-500 ring-red-500"} `}
                    placeholder={placeholder}
                    defaultValue={value}
                    aria-invalid="true"
                    aria-describedby={name + "-error"}
                    onChange={onChange}
                    />
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <a href="/" onClick={onClear}>
                            <XMarkIcon className="h-5 w-5 text-formLabelColor" aria-hidden="true" />
                        </a>
                        <ExclamationCircleIcon className={`h-5 w-5 text-red-500 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
                <p className={`mt-2 text-sm text-red-600 ${!isError ? "hidden" : "block"}`} id="email-error">
                    {errorMsg}
                </p>
            </div>
        </>
        // <div className={containerClassName}>
        //     <input 
        //         ref={inputRef} 
        //         className={inputClassName}
        //         type={type} 
        //         placeholder={placeholder} 
        //         name={name}
        //         defaultValue={value}
        //         onChange={onChange} 
        //     />
        // </div>
        
    )
}

export default Input;