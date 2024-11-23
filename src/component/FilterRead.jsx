import React, {useRef} from 'react';
import InputIcon from "./form/InputIcon";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";

const FilterRead = ({
                        value,
                        onChange,
                        onClear
                    }) => {
    const keywordRef = useRef();
    return (
        <div className="mr-4">
            <div className="flex flex-row">
                <InputIcon
                    inputRef={keywordRef}
                    name='keyword'
                    value={value || ''}
                    placeholder='請輸入關鍵字'
                    handleChange={onChange}
                    handleClear={onClear}
                    Icon={MagnifyingGlassIcon}
                    containerWidth='lg:w-[500px]'
                />
            </div>
        </div>
    );
};

export default FilterRead;