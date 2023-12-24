import { useContext, useReducer, useState } from "react";
import BMContext from "../../context/BMContext";
import Breadcrumb from '../../layout/Breadcrumb'
import Input from "../../component/form/Input";
import SearchBar from "../../component/form/searchbar/SearchBar";
import UseHr from "../../component/UseHr";
import {PrimaryButton} from '../../component/MyButton';
import SearchResultsList from "../../component/form/searchbar/SearchResultsList";
import { filterKeywordAPI } from "../../context/arena/ArenaAction";

const EditTeam = () => {
    const {memberData, setAlertModal, setIsLoading} = useContext(BMContext)
    const breadcrumbs = [
        { name: '會員', href: '/member', current: false },
        { name: '球隊', href: '/member/editTeam', current: false },
        { name: '新增球隊', href: '/member/editTeam', current: true },
    ]
    const {token} = memberData

    const [formData, setFormData] = useState({
        name: '',
        leader: '',
        arena: null,
    })

    const {name, leader, arena} = formData

    const obj = {code: 0, message: '',}
    const initalError = {
        loading: false,
        nameError: obj,
        leaderError: obj,
    }

    const errorReducer = (state=initalError, action) => {

    }
    const [errorObj, dispatch] = useReducer(errorReducer, initalError)

    //當輸入值改變時，偵測最新的值
    const onChange = (e) => {
        if (e.target.id === "arena") {
            const arena = {arena: {value: e.target.value}}
            setFormData({...formData, ...arena})
            if (e.target.value.length > 0) {
                fetchArenas(e.target.value)
            }
        } else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })    
        }
    }

    const handleClear = (id) => {
    }

    const [arenas, setArenas] = useState({
        isShowArenasList: false,
        list: [],
    })

    const setArena = (arena) => {
        //console.info(arena)
        setArenas({
            ...arena, isShowArenasList: false,
        })
        setFormData({
            ...formData,
            arena: arena
        })
    }

    const fetchArenas = async (k) => {
        setIsLoading(true)
        const data = await filterKeywordAPI(k)
        setArenas({
            isShowArenasList: true,
            list: data,
        })
        setIsLoading(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary text-center text-4xl font-bold mb-8">登錄球隊</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-MenuBG border border-MenuBorder p-8 rounded-lg">
                    <Input 
                        label="球隊名稱"
                        type="text"
                        name="name"
                        value={name || ''}
                        id="name"
                        placeholder="羽球密碼"
                        isRequired={true}
                        errorMsg={errorObj.nameError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <Input 
                        label="隊長"
                        type="text"
                        name="leader"
                        value={leader || ''}
                        id="leader"
                        placeholder="王大明"
                        isRequired={true}
                        errorMsg={errorObj.leaderError.message}
                        onChange={onChange}
                        onClear={handleClear}
                    />
                    <SearchBar 
                        id="arena" 
                        name="arena" 
                        value={(arena !== null && arena !== undefined && arena.value !== null && arena.value !== undefined) ? arena.value : ''} 
                        handleChange={onChange} 
                    />
                    {arenas.isShowArenasList && <SearchResultsList results={arenas} setResult={setArena} />}
                    
                    <div className="mb-6"></div>
                    
                    <PrimaryButton type="submit" extraClassName="w-full">送出</PrimaryButton>

                </div>
            </form>
        </div>
    )
}
export default EditTeam