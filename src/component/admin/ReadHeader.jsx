import React from 'react'
import SearchBar from '../form/SearchBar'
import { DeleteButton, PrimaryButton, PrimaryOutlineButton } from '../MyButton'

const ReadHeader = ({
    type,
    accessToken,
    value,
    getReadAPI,
    checkCount=0,
    onDeleteAll,
    onEdit,
                    }) => {
    return (
        <div className='flex justify-between mb-6'>
            <div className="flex items-center justify-center">
                <div className="mr-4">
                    <div className="flex flex-row items-center">
                        <SearchBar
                            type={type}
                            accessToken={accessToken}
                            value={value}
                            getReadAPI={getReadAPI}
                            containerWidth='w-[250px]'
                        />
                    </div>
                </div>
                <div className='h-full w-4 border-l border-gray-600'></div>
                <div className='flex gap-4'>
                    {/* <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/> */}
                    <DeleteButton disabled={checkCount === 0}
                                  onClick={onDeleteAll}>刪除多筆</DeleteButton>
                </div>
            </div>
            <div>
                <PrimaryButton className='ml-auto mr-4 md:mr-0'
                               onClick={() => onEdit('')}>新增</PrimaryButton>
            </div>
        </div>
    )
}

export default ReadHeader