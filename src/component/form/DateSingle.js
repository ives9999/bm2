// https://react-tailwindcss-datepicker.vercel.app
import Datepicker from "react-tailwindcss-datepicker"; 

const DateSingle = ({
    label,
    name,
    value,
    id,
    minDate,
    maxDate,
    startFrom,
    onChange,
}) => {

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="dob" className="block text-base font-medium leading-6 text-MyWhite">
                    {label}
                </label>
            </div>
            <div className="mb-6">
                <Datepicker 
                    i18n={"zh-TW"} 
                    primaryColor={"lime"}
                    useRange={false} 
                    asSingle={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    startFrom={startFrom}
                    inputName={name}
                    inputId={id}
                    classNames="bg-gray-700"
                    containerClassName="relative mt-2 rounded-md shadow-sm"
                    inputClassName="w-full 
                        bg-PrimaryBlock-900 
                        rounded-lg 
                        border
                        border-PrimaryBlock-600 
                        py-2
                        px-4 
                        sm:text-sm 
                        sm:leading-6 
                        ring-1 
                        ring-inset 
                        placeholder:text-gray-400
                        focus:ring-MyWhite text-MyWhite ring-borderColor
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
