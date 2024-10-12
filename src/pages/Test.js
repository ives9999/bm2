import Layout from './Layout';
import {React, useState, useEffect, useRef} from "react";
import { dump } from "../functions"
import {DndContext, useDraggable, useDroppable} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

const Test = () => {

    const games = [
        {id: 0, name: "Dota 2"},
        {id: 1, name: "League of Legends"},
        {id: 2, name: "CS:GO"},
        {id: 3, name: "World of Warcraft"},
        {id: 4, name: "The Witcher 3"}
    ];

    const [gameList, setGameList] = useState(games);
    const x = games.map(item => {
        return item.id;
    })
    const ids = useRef(x);

    const handleDragEnd1 = (e) => {
        if (!e.over) return;

        if (e.active.id !== e.over.id) {
            //console.info("acvite:" + e.active.id);
            //console.info("over:" + e.over.id);
            // active 是drag
            // over 是drop
            setGameList(gameList => {
                const oldIdx = gameList.findIndex(item => item.id === e.active.id);
                const newIdx = gameList.findIndex(item => item.id === e.over.id);
                //console.info("oldIdx:" + oldIdx);
                //console.info("newIdx:" + newIdx);
                const y = arrayMove(gameList, oldIdx, newIdx);
                const z = y.map(item => {
                    return item.id;
                })
                console.info(z);
                ids.current = z;
                return y;
            })
        }
    }

    const SortItem = ({row}) => {
        const {attributes, listeners, setNodeRef, transform, transition} = useSortable(
            {id: row.id}
        )

        return (
            <tr ref={setNodeRef}
                {...attributes}
                {...listeners}
                className='text-Primary-300 justify-center w-64 px-4 py-2 mb-4'
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition: transition
                }}>
                <td>{row.id + 1}</td>
                <td>{row.name}</td>
            </tr>
        )
    }

    return (
        <DndContext onDragEnd={handleDragEnd1}>
            <main className="">
                <h1 className='text-MyWhite flex justify-center mb-8'>Favorite Games List</h1>

                <table className='border border-Primary-700 mx-auto p-2'>
                    <thead>
                        <tr className='text-Primary-300'>
                            <th>序號</th>
                            <th>名稱</th>
                        </tr>
                    </thead>
                    <tbody>
                    <SortableContext items={ids.current} strategy={verticalListSortingStrategy}>

                    {gameList.map((game) => (
                        <SortItem key={game.id} row={game} />
                    ))}
                    </SortableContext>
                    </tbody>
                </table>

            </main>
        </DndContext>
    )

    // const containers = ['A', 'B', 'C'];
    // const [parent, setParent] = useState(null);
    // const draggableMarkup = (
    //     <Draggable id="draggable">Drag me</Draggable>
    // );
    // const handleDragStart = (e) => {
    //     console.info(e);
    // }
    // return (
    //     <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
    //         {parent === null ? draggableMarkup : null}
    //
    //         {containers.map((id) => (
    //             // We updated the Droppable component so it would accept an `id`
    //             // prop and pass it to `useDroppable`
    //             <Droppable key={id} id={id}>
    //                 {parent === id ? draggableMarkup : 'Drop here'}
    //             </Droppable>
    //         ))}
    //     </DndContext>
    // );

    function handleDragEnd(event) {
        const {over} = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        //setParent(over ? over.id : null);
    }
}

    function Droppable(props) {
        const {isOver, setNodeRef} = useDroppable({
            id: props.id,
        });
        const style = {
            color: isOver ? 'green' : undefined,
        };


        return (
            <div className='bg-Primary-300' ref={setNodeRef} style={style}>
                {props.children}
            </div>
        );
    }

    function Draggable(props) {
        const {attributes, listeners, setNodeRef, transform} = useDraggable({
            id: props.id,
        });
        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;


        return (
            <button className='bg-MyWhite' ref={setNodeRef} style={style} {...listeners} {...attributes}>
                {props.children}
            </button>
        );
    }
export default Test;