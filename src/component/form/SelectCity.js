import * as React from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const SelectCity = ({
    citys,
    value,
    id="city_id",
    isRequired=false,
    errorMsg,
    onChange,
    onClear,
}) => {
    const inputRef = React.useRef(null)
    const isError = (errorMsg === undefined || errorMsg === '') ? false : true

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="city" className="block text-base font-medium leading-6 text-MyWhite">
                    縣市
                </label>
                <span className={`text-sm leading-6 text-red-500 ${isRequired ? "block" : "hidden"}`} id="city-optional">
                    *必選
                </span>
            </div>
            <div className="mb-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <select
                        ref={inputRef}
                        id={id}
                        name="city_id"
                        value={value}
                        autoComplete="city-name"
                        className={`
                        w-full border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms] 
                        ${!isError ? "border-gray-600 focus:border-Primary focus:ring-Primary text-MyWhite" : " text-red-500 border-red-500"}
                        `}
                        onChange={onChange}
                        >
                        { citys.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <span className="cursor-pointer" onClick={() => onClear(id)}>
                            <XMarkIcon className="h-5 w-5 mr-4 text-MyWhite" aria-hidden="true" />
                        </span>
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

export default SelectCity