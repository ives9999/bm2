import * as React from "react";
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const SelectArea = ({
    areas,
    value,
    id="area_id",
    isRequired=false,
    container_className='w-full',
    errorMsg,
    onChange,
    onClear,
}) => {
    const inputRef = React.useRef(null)
    const isError = (errorMsg === undefined || errorMsg === '') ? false : true
    //const selectedAreas = (areas !== null && areas !== undefined) ? areas : [{city: 0, id: 0, name: "無"}]

    return (
        <div className={container_className}>
            <div className="flex justify-between">
                <label htmlFor="city" className="block text-base font-medium leading-6 text-MyWhite">
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
                        id={id}
                        name="area_id"
                        value={value}
                        autoComplete="area-name"
                        className={`
                        w-full border border-PrimaryBlock-600 py-4 text-sm rounded-lg block bg-PrimaryBlock-900 placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms]
                        ${!isError ? "border-gray-600 focus:border-Primary-300 focus:ring-Primary-300 text-MyWhite" : " text-red-500 border-red-500"}
                        `}
                        onChange={onChange}
                        >
                        { areas.map((area) => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                        <span className="cursor-pointer" onClick={() => onClear(id)}>
                            <XMarkIcon className="h-5 w-5 mr-4 text-MyWhite" aria-hidden="true" />
                        </span>
                        <ExclamationCircleIcon className={`h-5 w-5 text-red-500 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                    </div>
                </div>
                <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`} id="area-error">
                    {errorMsg}
                </p>
            </div>
        </div>
    )
}

export default SelectArea