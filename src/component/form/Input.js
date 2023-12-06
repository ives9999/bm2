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
    errorMsg,
    onChange,
    onClear,
    isHidden=false,
}) => {
    const inputRef = useRef(null)
	const isError = (errorMsg === undefined || errorMsg === '') ? false : true
	
    return (
        <>
			<div className="">
				<div className={`flex justify-between ${isHidden ? "hidden" : "block"}`}>
					<label htmlFor={name} className="block text-MyWhite font-medium leading-6 ml-1">
						{label}
					</label>
					<span className={`text-sm leading-6 mr-1 text-Warning ${isRequired ? "block" : "hidden"}`} id={name + "-optional"}>
						*必填
					</span>
				</div>
				<div className="mb-8">
					<div className="relative mt-2 rounded-md shadow-sm">
						<input
						ref={inputRef}
						type={type}
						name={name}
						value={value}
						id={id}
						className={`
							w-full border text-sm rounded-lg block bg-gray-700  placeholder-gray-400 text-white autofill:transition-colors autofill:duration-[5000000ms] 
							${!isError ? "focus:ring-Primary focus:border-Primary border-gray-600" : "text-Warning border-Warning"}
						`}
						placeholder={placeholder}
						// defaultValue={value}
						aria-invalid="true"
						aria-describedby={name + "-error"}
						onChange={onChange}
						/>
						<div className="absolute inset-y-0 right-0 items-center pr-3 flex">
							<span className="cursor-pointer" onClick={() => onClear(id)}>
								<XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true" />
							</span>
							<ExclamationCircleIcon className={`h-5 w-5 text-Warning ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
						</div>
					</div>
					<p className={`mt-2 text-sm text-Warning ${!isError ? "hidden" : "block"}`} id={name + "error"}>
						{errorMsg}
					</p>
				</div>
			</div>
        </>
    )
}

export default Input