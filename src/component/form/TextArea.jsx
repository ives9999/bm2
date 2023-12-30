import {Textarea} from 'flowbite-react'

function TextArea({
    label,
    name,
    id,
    value,
    onChange,
    isHidden=false,
}) {
    return (
        <div>
            <div className="">
                <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                    <label htmlFor={id} className="block text-MyWhite font-medium leading-6 ml-1">
                        {label}
                    </label>
                </div>
            </div>

        </div>
    )
}

export default TextArea
