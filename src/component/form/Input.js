import { useRef } from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const Input = ({
    label,
    type="text",
    name,
    value,
    id,
    defaultValue,
    placeholder,
    isRequired=false,
    container_className="w-full",
    input_className="w-full",
    errorMsg,
    onChange,
    onClear,
    isHidden=false,
    readOnly=false,
}) => {
    const inputRef = useRef(null)
	const isError = (errorMsg === undefined || errorMsg === '') ? false : true
	
    return (
        <div className={`mb-6 ${container_className}`}>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor={name} className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
                    *必填
                </span>
            </div>
            <div className={input_className}>
                <div className="relative rounded-md shadow-sm">
                    <input
                    ref={inputRef}
                    type={type}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    id={id}
                    className={`
                        w-full border border-PrimaryBlock-600 py-4 text-sm rounded-lg block bg-PrimaryBlock-900  placeholder-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] 
                        ${!isError ? "focus:ring-Primary-300 focus:border-Primary-300 border-gray-600" : "!text-Warning-400 !border-Warning-400"}
                    `}
                    placeholder={placeholder}
                    // defaultValue={value}
                    aria-invalid="true"
                    aria-describedby={name + "-error"}
                    onChange={onChange}
                    readOnly={readOnly}
                    />
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <span className="cursor-pointer" onClick={() => onClear(id)}>
                            <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true" />
                        </span>
                        <ExclamationCircleIcon className={`h-5 w-5 text-Warning-400 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
                <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`} id={name + "error"}>
                    {errorMsg}
                </p>
            </div>
        </div>
    )
}

export default Input