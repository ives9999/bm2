// https://react-tailwindcss-datepicker.vercel.app
import Datepicker from "react-tailwindcss-datepicker";

export const DateSingle = ({
                               label,
                               name,
                               value,
                               id,
                               minDate,
                               maxDate,
                               startFrom,
                               position = 'down',
                               onChange,
                               isRequired = false,
                                errorMsg,
                           }) => {
    const isError = (!(errorMsg === undefined || errorMsg === ''))

    return (
        <>
            <div className="flex justify-between">
                <label htmlFor="dob" className="block text-base font-medium leading-6 text-MyWhite">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`}
                      id={name + "-optional"}>
                    *必選
                </span>
            </div>
            <div className="mb-6">
                <Datepicker
                    i18n={"zh-TW"}
                    primaryColor={"lime"}
                    popoverDirection={position}
                    useRange={false}
                    asSingle={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    startFrom={startFrom}
                    inputName={name}
                    inputId={id}
                    classNames="bg-gray-700"
                    containerClassName="mt-2 rounded-md shadow-sm"
                    inputClassName={`w-full 
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
                        ${!isError ? "focus:ring-Primary-300 focus:border-Primary-300 border-gray-600" : "!text-Warning-400 !border-Warning-400"}
                        `}
                    toggleClassName="hidden right-0 items-center pr-3 flex text-textTitleColor mr-2"
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
                <p className={`mt-2 text-sm text-Warning-400 ${!isError ? "hidden" : "block"}`} id={name + "error"}>
                    {errorMsg}
                </p>
            </div>
        </>
    )
}

export const DateRange = ({label, value, onChange}) => {
    return (
        <div>
            {label.count > 0 ?
                <div className="flex justify-between">
                    <label className="block text-base font-medium leading-6 text-MyWhite">
                        {label}
                    </label>
                </div> : ""}
            <Datepicker
                i18n={'zh-TW'}
                value={value}
                onChange={onChange}
                showShortcuts={true}
                configs={{
                    shortcuts: {
                        today: '今天',
                        yesterday: '昨天',
                        past: (period) => `${period} 天前`,
                        currentMonth: '這個月',
                        pastMonth: '上個月',
                    },
                    footer: {
                        cancel: '取消',
                        apply: '確定',
                    },
                }}
                classNames="bg-gray-700"
                containerClassName="relative rounded-md shadow-sm"
                inputClassName="w-[280px]
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
                toggleClassName="absolute inset-y-0 right-0 pr-3 text-textTitleColor mr-2"
            />
        </div>
    )
}
