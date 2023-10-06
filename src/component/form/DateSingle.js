import { useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker"; 

const DateSingle = ({
    label,
    name,
    value,
    id,
    onChange,
}) => {
    const inputRef = useRef(null)

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="dob" className="block text-base font-medium leading-6 text-formLabelColor">
                    {label}
                </label>
            </div>
            <div className="mb-6">
                <Datepicker 
                    ref={inputRef}
                    i18n={"zh-TW"} 
                    primaryColor={"lime"}
                    asSingle={true}
                    inputName={name}
                    inputId={id}
                    classNames="bg-red-700"
                    containerClassName="relative mt-2 rounded-md shadow-sm"
                    inputClassName="w-full 
                        bg-blockColor 
                        rounded-lg 
                        border-0 
                        p-5 
                        sm:text-sm 
                        sm:leading-6 
                        ring-1 
                        ring-inset 
                        placeholder:text-slate-500 
                        focus:ring-menuTextWhite text-menuTextWhite ring-borderColor
                        "
                    toggleClassName="absolute inset-y-0 right-0 items-center pr-3 flex text-textTitleColor mr-2"
                    value={value} 
                    onChange={onChange} 
                    showShortcuts={true}
                    configs={{
                        shortcuts: {
                            // today: "今天",
                            // yesterday: "昨天", 
                            // past: period => `Les ${period}  derniers jours`, 
                            // currentMonth: "Ce mois-ci", 
                            // pastMonth: "Le mois dernier", 
                        },
                    }} 
                    // displayFormat={"YYYY/MM/DD"}
                />
            </div>
        </>
    )
}

export default DateSingle