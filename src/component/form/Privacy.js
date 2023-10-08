import { useRef } from "react";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

const Privacy = ({
    checked=true,
    isError=false,
    errorMsg="必須同意隱私權條款",
    onChange,
}) => {
    const inputRef = useRef(null)

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="privacy" className="block text-base font-medium leading-6 text-formLabelColor">
                    隱私權
                </label>
                <span className="text-sm leading-6 text-red-500 block" id="privacy-optional">
                    *必選
                </span>
            </div>
            <div className="mb-6">
                <fieldset className={`
                mt-4 bg-blockColor border rounded-md p-5
                ${!isError ? "border-borderColor focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-red-500 border-red-500"}
                `}>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    <div className="flex justify-between w-full">
                        <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                                <input
                                ref={inputRef}
                                id="privacy"
                                name="privacy"
                                value="privacy"
                                type="checkbox"
                                checked={checked}
                                onChange={onChange}
                                className={`
                                h-4 w-4 bg-blockColor text-myPrimary 
                                ${!isError ? "focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-red-500 ring-red-500"}
                                `}
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="comments" className="ml-3 block text-sm font-medium leading-6 text-primaryText">
                                我同意隱私權條款
                                </label>
                            </div>
                        </div>
                        <div className="inset-y-0 right-0 items-center flex">
                            <ExclamationCircleIcon className={`h-5 w-5 text-red-500 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                        </div>

                    </div>
                </div>
                </fieldset>
                <p className={`mt-2 text-sm text-red-600 ${!isError ? "hidden" : "block"}`} id="privacy-error">
                {errorMsg}
                </p>
            </div>
        </>
    )
}
export default Privacy