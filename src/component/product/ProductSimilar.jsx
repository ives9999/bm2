import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {
    DeleteButton,
    PrimaryButton,
    PrimaryOutlineButton,
    SecondaryButton,
} from '../MyButton'
import { AutoCompleteModal, BlueModal } from '../Modal'
import {getReadAPI} from "../../context/product/ProductAction";
import {Featured} from "../image/Images";
import {CardWithTitle} from "../Card";
import {sortOrder} from "../../functions/date";
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { RiDragDropFill } from "react-icons/ri";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
const ProductSimilar = ({
    similars,
    setSimilars,
                        }) => {
    //console.info(similars)
    const [toggleModalShow, setToggleModalShow] = useState(false);
    const sortIdx = useMemo(() => similars.map(row => row.id), [similars]);
    let sortOrderRef = useRef(null);
    sortOrderRef.current = similars.map(row => row.sort_order);

    // const [keyword, setKeyword] = useState('')
    // const keywordRef = useRef();
    // const [similars, setSimilars] = useState([]);
    //
    // const scrollRef = useRef();
    // const currentPageRef = useRef(1);
    // const initPage = {
    //     meta: {
    //         totalCount: 0,
    //         totalPage: 0,
    //         currentPage: 0,
    //         offset: 0,
    //         perPage: process.env.REACT_APP_PERPAGE,
    //     },
    //     rows: [],
    // }
    // const [page, setPage] = useState(initPage);
    // const isFetching = useRef(false);

    const setSelected = (row) => {
        //console.info(row);
        setToggleModalShow(false);
        setSimilars(prev => {
            row.action = 'add';
            //const a = sortOrder(1000);
            //console.info(a);
            row.similar_id = row.id;
            row.sort_order = sortOrder(1000);
            return [...prev, row];
        })
    }

    // const getList = async (currentPage, params) => {
    //     //setIsLoading(true);
    //     const data = await getReadAPI(currentPage, page.meta.perPage, params);
    //
    //     setPage(prev => {
    //         return {...prev, rows: prev.rows.concat(data.data.rows), meta: data.data.meta}
    //     });
    //     isFetching.current = false;
    // }

    // const handleChange = async (e) => {
    //     if (e.target.id === 'product') {
    //         const k = e.target.value
    //         setKeyword(k);
    //
    //         setPage(initPage);
    //
    //         if (k.length > 0) {
    //             await getList(currentPageRef.current, [{k: k}]);
    //         }
    //     }
    // }
    // const handleScroll = async () => {
    //     if (scrollRef.current && keyword.length > 0) {
    //         const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
    //         // console.info("scroll:" + (scrollTop + clientHeight));
    //         // console.info("contentHeight:" + scrollHeight);
    //         if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching.current) {
    //             isFetching.current = true;
    //             // console.info("isLastList:" + isLastList);
    //             // console.info("prevPage:" + prevPage);
    //             // console.info("currPage:" + currPage);
    //             if (currentPageRef.current < page.meta.totalPage) {
    //                 //console.info("page:" + page.currPage);
    //                 const params = [{k: keyword}];
    //                 await getList(currentPageRef.current + 1, params);
    //                 currentPageRef.current++;
    //             }
    //         }
    //     }
    // }

    // const onClear = () => {
    //     setKeyword('');
    //     setPage(initPage);
    //     isFetching.current = false;
    //     currentPageRef.current = 1;
    // }

    // const getRead = (params) => {
    //     setIsLoading(true);
    //     const data = getReadAPI(1, 20, params);
    //     setIsLoading(false);
    //     return data;
    // }

    const ResultRow = ({row, idx}) => {
        //console.info(row);
        return (
            <div className='px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>
                <p>{idx+1}.</p>
                <Featured row={row} className='w-12' />
                {row.name}
            </div>
        )
    }

    const addSimilar = () => {
        setToggleModalShow(true);
    }

    const onDelete = (idx) => {
        setSimilars(prev => {
            const row = prev[idx];
            row.action = 'delete';
            prev[idx] = row;
            return [...prev];
        })
    }

    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )

    const onDragEnd = (e) => {
        //console.info(e);
        const {active, over} = e;
        // console.info(active);
        // console.info(over);
        if (active && over && active !== over) {
            setSimilars(prev => {
                const oldIdx = sortIdx.indexOf(active.id);
                const newIdx = sortIdx.indexOf(over.id);
                //console.info(prev);
                let after = arrayMove(prev, oldIdx, newIdx);
                //console.info(after);

                // 由於拖曳排序時，是整個row跟著移動，所以sort_order也是一樣，這樣排序沒有變動，重新整理後排序依然一樣，所以必須把原來的排序值設定到拖曳後排序值
                after = after.map((item, idx) => {
                    item['sort_order'] = sortOrderRef.current[idx];
                    item['action'] = 'update';
                    return item;
                });
                return [...after];
            });
        }
    }

    const Dragdrop = ({row, idx}) => {
        const {attributes, listeners, setNodeRef, transform, transition} = useSortable(
            {id: row.id}
        )
        return (
            <div
                className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition: transition
                }}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
            >
                <div
                    className="flex flex-wrap text-sm font-medium text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-500 dark:text-gray-400 dark:bg-gray-700">
                    <h2 className='flex items-center justify-between w-full p-5 text-xl rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-MyWhite hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
                        {row.name}
                    </h2>
                    <div className="w-full"
                         aria-labelledby="accordion-collapse-heading-1">
                        <div
                            className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                            <Featured row={row} className='w-full'/>
                            <div className='mt-4 flex flex-row gap-4'>
                                <DeleteButton type='button' onClick={() => onDelete(idx)}>刪除</DeleteButton>
                                <div
                                    className='w-36 px-2 py-2 border border-MyWhite text-MyWhite rounded-lg flex flex-row justify-between items-center'
                                >
                                    按我拖曳排序
                                    <RiDragDropFill className='w-5 h-5 text-MyWhite' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex">
                <PrimaryOutlineButton
                    type="button"
                    className="ml-auto mr-4 md:mr-0"
                    onClick={addSimilar}
                >
                    新增類似商品
                </PrimaryOutlineButton>
            </div>

            <DndContext onDragEnd={onDragEnd} sensors={sensors} collisionDetection={closestCenter}>
                <div className='mt-4 grid grid-cols-1 lg:grid-cols-3 justify-center gap-4'>
                    <SortableContext items={sortIdx}>
                        {similars && Array.isArray(similars) && similars.length > 0 && similars.map((similar, idx) => (
                            similar.action !== 'delete' ?
                                <Dragdrop key={similar.token} row={similar} idx={idx}/>
                                : ''
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <AutoCompleteModal
                toggleModalShow={toggleModalShow}
                setToggleModalShow={setToggleModalShow}
                title='搜尋商品'
                placeholder='請輸入商品關鍵字'
                setSelected={setSelected}
                getReadAPI={getReadAPI}
                ResultRow={ResultRow}
            />

            {/*<BlueModal isModalShow={toggleModalShow}>*/}
            {/*    <BlueModal.Header setIsModalShow={setToggleModalShow}>*/}
            {/*        搜尋商品*/}
            {/*    </BlueModal.Header>*/}
            {/*    <BlueModal.Body height='h-[300px]'>*/}
            {/*        <div className={`flex justify-between mb-2`}>*/}
            {/*            <label className="block text-MyWhite font-medium leading-6 ml-1">*/}
            {/*                請輸入商品關鍵字*/}
            {/*            </label>*/}
            {/*        </div>*/}
            {/*        <div className="">*/}
            {/*            <div className='relative rounded-md shadow-sm'>*/}
            {/*                <MagnifyingGlassIcon*/}
            {/*                    className='absolute left-2 top-2 inset-y-0 items-center text-MyWhite w-5 h-5'/>*/}
            {/*                <input*/}
            {/*                    autoFocus*/}
            {/*                    ref={keywordRef}*/}
            {/*                    className={`*/}
            {/*                w-full pl-10 border text-sm rounded-lg block bg-PrimaryBlock-900  placeholder:text-gray-400 text-MyWhite autofill:transition-colors autofill:duration-[5000000ms] */}
            {/*                focus:ring-Primary-300 focus:border-Primary-300 border-PrimaryBlock-600`}*/}
            {/*                    placeholder={'請輸入關鍵字...'}*/}
            {/*                    name='product'*/}
            {/*                    value={keyword}*/}
            {/*                    id='product'*/}
            {/*                    onChange={handleChange}*/}
            {/*                />*/}
            {/*                <div className="absolute inset-y-0 right-0 items-center pr-3 flex">*/}
            {/*                    <span className="cursor-pointer" onClick={() => onClear('product')}>*/}
            {/*                        <XMarkIcon className="h-5 w-5 mr-2 text-MyWhite" aria-hidden="true"/>*/}
            {/*                    </span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div ref={scrollRef} className='h-[200px] overflow-y-auto mt-4' onScroll={handleScroll}>*/}
            {/*            <ul className='text-base text-gray-700 dark:text-gray-200 dark:bg-gray-700 list-none rounded-lg shadow'>*/}
            {/*            {page.rows.length > 0 && page.rows.map((row, idx) => (*/}
            {/*                <li key={row.token} onClick={() => setResult(idx)} className='px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer flex flex-row items-center gap-2 my-2'>*/}
            {/*                    <p>{idx+1}.</p>*/}
            {/*                    <Featured row={row} className='w-12' />*/}
            {/*                    {row.name}*/}
            {/*                </li>*/}
            {/*            ))}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </BlueModal.Body>*/}
            {/*    <BlueModal.Footer>*/}
            {/*        <PrimaryButton onClick={() => setToggleModalShow(false)}>*/}
            {/*            關閉*/}
            {/*        </PrimaryButton>*/}
            {/*    </BlueModal.Footer>*/}
            {/*</BlueModal>*/}
        </>
    )
}

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

export default ProductSimilar



