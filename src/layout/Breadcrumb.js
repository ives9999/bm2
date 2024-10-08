import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {Link} from 'react-router-dom';

const Breadcrumb = ({
    items,
}) => {
    const pathnames = window.location.pathname.split('/');//console.info(pathnames);
    let area = '/';
    if (pathnames.length > 1 && pathnames[1] === 'pos') {
        area = '/pos';
    } else if (pathnames[1] === 'admin') {
        area = '/admin';
    } else {
        area = '/';
    }

    function Level({prop}) {
        if (prop.current) {
            return <span className="ml-4 text-sm font-medium text-breadcrumbColor">{prop.name}</span>
        } else {
            return (
                <>
                <Link
                    to={prop.href}
                    className="ml-4 text-sm font-medium text-breadcrumbColor hover:text-Primary-300"
                    aria-current='page'
                >
                    {prop.name}
                </Link>
                </>
            )
        }
    }

    return (
        <nav className="flex ps-2 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
            <li>
            <div>
                <Link to={area} className="text-breadcrumbColor hover:text-Primary-300">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">首頁</span>
                </Link>
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