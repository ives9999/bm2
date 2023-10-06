import { useRef } from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

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
    const inputRef = useRef(null)

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
                    type={type}
                    name={name}
                    value={value}
                    id={id}
                    className={`
                        block w-full 
                        bg-blockColor 
                        rounded-lg 
                        border-0 
                        p-5 
                        sm:text-sm 
                        sm:leading-6 
                        ring-1 
                        ring-inset 
                        placeholder:text-slate-500 
                        ${!isError ? "focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-red-500 ring-red-500"} `}
                    placeholder={placeholder}
                    defaultValue={value}
                    aria-invalid="true"
                    aria-describedby={name + "-error"}
                    onChange={onChange}
                    onClear={onClear}
                    />
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <a href="/" onClick={onClear}>
                            <XMarkIcon className="h-5 w-5 mr-2 text-textTitleColor" aria-hidden="true" />
                        </a>
                        <ExclamationCircleIcon className={`h-5 w-5 text-red-500 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
                <p className={`mt-2 text-sm text-red-600 ${!isError ? "hidden" : "block"}`} id="email-error">
                    {errorMsg}
                </p>
            </div>
        </>
    )
}

export default Input