import Layout from '../layout/Layout';
import { React, useState, useEffect } from "react";
import { dump } from "../functions"
import {DndContext, useDraggable, useDroppable} from "@dnd-kit/core";

const Test = () => {

    const [isDropped, setIsDropped] = useState(false);
    const draggableMarkup = (
        <Draggable>Drag me</Draggable>
    );

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {!isDropped ? draggableMarkup : null}
            <Droppable>
                {isDropped ? draggableMarkup : 'Drop here'}
            </Droppable>
        </DndContext>
    );

    function handleDragEnd(event) {
        if (event.over && event.over.id === 'droppable') {
            setIsDropped(true);
        }
    }

    function Droppable(props) {
        const {isOver, setNodeRef} = useDroppable({
            id: 'droppable',
        });
        const style = {
            color: isOver ? 'green' : undefined,
        };


        return (
            <div ref={setNodeRef} style={style} className='bg-Primary-300 p-4 mx-6'>
                {props.children}
            </div>
        );
    }

    function Draggable(props) {
        const {attributes, listeners, setNodeRef, transform} = useDraggable({
            id: 'draggable',
        });
        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;


        return (
            <button className='bg-MyWhite text-gray-800 my-6 px-6 py-3 ml-6' ref={setNodeRef} style={style} {...listeners} {...attributes}>
                {props.children}
            </button>
        );
    }
}

export default Test;