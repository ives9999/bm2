import { useState, useEffect } from "react";
import Radio from "./Radio";

const Sex = ({
    defaultChecked,
    setFormData,
    isRequired = false,   // 組件是否必選
    errorMsg = '',         // 如果組件必選，沒有選時出現的錯誤訊息
}) => {
    //console.info(defaultChecked);
    const initSex = [
        { key: 'sex_M', text: '男', value: 'M', active: false },
        { key: 'sex_F', text: '女', value: 'F', active: false },
    ]
    const [sex, setSex] = useState(initSex);
    useEffect(() => {
        setSex((prev) => {
            prev.map(item => {
                item.active = (item.value === defaultChecked) ? true : false;
                return item;
            });
            //console.info(prev);
            return prev;
        })
    }, [defaultChecked]);
    return (
        <>
            <div className="mb-6">
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <Radio
                            label="性別"
                            id="sex"
                            items={sex}
                            setChecked={setSex}
                            setStatus={setFormData}
                            width="w-24"
                            isRequired={isRequired}
                            errorMsg={errorMsg}
                        />
                        {/* <fieldset className="mt-4 rounded-lg bg-gray-700 border border-borderColor py-2 px-4">
                            <legend className="sr-only">性別</legend>
                            <div className="flex items-center space-x-10 space-y-0">
                            {sex.map((row) => (
                                <div key={row.id} className="flex items-center">
                                <input
                                    ref={inputRef}
                                    id={row.id}
                                    name="sex"
                                    type="radio"
                                    value={row.value}
                                    checked={row.checked}
                                    onChange={onChange}
                                    className="h-4 w-4 border-gray-600 bg-gray-700 text-Primary-300 focus:ring-green-600 focus:ring-offset-gray-900"
                                />
                                <label htmlFor={row.id} className="ml-3 block text-sm font-medium leading-6 text-MyWhite">
                                    {row.title}
                                </label>
                                </div>
                            ))}
                            </div>
                        </fieldset> */}
                    </div>
            </div>
        </>
    )
}
export default Sex