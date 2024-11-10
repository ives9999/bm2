import {React, useState, useEffect} from "react";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/20/solid";
import useQueryParams from "../hooks/useQueryParams";
const Test1 = () => {
    const initProducts = [
        {id: 1, name: '多彩之道國際球隊大賽服 白XXL', features: 'https://badminton-code.com/assets/imgs/nophoto.png'},
        {id: 2, name: 'NF starbucks 粉', features: 'https://badminton-code.com/assets/imgs/nophoto.png'},
    ]

    const initRows = [
        {id: 10, name: '出彩國際球星大賽背心 XXL', features: 'https://badminton-code.com/assets/imgs/nophoto.png'},
        {id: 11, name: '鋒影900月3U', features: 'https://badminton-code.com/assets/imgs/nophoto.png'},
    ]

    const navigate = useNavigate();
    const location = useLocation();
    let url = location.pathname;

    // var {k} = useQueryParams();
    // k = (k === undefined) ? "" : k;
    // const [keyword, setKeyword] = useState(k);

    const [filterParams, setFilterParams] = useSearchParams({
        k: '',
    });
    let keyword = filterParams.get('k');
    console.info(typeof keyword);
    if (typeof keyword === 'object') {
        keyword = '';
    }

    const [products, setProducts] = useState([]);
    const [rows, setRows] = useState([]);

    const onChange = async (e) => {
        const value = e.target.value;
        //setKeyword(value);
        setFilterParams(prev => {
            prev.set('k', value);
            return prev;
        });

        let char = (url.indexOf('?') !== -1) ? "&" : "?";
        url += char + 'k=' + value;
        navigate(url);
    }

    const onClear = () => {
        if (keyword.length > 0) {
            //setKeyword('');
            setFilterParams(prev => {
                prev.set('k', '');
                return prev;
            });
            setRows([]);
        }
    }

    useEffect(() => {
        if (keyword.length === 0) {
            setProducts(initProducts);
        } else {
            setRows(initRows);
        }
    }, [keyword]);

    return (
        <div>
            <div className='text-center w-full my-4'>
                <Link to='/test1' className='text-MyWhite text-xl'>回首頁</Link>
            </div>
            <section className='w-full my-4'>
                <div className="text-center w-full">
                    <div className="flex flex-row justify-center">
                        <div className='rounded-lg shadow-sm flex flex-row items-center bg-PrimaryBlock-900 border '>
                            <MagnifyingGlassIcon className='items-center text-MyWhite w-5 h-5 cursor-pointer ml-2'/>
                            <input
                                className='w-full text-sm border-0 focus:border-0 focus:ring-0 text-MyWhite placeholder:text-gray-400 autofill:transition-colors autofill:duration-[5000000ms] bg-PrimaryBlock-900'
                                id='keyword'
                                name='keyword'
                                value={keyword}
                                onChange={onChange}
                            />
                            <div className="pr-1">
                                <span className="cursor-pointer" onClick={onClear}>
                                    <XMarkIcon className="h-5 w-5 text-MyWhite" aria-hidden="true"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='mx-4'>
                {(keyword !== 'null' && keyword.length > 0) ?
                    <section className='w-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-2 grid lg:grid-cols-3 gap-4'>
                        {rows.map(row => (
                            <ProductHomeGrid
                                key={row.id}
                                product={row}
                                color='text-Warning-300'
                            />
                        ))}
                    </section>
                    :
                    <section id="home" className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 px-2 grid lg:grid-cols-3 gap-4">
                        {products.map(product => (
                            <ProductHomeGrid
                                key={product.id}
                                product={product}
                                color='text-Primary-300'
                            />
                        ))}
                    </section>
                }
            </section>
        </div>
    )
}

const ProductHomeGrid = ({product, color}) => {
    return (
        <div
             className="rounded-lg border border-gray-200 bg-MyWhite shadow-sm dark:border-gray-700 dark:bg-PrimaryBlock-950 pt-4 pl-4">
            <img src={product.features} link={"/product/show/" + product.id} alt={product.name}/>
            <div className="px-5 pb-5">
                <h3 className={`text-xl font-bold tracking-tight hover:text-Primary-300 ${color}`}>
                    <Link to={`/product/show/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="mt-8 mb-6 flex flex-row justify-end">
                    <button
                        type="button"
                        className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={(e) => {
                            e.preventDefault()
                            //toTeam(row.id)
                        }}
                    >
                        更多...
                    </button>
                </div>
                <div className="mb-4 mt-3 font-light text-gray-500 dark:text-gray-400">

                </div>

            </div>
        </div>
    )
}


export default Test1;