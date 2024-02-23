import { useContext, useReducer, useState } from "react";
import BMContext from "../../../context/BMContext";
import Breadcrumb from '../../../layout/Breadcrumb'
import Input from "../../../component/form/Input";
import SearchBar from "../../../component/form/searchbar/SearchBar";
import UseHr from "../../../component/UseHr";
import {PrimaryButton} from '../../../component/MyButton';
import SearchResultsList from "../../../component/form/searchbar/SearchResultsList";

const EditArena = () => {
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
    })

    const {name, leader} = formData

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
    }

    const handleClear = (id) => {
    }

    const [arenas, setArenas] = useState([])

    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
              <h2 className="text-Primary-300 text-center text-4xl font-bold mb-8">登錄球隊</h2>
            </main>
            <form onSubmit={onSubmit}>
                <div className="max-w-sm mx-auto bg-PrimaryBlock-950 border border-PrimaryBlock-800 p-8 rounded-lg">
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
                    <SearchBar setResults={setArenas} />
                    {arenas && arenas.length > 0 && <SearchResultsList results={arenas} />}
                    <div className="mb-6"></div>
                    
                    <PrimaryButton type="submit" className="w-full">送出</PrimaryButton>

                </div>
            </form>
        </div>
    )
}
export default EditArena