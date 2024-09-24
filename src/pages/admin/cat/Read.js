import {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import SearchBar from "../../../component/form/searchbar/SearchBar"
import StatusForTable from '../../../component/StatusForTable'
import {FaRegTrashAlt} from "react-icons/fa"
import {GoGear} from "react-icons/go"
import {PrimaryButton, DeleteButton, EditButton} from '../../../component/MyButton'
import {getReadAPI, deleteOneAPI, postUpdateSortOrderAPI} from '../../../context/cat/CatAction'
import useQueryParams from '../../../hooks/useQueryParams'
import {Pagination} from '../../../component/Pagination'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

function ReadCat() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState(null);
    // 用useMemo設定當rows的內容更動時，sortIdx才會跟著變動
    const sortIdx = useMemo(() => rows.map(row => row.id), [rows]);
    // 用useRef設定當rows的內容更動時，sortOrder也不會跟著變動
    let sortOrder = useRef(null);

    var {page, perpage} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage
    const startIdx = (page - 1) * perpage + 1
    const {accessToken} = auth

    const navigate = useNavigate()

    const breadcrumbs = [
        {name: '後台首頁', href: '/admin', current: false},
        {name: '分類', href: '/admin/cat', current: true},
    ]

    const {token} = auth

    useEffect(() => {
        const getData = async () => {
            const data = await getReadAPI(page, perpage)
            if (data.status === 200) {
                setRows(data.data.rows);
                sortOrder.current = data.data.rows.map(row => row.sort_order);

                var meta = data.data._meta;
                // const pageParams = getPageParams(meta)
                // meta = {...meta, ...pageParams}
                setMeta(meta)
            } else {
                var msgs1 = ""
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
                }
                if (msgs1.length > 0) {
                    setAlertModal({
                        modalType: 'alert',
                        modalText: msgs1,
                        isModalShow: true,
                        isShowOKButton: true,
                        isShowCancelButton: false,
                    })
                }
            }
        }

        setIsLoading(true)
        getData()
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const handleEdit = (token) => {
        var url = "/admin/cat/update"
        if (token !== undefined && token.length > 0) {
            url += "/" + token
        }
        navigate(url)
    }
    const handleDelete = (token) => {
        setAlertModal({
            isModalShow: true,
            modalType: 'warning',
            modalTitle: '警告',
            modalText: '是否確定刪除？',
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: onDelete,
            params: {token: token},
        })
    }

    const onDelete = async (params) => {
        const token = params.token
        setIsLoading(true)
        const data = await deleteOneAPI(accessToken, token)
        //console.info(data)
        setIsLoading(false)
        if (data.status !== 200) {
            var msgs = ""
            for (let i = 0; i < data["message"].length; i++) {
                const msg = data["message"][i].message
                msgs += msg + "\n"
            }
            setAlertModal({
                modalType: 'warning',
                modalTitle: '警告',
                modalText: msgs,
                isModalShow: true,
                isShowOKButton: true,
                isShowCancelButton: true,
            })
        } else {
            navigate(0);
        }
    };

    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )

    const Draggable = ({row, idx}) => {
        const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
            id: row.id
        });
        return (
            <tr
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition: transition
                }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {startIdx + idx}
                </th>
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox"
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                    </div>
                </td>
                <td className="px-6 py-4">
                    {row.id}
                </td>
                <td className="px-6 py-4">
                    <img src={row.featured} className='w-12 h-12 rounded-full' alt={row.name}/>
                </td>
                <td className="px-6 py-4">
                    {row.name}
                </td>
                <td className="px-6 py-4">
                    <StatusForTable status={row.status} status_text={row.status_text}/>
                </td>
                <td className="px-6 py-4">
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <EditButton onClick={() => handleEdit(row.token)}>編輯</EditButton>
                        <DeleteButton onClick={() => handleDelete(row.token)}>刪除</DeleteButton>
                    </div>
                </td>
            </tr>
        )
    }

    const handleDragEnd = async (e) => {
        const {active, over} = e;
        if (active !== over) {
            //let items = rows;
            const oldIdx = sortIdx.indexOf(active.id);
            const newIdx = sortIdx.indexOf(over.id);
            // items = arrayMove(items, oldIdx, newIdx);
            // setRows(items);
            // items = items.map(item => {return {token: item.token, sort_order: item.sort_order}});
            //console.info(JSON.stringify(items));

            let res = null;
            setRows(prev => {
                const oldIdx = sortIdx.indexOf(active.id);
                const newIdx = sortIdx.indexOf(over.id);
                //console.info(prev);
                let after = arrayMove(prev, oldIdx, newIdx);

                // 由於拖曳排序時，是整個row跟著移動，所以sort_order也是一樣，這樣排序沒有變動，重新整理後排序依然一樣，所以必須把原來的排序值設定到拖曳後排序值
                after = after.map((item, idx) => {
                    item['sort_order'] = sortOrder.current[idx];
                    return item;
                });
                // console.info(after);
                res = after.map(item => {
                    return {name: item.name, token: item.token, sort_order: item.sort_order}
                });
                return [...after];
            });
            setIsLoading(true);
            const data = await postUpdateSortOrderAPI(auth.accessToken, res);
            //console.info(JSON.stringify(data));
            setIsLoading(false);
        }
    }

    return (
        <div className='p-4'>
            <Breadcrumb items={breadcrumbs}/>
            <h2 className='text-MyWhite text-3xl mb-4'>分類列表</h2>
            <div className='flex justify-between mb-6'>
                <div className="flex items-center justify-center">
                    <div className="mr-4">
                        <SearchBar
                            name="arena"
                            // value={(arena !== null && arena !== undefined && arena.value !== null && arena.value !== undefined) ? arena.value : ''} 
                            // placeholder="請輸入球館名稱"
                            // isShowList={arenas.isShowArenasList}
                            // list={arenas.list}
                            // handleChange={onChange}
                            // onClear={handleClear}
                            // setResult={setArena}
                            // isRequired={true}
                            // errorMsg={errorObj.arenaError.message}
                        />
                    </div>
                    <div className='h-full w-4 border-l border-gray-600'></div>
                    <div className='flex gap-4'>
                        <FaRegTrashAlt className='text-gray-400 text-2xl'/>
                        <GoGear className='text-gray-400 text-2xl'/>
                    </div>
                </div>
                <div>
                    <PrimaryButton className='ml-auto mr-4 md:mr-0' onClick={() => handleEdit('')}>新增</PrimaryButton>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            代表圖
                        </th>
                        <th scope="col" width='20%' className="px-6 py-3">
                            名稱
                        </th>
                        <th scope="col" className="px-6 py-3">
                            狀態
                        </th>
                        <th scope="col" className="px-6 py-3">
                            功能
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                        <SortableContext items={sortIdx} strategy={verticalListSortingStrategy}>
                            {rows.map((row, idx) => (
                                <Draggable key={row.id} row={row} idx={idx}/>
                            ))}
                        </SortableContext>
                    </DndContext>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan='100'>
                            {meta && <Pagination token={token} meta={meta}/>}
                        </td>
                    </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    )
}

export default ReadCat

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
