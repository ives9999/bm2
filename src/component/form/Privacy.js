import { useRef } from "react";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

const Privacy = ({
    checked=true,
    errorMsg="",
    isHidden=false,
    onChange,
}) => {
    const inputRef = useRef(null)
	const isError = (errorMsg === undefined || errorMsg === '') ? false : true

    return (
        <>
            <div className={isHidden ? "hidden" : "block"}>
            <div className="flex justify-between">
                <label htmlFor="privacy" className="block text-base font-medium leading-6 text-MyWhite ml-1">
                    隱私權
                </label>
                <span className="text-sm leading-6 text-Warning block" id="privacy-optional">
                    *必選
                </span>
            </div>
            <div className="mb-8">
                <fieldset className={`
                mt-4 bg-MenuBGLight border rounded-lg p-3
                ${!isError ? "border-MenuBorder focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-Warning border-Warning"}
                `}>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    <div className="flex justify-between w-full">
                        <div className="relative flex gap-x-1">
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
                                h-5 w-5 bg-MenuBG text-MyBlack 
                                ${!isError ? "focus:ring-MyBlack text-MyBlack ring-MyBlack" : " text-Warning ring-Warning"}
                                `}
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="comments" className="ml-3 block text-sm font-medium leading-6 text-PrimaryText">
                                我同意隱私權條款
                                </label>
                            </div>
                        </div>
                        <div className="inset-y-0 right-0 items-center flex">
                            <ExclamationCircleIcon className={`h-5 w-5 text-warning ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                        </div>

                    </div>
                </div>
                </fieldset>
                <p className={`mt-2 text-sm text-Warning ${!isError ? "hidden" : "block"}`} id="privacy-error">
                {errorMsg}
                </p>
            </div>
            </div>
        </>
    )
}
export default Privacy