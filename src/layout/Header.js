import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const Logo = styled.img`
    max-width: 200px;
`;

//cookie
const cookies = new Cookies();
var page = cookies.get("page")
if (page === undefined) {
    page = "home";
}

var isLogin = false
var token = cookies.get("token")
if (token !== undefined) {
    isLogin = true
}

function GetMember() {
    const url = process.env.REACT_APP_API + "/member/getOne"
    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData'], 
        queryFn: () => 
            fetch(url).then(
                (res) => res.json()
            ),
    })
    if (isLoading) return 'Loading...'
    if (error) return 'An error has occured: ' + error.message
}

const Header = ({ handleOpen, handleRemove, openClass }) => {

    // State to keep track of the scroll position
    const [scroll, setScroll] = useState(0);
    // Effect hook to add a scroll event listener
    useEffect(() => {
        // Callback function to handle the scroll event
        const handleScroll = () => {
            // Check if the current scroll position is greater than 100 pixels
            const scrollCheck = window.scrollY > 100;

            // Update the 'scroll' state only if the scroll position has changed
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        };

        // Add the 'handleScroll' function as a scroll event listener
        document.addEventListener("scroll", handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    });

    // State to represent whether something is toggled or not
    const [isToggled, setToggled] = useState(false);

    // Function to toggle the value of 'isToggled'
    const toggleTrueFalse = () => setToggled(!isToggled);
        
    // State to track the active status and key
    const [isActive, setIsActive] = useState({
        status: false,
        key: page,
    });

    // Function to handle toggling the active status based on the given key
    const handleToggle = (key) => {

        cookies.set('page', key, {
            domain: process.env.REACT_APP_DOMAIN,
            expire: 60*60*24*30*365*10,
            path: '/',
            secure: 0,
        })
        // Check if the current key matches the active key in the state
        if (isActive.key === key) {
            // If the current key matches, set the active status to false
            setIsActive({
                status: false,
            });
        } else {
            // If the current key does not match, set the active status to true and update the key
            setIsActive({
                status: true,
                key,
            });
        }
    };

    return (
        <>
    
        <header className={scroll ? "header sticky-bar bg-gray-900 stick" : "header sticky-bar bg-gray-900"}>
            <div className="container">
                <div className="main-header">
                    <div className="header-logo">
                        <a className="d-flex" href="/">
                            <Logo className="logo-night" alt={process.env.REACT_APP_TITLE} src="/assets/imgs/logo-wide.png"/>
                        </a>
                    </div>
                    <div className="header-nav">
                        <nav className="nav-main-menu d-none d-xl-block">
                            <ul className="main-menu">
                                <li><a className={isActive.key === 'home' ? "active" : "color-gray-500"} href="/" onClick={()=>handleToggle('home')}>首頁</a></li>
                                <li><a className={isActive.key === 'team' ? "active" : "color-gray-500"} onClick={() => handleToggle('team')} href="/team">球隊</a></li>
                                <li className="has-children"><a className={isActive.key === 'arena' ? "active" : "color-gray-500"} href="/arena">球館</a>
                                    <ul className="sub-menu two-col">
                                        <li><Link className="color-gray-500" href="/blog-archive">Blog Category 1</Link></li>
                                        <li><Link className="color-gray-500" href="/blog-archive-2">Blog Category 2</Link></li>
                                        <li><Link className="color-gray-500" href="/blog-archive-3">Blog Category 3</Link></li>
                                        <li><Link className="color-gray-500" href="/blog-archive-4">Blog Category 4</Link></li>
                                        <li><Link className="color-gray-500" href="/blog-archive-5">Blog Category 5</Link></li>
                                    </ul>
                                </li>
                                <li><a className={isActive.key === 'contact' ? "active" : "color-gray-500"} href="/contact">聯絡我們</a></li>
                            </ul>
                        </nav>
                        <div className={`burger-icon burger-icon-white ${openClass && "burger-close"}`}
                            onClick={() => { handleOpen(); handleRemove() }}>
                            <span className="burger-icon-top" />
                            <span className="burger-icon-mid" />
                            <span className="burger-icon-bottom" />
                        </div>
                    </div>
                    <div className="header-right text-end">
                        <Link className="btn btn-search" href="#" onClick={toggleTrueFalse} />
                        {/* <SwitchButton /> */}
                        <div className={isToggled ? "form-search p-20 d-block" : " form-search p-20 d-none"}>
                            <form action="#">
                                <input className="form-control" type="text" placeholder="Search" />
                                <input className="btn-search-2" />
                            </form>
                            <div className="popular-keywords text-start mt-20">
                                <p className="mb-10 color-white">Popular tags:</p>
                                <Link className="color-gray-600 mr-10 font-xs" href="#"># Travel,</Link>
                                <Link className="color-gray-600 mr-10 font-xs" href="#"># Tech,</Link>
                                <Link className="color-gray-600 mr-10 font-xs" href="#"># Movie</Link>
                                <Link className="color-gray-600 mr-10 font-xs" href="#"># Lifestyle</Link>
                                <Link className="color-gray-600 mr-10 font-xs" href="#"># Sport</Link>
                            </div>
                        </div><a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
                    </div>
                </div>
            </div>
        </header>
    </>
    );
  }

  export default Header  
