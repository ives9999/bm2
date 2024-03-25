import { React, useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';
import { getOneAPI } from "../../../context/arena/ArenaAction";
import { FaCheckCircle } from "react-icons/fa";
import ImageGallery from 'react-image-gallery';
import Breadcrumb from '../../../layout/Breadcrumb'

function ArenaShow() {
    const [ data, setData ] = useState({rows: []})
    const initBreadcrumb = [
        { name: '球場', href: '/arena', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [gallery, setGallery] = useState([]);

    const {token} = useParams();
    
    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        data = data.data;
        return data;
    }
    useEffect(() => {
        getOne(token, 'update').then((data) => {
            //console.info(data);
            setData(data);

            const images = [];
            data.images.forEach((item) => {
                images.push({original: item.path, thumbnail: item.path});
            });
            setGallery(images);
            //console.info(data.attrs);

            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '', current: true }]
            })
        });

    }, []);

    if (Object.keys(data).length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            
            {/* 全部內容跟旁邊的類別 */}
            <div className="flex flex-col lg:flex-row relative z-20 justify-between px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                {/* 全部內容 */}
                <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    {/* 標題圖片跟詳細內容 */}
                    <div className="flex flex-col py-6 border-t dark:border-gray-700">
                        <div className="flex flex-col md:flex-row pb-6 border-b dark:border-gray-700">
                            {/* 標題跟圖片 */}
                            <div className="">
                                {/* 標題 */}
                                <h1 className="mb-4 max-w-2xl text-2xl dark:text-white-50 font-extrabold leading-none text-gray-900 sm:text-3xl lg:text-4xl">{data.name}</h1>
                                {/* 價格 */}
                                <div className='flex'>
                                    <h2 className='flex mb-4 text-2xl text-Warning-600 font-medium me-2py-2.5'>
                                        {/* {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_member) + "元"
                                            : ''
                                        } */}
                                    </h2>
                                </div>
                                {/* 屬性 */}
                                <ul className='mb-4'>
                                    <li key='cat' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>分類：</span>
                                        {data.cat 
                                            ? data.cat.map((item, idx) => (
                                                <div key='item.text'>
                                                    <span className='text-MyWhite'>{item.text}</span>
                                                    {(idx < data.cat.length-1) ? <span className='text-MyWhite'>,&nbsp;</span> : ''}
                                                </div>
                                            ))
                                            : ''
                                        }
                                    </li>
                                    <li key='brand_text' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>品牌：</span>
                                        <span className='text-MyWhite'>{data.brand_text}</span>
                                    </li>
                                    {data.attrs.map((attr) => (
                                        <li key={attr.alias} className='flex items-center mb-4'>
                                            <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                            <span className='text-MyWhite'>{attr.name}：</span>
                                                {attr.rows.map((row, idx) => (
                                                    <div key={row.alias} className='flex items-center justify-center'>
                                                        {/* {(attr.name === '顏色')
                                                            ? <ToColor color={row.name} />
                                                            : <span className='text-MyWhite'>{row.name}</span>
                                                        } */}
                                                        {(idx < attr.rows.length-1) ? <span className='text-MyWhite'>&nbsp;&nbsp;</span> : ''}
                                                    </div>
                                                ))}
                                        </li>
                                    ))}
                                    <li key='barcode_brand' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className='text-MyWhite'>編號：</span>
                                        <span className='text-MyWhite'>{data.barcode_brand}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                {/* 圖片 */}
                                <div className="w-full xl:w-[400px]">
                                    {data.images && data.images.length > 0
                                        ? <ImageGallery items={gallery} />
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='my-4 pt-6'>
                            <h1 className='text-MyWhite text-xl font-semibold mb-4'>詳細說明</h1>
                            <div className='text-PrimaryText text-xl'>
                                {data.content}
                            </div>
                        </div>
                    </div>
                </article>
                <aside className="xl:block" aria-labelledby="sidebar-label">
                    <div className="xl:w-[336px] sticky top-6">
                        <h3 id="sidebar-label" className="sr-only">側邊欄</h3>
                        {/* <ProductCats able="product" cats={data.cats} perpage={process.env.REACT_APP_PERPAGE} /> */}
                    </div>
                </aside>
            </div>
        </div>
    )
    }
}

export default ArenaShow
