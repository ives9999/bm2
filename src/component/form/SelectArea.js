import * as React from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const SelectArea = ({
    areas,
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
                    區域
                </label>
                <span className={`text-sm leading-6 text-red-500 ${isRequired ? "block" : "hidden"}`} id="city-optional">
                    *必選
                </span>
            </div>
            <div className="mb-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <select
                        ref={inputRef}
                        id="area"
                        name="area"
                        autoComplete="area-name"
                        className="block w-full rounded-md border-0 bg-blockColor p-5 text-menuTextWhite shadow-sm ring-1 ring-inset ring-white/10 focus:ring-inset focus:ring-menuTextWhite sm:text-sm sm:leading-6 [&_*]:text-black"
                        onChange={onChange}
                        >
                        { areas.map((area) => (
                            <option value={area.id}>{area.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <a href="/" onClick={(e) => onClear(e)}>
                            <XMarkIcon className="h-5 w-5 mr-4 text-textTitleColor" aria-hidden="true" />
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

export default SelectArea