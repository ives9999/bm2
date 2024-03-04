import {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../../layout/Breadcrumb'
import { getOneAPI } from '../../../context/product/ProductAction';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { formattedWithSeparator } from '../../../functions/math';
import Tab from '../../../component/Tab';
import { ShowHtml } from '../../../functions';

function ProductShow() {
    const {token} = useParams();
    const [data, setData] = useState({});
    const [gallery, setGallery] = useState([]);
    const [attribute, setAttribute] = useState([]);
    //const [content, setContent] = useState('');
    const [tabs, setTabs] = useState([]);
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

            const afterAttributes = [];
            data.attributes.forEach((item) => {
                const temp = {name: item.name, attribute: item.attribute.split(',')};
                afterAttributes.push(temp);
            })
            //console.info(afterAttributes);
            setAttribute(afterAttributes);

            const afterTabs = [];
            data.attributes.forEach((item, idx) => {
                const temp = {key: item.alias, name: item.name, to: item.alias, active: (idx === 0) ? true : false};
                afterTabs.push(temp);
            });
            // console.info(afterTabs);
            setTabs(afterTabs);

            // const markup = {__html: data.content};
            // setContent(markup);

            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '', current: true }]
            })
        });

    }, []);
    const handleTab = (idx) => {
        // setTabs([
        //     {key: 'color', name: '顏色', to: 'color', active: false},
        //     {key: 'weight', name: '重量', to: 'weight', active: true},
        // ])
        setTabs((prev) => {
            let res = prev.map((item, idx1) => {
                (idx === idx1) ? item.active = true : item.active = false
                return item
            })
            return res
        })
    }
    
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

    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            <div className='text-4xl text-Primary-300 mb-16 flex justify-center'>{data.name}</div>
            <div className="mb-12">
                {/* Carousel wrapper */}
                {data.images && data.images.length > 0
                ? <ImageGallery items={gallery} />
                : ''
                }
            </div>
            
            {/* 價錢 */}
            <div className='flex flex-col lg:flex-row lg:justify-between'>
                <div className='ml-4 mb-4'>
                    <h1 className='text-MyWhite text-2xl mb-4'>價格</h1>
                    <div className='flex mb-4 ml-4'>
                        <h2 className='flex items-center text-2xl bg-green-100 text-Warning-400 font-medium me-2 px-5 py-2.5 rounded dark:bg-gray-700 dark:text-Warning-400 border border-Warning-400'>
                            {data && data.prices && data.prices.length > 0
                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_member) + "元"
                            : ''
                            }
                        </h2>
                    </div>
                </div>
                <div className='ml-4 mb-4'>
                    <h1 className='text-MyWhite text-2xl'>屬性</h1>
                    <div className='mb-4 ml-4'>
                        <div className="flex flex-col lg:flex-row mb-4 items-center justify-between">
                            <Tab items={tabs} to={handleTab} />
                        </div>
                        {attribute.map((item1, idx) => (
                            <div className={`mt-6 lg:mx-0 ${tabs[idx].active ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}`}>
                                {/* <h1 className='text-MyWhite text-xl'>{item1.name}</h1> */}
                                    {item1.attribute.map((item2) => (
                                        <h2 className='flex items-center text-2xl bg-green-100 text-Warning-400 font-medium me-2 px-5 py-2.5 rounded dark:bg-gray-700 dark:text-Warning-400 border border-Warning-400'>{item2}</h2>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='ml-4 mb-4'>
                <h1 className='text-MyWhite text-2xl mb-4'>詳細說明</h1>
                <div className='text-PrimaryText text-xl'>
                    <ShowHtml content={data.content} />
                </div>
            </div>

            {/* 屬性 */}
            <div className=''>

            </div>
        </div>
    )
}

export default ProductShow


