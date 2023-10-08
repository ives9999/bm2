import { useRef } from "react";
import { UserCircleIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import Uploady from "@rpldy/uploady";
import { UploadButton } from "@rpldy/upload-button";
import { UploadPreview } from "@rpldy/upload-preview";

const Avatar = ({
    label,
    name,
    value,
    id,
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
                    *必選
                </span>
            </div>
            <div className="mb-6">
                <div className={`
                    mt-4 bg-blockColor border rounded-md
                    ${!isError ? "border-borderColor focus:ring-menuTextWhite text-menuTextWhite ring-borderColor" : " text-red-500 border-red-500"}
                `}>

                    <div className="relative p-5 rounded-md shadow-sm">
                        <div className="mt-2 flex items-center gap-x-3">
                            <Uploady 
                                destination={{ url: process.env.REACT_APP_API + "/member/avatar" }}
                                debug
                            >
                                {/* <UploadPreview /> */}
                                <UserCircleIcon className="h-12 w-12 text-gray-500" aria-hidden="true" />
                                <UploadButton 
                                    ref={inputRef}
                                    className="rounded-md bg-lime-500 px-3 py-2 text-sm font-semibold text-lime-950 shadow-sm hover:bg-lime-600"
                                    text="選擇"
                                />
                            </Uploady>
                        </div>
                        <div className="absolute inset-y-0 right-0 items-center pr-3 flex">
                            <a href="/" onClick={onClear}>
                                <XMarkIcon className="h-5 w-5 mr-2 text-textTitleColor" aria-hidden="true" />
                            </a>
                            <ExclamationCircleIcon className={`h-5 w-5 text-red-500 ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Avatar