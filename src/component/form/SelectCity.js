import * as React from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const SelectCity = ({
    citys,
    value,
    isRequired=false,
    isError=false,
    errorMsg,
    onChange,
    onClear,
}) => {
    const inputRef = React.useRef(null)
    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="city" className="block text-base font-medium leading-6 text-formLabelColor">
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
                        id="city"
                        name="city"
                        value={value}
                        autoComplete="city-name"
                        className={`
                        block w-full rounded-md border bg-blockColor p-5 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 [&_*]:text-black
                        ${!isError ? "border-borderColor focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-red-500 border-red-500"}
                        `}
                        onChange={onChange}
                        >
                        { citys.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <button type="button" onClick={(e) => {onClear(e)}}>
                            <XMarkIcon className="h-5 w-5 mr-4 text-textTitleColor" aria-hidden="true" />
                        </button>
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