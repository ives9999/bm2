import { useState, useRef } from "react";
import { ExclamationCircleIcon, XMarkIcon, EyeIcon } from '@heroicons/react/20/solid'

//import Errors from "./Errors";    

const Password = ({
    label,
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
    const inputRef = useRef(null)

    const [passwordShown, setPasswordShown] = useState(false)

    const toggleShow = (event) => {
        event.preventDefault()
        setPasswordShown(!passwordShown)
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
            <div className="mb-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                    ref={inputRef}
                    type={passwordShown ? "text" : "password"}
                    name={name}
                    value={value}
                    id={id}
                    className={`block w-full bg-blockColor rounded-lg border-0 p-5 ring-1 ring-inset placeholder:text-slate-500 focus:ring-2 ${!isError ? "focus:ring-menuTextWhite sm:text-sm sm:leading-6 text-menuTextWhite ring-borderColor" : " text-red-500 ring-red-500"} `}
                    placeholder={placeholder}
                    defaultValue={value}
                    aria-invalid="true"
                    aria-describedby={name + "-error"}
                    onChange={onChange}
                    onClear={onClear}
                    />
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <a href="/" onClick={(e) => onClear(e)}>
                            <XMarkIcon className="h-5 w-5 mr-2 text-textTitleColor" aria-hidden="true" />
                        </a>
                        <a href="/" onClick={(e) => toggleShow(e)}>
                            <EyeIcon className="h-5 w-5 mr-2 text-textTitleColor" aria-hidden="true" />
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

export default Password;