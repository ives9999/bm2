import { useState, useRef } from "react";
import { ExclamationCircleIcon, XMarkIcon, EyeIcon } from '@heroicons/react/20/solid'

//import Errors from "./Errors";    

const Password = ({
    label,
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
    const [passwordShown, setPasswordShown] = useState(false)
    const toggleShow = () => {
        setPasswordShown(!passwordShown)
    }

    return (
        <>
			<div className="">
				<div className={isHidden ? "hidden" : "block"}>
					<div className="flex justify-between">
						<label htmlFor={name} className="block text-base font-medium leading-6 text-MyWhite ml-1">
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
							type={passwordShown ? "text" : "password"}
							name={name}
							value={value}
							id={id}
							className={`
								w-full border text-sm rounded-lg block p-2.5 bg-gray-700  placeholder-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] 
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
								<span className="cursor-pointer" onClick={toggleShow}>
									<EyeIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true" />
								</span>
								<ExclamationCircleIcon className={`h-5 w-5 text-Warning ${!isError ? "hidden" : "display"}`} aria-hidden="true" />
							</div>
						</div>
						<p className={`mt-2 text-sm text-Warning ${!isError ? "hidden" : "block"}`} id="email-error">
							{errorMsg}
						</p>
					</div>
				</div>
			</div>
        </>
        // <div className={containerClassName}>
        //     <input 
        //         ref={inputRef} 
        //         className={inputClassName}
        //         type={type} 
        //         placeholder={placeholder} 
        //         name={name}
        //         defaultValue={value}
        //         onChange={onChange} 
        //     />
        // </div>
        
    )
}

export default Password;