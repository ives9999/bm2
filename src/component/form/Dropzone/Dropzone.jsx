import { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { DndContext,closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors } from '@dnd-kit/core'
import { rectSortingStrategy,SortableContext,sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'

export function Dropzone({
    label,                  // 此組件的名稱
    files,                  // 所有的檔案
    addFiles,               // 新增檔案時處理的函式
    deleteFiles,            // 刪除檔案時處理的函式
    setFeatured,             // 設定代表圖的函式
    onDragDrop,             // 圖片拖曳換位置後的處理函式
    isRequired=false,       // 是否為必填
    isHidden=false,         // 是否隱藏
}) {
    const sensors = useSensors(
        useSensor(MyPointerSensor), 
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )
    
    //const [files, setFiles] = useState([
        // {id: 1, name:"a", isFeatured: false},
        // {id: 2, name:"b", isFeatured: false},
        // {id: 3, name:"c", isFeatured: false},
    //])

    // 將files的圖片中索引值，設定為另一個陣列，傳給drag drop的韓式後，才會有拖曳的動態效果
    const itemIds = useMemo(() => files.map((item) => item.id), [files]); // ["1", "2", "3"]

    // 拖曳或新增圖片後呼叫的函式
    const onDrop = useCallback(acceptedFiles => {
        addFiles(acceptedFiles)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {getRootProps, getInputProps} = useDropzone({onDrop})

    // 拖曳圖片完後執行的動作
    function handleDragEnd(event) {
        // active 被拖曳的那一個位置
        // over 放開後的那一個位置
        const {active, over} = event;
        
        if (active.id !== over.id) {
            onDragDrop(active, over)
        }
    }

    return (
        <div>
            <div className={`flex justify-between mb-2 ${isHidden ? "hidden" : "block"}`}>
                <label htmlFor='dropzone' className="block text-MyWhite font-medium leading-6 ml-1">
                    {label}
                </label>
                <span className={`text-sm leading-6 mr-1 text-Warning-400 ${isRequired ? "block" : "hidden"}`} id="dropzone-optional">
                    *必填
                </span>
            </div>

            <div className="relative rounded-md shadow-sm">
                <div {...getRootProps({className:"dropzone border border-dashed border-MyWhite p-8 cursor-pointer"})}>
                    <input className='input-zone' {...getInputProps()} />
                    <div className='text-center'>
                        <p className='dropzone-content text-MyWhite'>
                            拖曳您的圖片或按下來選擇圖片...
                        </p>
                    </div>
                </div>
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    >
                    <SortableContext 
                        items={itemIds}
                        strategy={rectSortingStrategy}
                    >
                        <div className='mt-4 bg-MenuBGLight grid grid-cols-2 lg:grid-cols-4 gap-2 justify-center'>
                            {files.map(file => <SortableItem key={file.name} file={file} setFeatured={setFeatured} handleDelete={deleteFiles} />)}
                        </div>
                    </SortableContext>
                </DndContext>

            </div>
        </div>
    )
}

export default Dropzone

class MyPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown',
            handler: ({nativeEvent: event}) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target)
                ) {
                    return false
                }
                return true
            }
        }
    ]
}

function isInteractiveElement(element) {
    const interactiveElements = [
        'button',
        'input',
        'textarea',
        'select',
        'option',
        'svg',
    ]

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
        return true
    }

    return false
}
