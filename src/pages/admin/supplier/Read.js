import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {ImSpinner6} from "react-icons/im";
import BMContext from "../../../context/BMContext";
import Breadcrumb from "../../../component/Breadcrumb";
import useQueryParams from "../../../hooks/useQueryParams";
import {useNavigate} from "react-router-dom";
import {getReadAPI} from "../../../context/Supplier/Supplier";

const ReadSupplier = () => {
    const {auth, setIsLoading, warning, setAlertModal} = useContext(BMContext);
    const [isGetComplete, setIsGetComplete] = useState(false);

    const initBreadcrumb = [
        {name: '後台首頁', href: '/admin', current: false},
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb);

    var {page, perpage, k, cat} = useQueryParams()
    page = (page === undefined) ? 1 : page
    perpage = (perpage === undefined) ? process.env.REACT_APP_PERPAGE : perpage;
    k = (k === undefined) ? "" : k;
    const [keyword, setKeyword] = useState('');

    const [_page, setPage] = useState(page);
    const startIdx = (page - 1) * perpage + 1

    const {accessToken} = auth

    const navigate = useNavigate();

    const [read, setRead] = useState({rows: [], meta: {}});
    // 用useMemo設定當rows的內容更動時，sortIdx才會跟著變動
    const sortIdx = useMemo(() => read.rows.map(row => row.id), [read.rows]);
    // 用useRef設定當rows的內容更動時，sortOrder也不會跟著變動
    let sortOrder = useRef(null);



    const getData = async (accessToken, page, perpage, params) => {
        const data = await getReadAPI(accessToken, page, perpage, params);
        console.info(data.data);
        if (data.status === 200) {
            setRead(prev => {
                if (data.data.meta.currentPage === 1) {
                    return {rows: data.data.rows, meta: data.data.meta};
                } else {
                    return {rows: [...prev, ...data.data.rows], meta: data.data.meta};
                }
            })
            sortOrder.current = data.data.rows.map(row => row.sort_order);
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
        setIsGetComplete(true);
    }

    useEffect(() => {
        setIsLoading(true);

        const params = {};
        getData(accessToken, page, perpage, params)
        setIsLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_page, cat, keyword])

    if (!isGetComplete) {
        return (
            <div className="text-MyWhite mt-[100px] w-full flex flex-col items-center gap-1 justify-center">
                <ImSpinner6 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-MyWhite"/>
                載入資料中...
            </div>
        )
    } else {
        return (
            <div className='p-4'>
                <Breadcrumb items={breadcrumbs}/>
                <h2 className='text-MyWhite text-3xl mb-4'>供應商列表</h2>

            </div>
        );
    }
};

export default ReadSupplier;