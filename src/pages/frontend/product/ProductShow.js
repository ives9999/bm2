import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { formattedWithSeparator } from '../../../functions/math';
import { ShowHtml } from '../../../functions';
import { FaCheckCircle } from "react-icons/fa";

function ProductShow() {
    const {token} = useParams();
    const [data, setData] = useState({});
    const [gallery, setGallery] = useState([]);
    // const [attrs, setAttrs] = useState([]);
    //const [attribute, setAttribute] = useState([]);
    //const [content, setContent] = useState('');
    //const [tabs, setTabs] = useState([]);
    const initBreadcrumb = [
        { name: '商品', href: '/product', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)

    useEffect(() => {
        const getOne = async (token, scenario) => {
            let data = await getOneAPI(token, scenario);
            data = data.data;
            return data;
        }

        getOne(token, '').then((data) => {
            console.info(data);
            setData(data);

            const images = [];
            data.images.forEach((item) => {
                images.push({original: item.path, thumbnail: item.path});
            });
            setGallery(images);
            //console.info(data.attrs);

            //setAttrs(data.attrs);
            // const afterAttributes = [];
            // data.attributes.forEach((item) => {
            //     const temp = {name: item.name, attribute: item.attribute.split(',')};
            //     afterAttributes.push(temp);
            // })
            //console.info(afterAttributes);
            //setAttribute(afterAttributes);

            // const afterTabs = [];
            // data.attributes.forEach((item, idx) => {
            //     const temp = {key: item.alias, name: item.name, to: item.alias, active: (idx === 0) ? true : false};
            //     afterTabs.push(temp);
            // });
            // // console.info(afterTabs);
            // setTabs(afterTabs);

            // const markup = {__html: data.content};
            // setContent(markup);

            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '', current: true }]
            })
        });

    }, []);
    // const handleTab = (idx) => {
    //     // setTabs([
    //     //     {key: 'color', name: '顏色', to: 'color', active: false},
    //     //     {key: 'weight', name: '重量', to: 'weight', active: true},
    //     // ])
    //     setTabs((prev) => {
    //         let res = prev.map((item, idx1) => {
    //             (idx === idx1) ? item.active = true : item.active = false
    //             return item
    //         })
    //         return res
    //     })
    // }
    
    // const images = [
    //     {
    //       original: "https://picsum.photos/id/1018/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1018/250/150/",
    //     },
    //     {
    //       original: "https://picsum.photos/id/1015/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1015/250/150/",
    //     },
    //     {
    //       original: "https://picsum.photos/id/1019/1000/600/",
    //       thumbnail: "https://picsum.photos/id/1019/250/150/",
    //     },
    //   ];

    if (Object.keys(data).length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            
            <div className="flex relative z-20 justify-between px-4 mx-auto max-w-screen-xl bg-white dark:bg-gray-900 rounded">
                <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center py-6 border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="grid gap-8 items-center mb-8 lg:mb-2 lg:gap-12 lg:grid-cols-12">
                            <div className="col-span-6 text-center sm:mb-6 lg:text-left lg:mb-0">
                                <h1 className="mx-auto mb-4 max-w-2xl text-2xl dark:text-white font-extrabold leading-none text-gray-900 sm:text-3xl lg:text-4xl">{data.name}</h1>
                                <div className='flex'>
                                    <h2 className='flex items-center mb-4 text-2xl text-Warning-600 font-medium me-2py-2.5'>
                                        {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_member) + "元"
                                            : ''
                                        }
                                    </h2>
                                    <del className='flex items-center mb-4 ml-3 text-xl text-BG-400 font-medium me-2py-2.5'>
                                        {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_nonmember) + "元"
                                            : ''
                                        }
                                    </del>
                                </div>
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
                                                        {(attr.name === '顏色')
                                                            ? <ToColor color={row.name} />
                                                            : <span className='text-MyWhite'>{row.name}</span>
                                                        }
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
                                {/* <p className="mx-auto mb-6 max-w-xl font-light text-gray-500 lg:mx-0 xl:mb-8 md:text-lg xl:text-xl dark:text-gray-400">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p> */}
                            </div>
                            <div className="col-span-6">
                                {/* Carousel wrapper */}
                                {data.images && data.images.length > 0
                                    ? <ImageGallery items={gallery} />
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                                            
                    <div className='my-4'>
                        <h1 className='text-MyWhite text-xl font-semibold mb-4'>詳細說明</h1>
                        <div className='text-PrimaryText text-xl'>
                            <ShowHtml content={data.content} />
                        </div>
                    </div>

                </article>
                <aside className="hidden xl:block" aria-labelledby="sidebar-label">
                    <div className="xl:w-[336px] sticky top-6">
                        <h3 id="sidebar-label" className="sr-only">Sidebar</h3>
                        <div className="p-4 mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-white uppercase">Flowbite News morning headlines</h4>
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Get all the stories you need-to-know from the most powerful name in news delivered first thing every morning to your inbox</p>
                            <form action="#">
                                <label htmlFor="email-address-icon" className="sr-only">Your Email</label>
                                <div className="relative mb-4">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                                        </svg>                          </div>
                                    <input required type="text" id="email-address-icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="name@company.com" />
                                </div>
                                <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 text-center w-full">Subscribe</button> 
                            </form>
                        </div>
                        <div className="p-4 mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white uppercase">Latest news</h4>
                            <div className="mb-6">
                                <h5 className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">Our first office</h5>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
                                <a href="/" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
                                    Read in 9 minutes
                                </a>
                            </div>
                            <div className="mb-6">
                                <h5 className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">Enterprise Design tips</h5>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
                                <a href="/" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
                                    Read in 14 minutes
                                </a>
                            </div>
                            <div className="mb-6">
                                <h5 className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">Our first project with React</h5>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
                                <a href="/" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
                                    Read in 4 minutes
                                </a>
                            </div>
                        </div>
                        <div>   
                            <div className="flex justify-center items-center mb-3 w-full h-48 bg-gray-100 rounded-lg dark:bg-gray-800">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                            </div>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Students and Teachers, save up to 60% on Flowbite Creative Cloud.</p>
                            <p className="text-xs font-medium text-gray-400 uppercase dark:text-gray-500">Ads placeholder</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
    }
}

export default ProductShow

function ToColor({color}) {
    const className = 'w-6 h-6 rounded-full';
    if (color === '紅') {
        return <div className={`bg-Warning-500 ${className}`}> </div>
    } else if (color === '藍') {
        return <div className={`bg-Success-500 ${className}`}> </div>
    } else {
        return <div className={`bg-MyWhite ${className}`}>{color}</div>
    }
}
