import { useRef } from "react";

const Sex = ({
    defaultChecked,
    onChange,
}) => {
    const inputRef = useRef(null)

    const checked = defaultChecked === "M" ? true : false
    const sex = [
        { id: 'M', title: '男', checked: checked },
        { id: 'F', title: '女', checked: !checked },
    ]
    return (
        <>
            <div className="mb-6">
                <label className="text-base font-medium leading-6 text-formLabelColor">性別</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <fieldset className="mt-4 bg-blockColor border border-borderColor rounded-md p-5">
                            <legend className="sr-only">性別</legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0" onChange={ onChange }>
                            {sex.map((row) => (
                                <div key={row.id} className="flex items-center">
                                <input
                                    ref={inputRef}
                                    id={row.id}
                                    name="sex"
                                    type="radio"
                                    value={row.id}
                                    defaultChecked={row.checked}
                                    className="h-4 w-4 border-white/10 bg-white/5 text-Primary focus:ring-green-600 focus:ring-offset-gray-900"
                                />
                                <label htmlFor={row.id} className="ml-3 block text-sm font-medium leading-6 text-primaryText">
                                    {row.title}
                                </label>
                                </div>
                            ))}
                            </div>
                        </fieldset>
                    </div>
            </div>
        </>
    )
}
export default Sex