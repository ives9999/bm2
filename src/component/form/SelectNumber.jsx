import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";

export default function SelectNumber({
    label,
    value,
    plus,
    minus,
    idx = 0
}) {
    const handlePlus = (_idx) => {
        plus(_idx);
    }
    const handleMinus = (_idx) => {
        minus(_idx);
    }
    return (
        <div className='flex items-center'>
            <label htmlFor="quantity-input" className="block mr-4 font-medium text-gray-900 dark:text-white">{label}：</label>
            <div className="relative flex items-center max-w-[8rem]">
                <button onClick={() => handleMinus(idx)} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 lg:p-4 h-8 lg:h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <FaMinus className='w-3 h-3 lg:w-4 lg:h-4 text-white' />
                </button>
                <input readOnly type="text" id="quantity-input" data-input-counter data-input-counter-min="1" data-input-counter-max="50" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-8 lg:h-12 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" value={value} required />
                <button onClick={() => handlePlus(idx)} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 lg:p-4 h-8 lg:h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <FaPlus className='w-3 h-3 lg:w-4 lg:h-4 text-white' />
                </button>
            </div>
        </div>
    )
}
