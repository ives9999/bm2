import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { dump } from "../functions"

const Breadcrumb = ({
    items,
}) => {
    function Level({prop}) {
        if (prop.current) {
            return <span className="ml-4 text-sm font-medium text-breadcrumbColor">{prop.name}</span>
        } else {
            return (
                <>
                <a
                    href={prop.href}
                    className="ml-4 text-sm font-medium text-breadcrumbColor hover:text-Primary"
                    aria-current='page'
                >
                    {prop.name}
                </a>
                </>
            )
        }
    }

    return (
        <nav className="flex ps-2 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
            <li>
            <div>
                <a href="/" className="text-breadcrumbColor hover:text-Primary">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">首頁</span>
                </a>
            </div>
            </li>
            {items.map((item) => (
            <li key={item.name}>
                <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-menuTextWhite" aria-hidden="true" />
                    <Level prop={item} />
                </div>
            </li>
            ))}
        </ol>
        </nav>
    );
}
export default Breadcrumb;