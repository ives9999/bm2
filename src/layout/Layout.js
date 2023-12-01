import { useState } from "react"
import BackToTop from '../component/BackToTop';
//import Cookies from "universal-cookie";

//cookie
// const cookies = new Cookies();
// var page = cookies.get("page")
// if (page === undefined) {
//     page = "home";
// }


const Layout = ({children}) => {

    // State to control the 'openClass' CSS class
    const [openClass, setOpenClass] = useState('');

    // Function to handle opening the mobile menu
    const handleOpen = () => {
        // Add the "mobile-menu-active" class to the body element
        document.body.classList.add("mobile-menu-active");

        // Set the 'openClass' state to "sidebar-visible"
        setOpenClass("sidebar-visible");
    }

    // Function to handle removing the mobile menu
    const handleRemove = () => {
        // Check if the 'openClass' state is "sidebar-visible"
        if (openClass === "sidebar-visible") {
            // Remove the "mobile-menu-active" class from the body element
            document.body.classList.remove("mobile-menu-active");

            // Reset the 'openClass' state to an empty string
            setOpenClass("");
        }
    }

    return (
        <>
        <div className="min-h-full bg-background pt-6 pb-16 2xl:px-32 xl:px-24 lg:px-16 px-8">
            {children}
            <BackToTop />
        </div>
        </>
    );
}

export default Layout;