import {useNavigate} from 'react-router-dom'
import { IoClose } from "react-icons/io5";

function MobileDrawer({
    items,
    isOpen,
    setIsOpen,
}) {
    const navigate = useNavigate();
    const toLink = (href) => {
        setIsOpen(false);
        navigate(href);
    }
    return (
        <main
            className={' fixed overflow-hidden z-[1000] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
            (isOpen ? ' transition-opacity opacity-100 duration-500 translate-x-0 '
                    : ' transition-all delay-500 opacity-0 translate-x-full ')
            }
        >
            <section
                className={
                    ' w-4/5 max-w-lg right-0 px-2 absolute bg-PrimaryBlock-950 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform ' +
                    (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
                }
            >
                <article className='relative max-w-lg xl:flex xl:flex-col space-y-6 overflow-y-scroll h-full'>
                    <div className='p-2' onClick={() => setIsOpen(false)}><IoClose className='w-5 h-5 text-MyWhite float-right' /></div>
                    <ul className='text-MyWhite mt-4'>
                        {items.map((item) => (
                            <li key={item.name} className='p-2 mb-4 text-xl border-b border-MenuDivider border-solid'><span onClick={() => toLink(item.href)}>{item.name}</span></li>
                        ))}
                    </ul>
                </article>
            </section>
            <section className='w-screen h-full cursor-pointer' onClick={() => {setIsOpen(false);}}></section>
        </main>
    )
}

export default MobileDrawer
