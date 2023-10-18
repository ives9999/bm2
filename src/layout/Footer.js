// import { Link } from "react-router-dom";

// function NavLink({ href, children }) {
//   return (
//     <Link
//       href={href}
//       className="transition hover:text-teal-500 dark:hover:text-teal-400 text-primaryText"
//     >
//       {children}
//     </Link>
//   )
// }

export default function Footer() {
  return (
    <>
    <footer className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-primaryText dark:text-zinc-200">
            藍色行動有限公司版權所有
            </div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
            <a href="mailto:app@bluemobile.com.tw" className="text-primaryText hover:text-focusBlue">Email給我們</a>
            </p>
        </div>
    </footer>
    </>
  )
}
