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
                <label className="text-base font-medium leading-6 text-MyWhite">性別</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <fieldset className="mt-4 rounded-lg bg-gray-700 border border-borderColor py-2 px-4">
                            <legend className="sr-only">性別</legend>
                            <div className="flex items-center space-x-10 space-y-0" onChange={ onChange }>
                            {sex.map((row) => (
                                <div key={row.id} className="flex items-center">
                                <input
                                    ref={inputRef}
                                    id={row.id}
                                    name="sex"
                                    type="radio"
                                    value={row.id}
                                    defaultChecked={row.checked}
                                    className="h-4 w-4 border-gray-600 bg-gray-700 text-Primary focus:ring-green-600 focus:ring-offset-gray-900"
                                />
                                <label htmlFor={row.id} className="ml-3 block text-sm font-medium leading-6 text-MyWhite">
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