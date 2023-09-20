import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
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
        {openClass && <div className="body-overlay-1" onClick={handleRemove} />}
        <Header handleOpen={handleOpen} handleRemove={handleRemove} openClass={openClass} />
        <MobileMenu openClass={openClass} />
        <main className="main">
            {children}
        </main>
        <Footer />
        <BackToTop />
        </>
    );
}

export default Layout;