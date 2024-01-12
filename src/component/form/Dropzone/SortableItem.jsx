import React from 'react'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { TrashIcon } from '@heroicons/react/20/solid'

export function SortableItem({
    file,               // browser image file
    setFeatured,         // 勾選或取消是否為代表圖
    handleDelete,       // 刪除圖片
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: file.id})

    const style= {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // const onChange = (e) => {
    //     //console.info(e.target.id)
    //     setFeature(e.target.id)
    // }
    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className='my-4'
        >
            <div className='flex justify-center'>
                <img 
                    src={(file.upload_id > 0) ? file.path : URL.createObjectURL(file)} 
                    name={file.name} 
                    alt={file.name} 
                    className='w-28 h-28' 
                />
            </div>
            <div className='flex justify-center items-center mt-4'>
                <div className='flex justify-between items-center mr-3'>
                    <input type="checkbox" id={file.name} value={file.name} checked={file.isFeatured} onChange={setFeatured} className='w-4 h-4 border-1 rounded border-gray-200 bg-current text-gray-700 outline-2 outline-offset-4 focus:outline focus:outline-Primary-300 focus:ring-offset-Primary-300' />
                    <label className='ml-1 text-MyWhite'>代表圖</label>
                </div>
                <TrashIcon className='text-MyWhite w-5 h-5 cursor-pointer' onClick={() => handleDelete(file.name)} />
            </div>
        </div>
    )
}

