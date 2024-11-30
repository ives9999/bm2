import React, {useState} from 'react';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";

export const TableRowSort = ({
    rows,
    onDragEnd,
    sortIdx,
    startIdx=1,
    Thead,
    TR,
    Tfoot
                      }) => {
    const [activeID, setActiveID] = useState()

    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )

    const handleDragStart = (e) => {
        setActiveID(e.active.id);
    }

    const handleDragEnd = (e) => {
        onDragEnd(e);
        setActiveID(null);
    }

    const handleDragCancel = (e) => {
        setActiveID(null);
    }
    const Draggable = ({row, idx}) => {
        const sortable = useSortable({
            id: row.id
        });
        return (
            <TR sortable={sortable} row={row} idx={idx} />
        )
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel} sensors={sensors} modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter}>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <Thead />
                <tbody>
                <SortableContext items={sortIdx} strategy={verticalListSortingStrategy}>
                    {rows.map((row, idx) => (
                        <Draggable key={row.id} row={row} idx={startIdx + idx}/>
                    ))}
                </SortableContext>
                </tbody>
                <Tfoot />
            </table>
            <DragOverlay>
                {activeID && (
                    <table style={{ width: "100%" }}>
                        <tbody>
                        <div className='text-Primary-300'>!!!!!!!!!!!!!!</div>
                        {/* <StaticTableRow row={selectedRow} /> */}
                        </tbody>
                    </table>
                )}
            </DragOverlay>
        </DndContext>
);
};

class MyPointerSensor extends PointerSensor {
    static
    activators = [
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
        'span',
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
