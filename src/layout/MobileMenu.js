import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useState } from "react"
import Cookies from "universal-cookie";


const Logo = styled.img`
    max-width: 100px;
`;

//cookie
const cookies = new Cookies();
var page = cookies.get("page")
if (page === undefined) {
    page = "home";
}

const MobileMenu = ({ openClass }) => {
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
            <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar bg-gray-900 ${openClass}`}>
                <div className="mobile-header-wrapper-inner">
                    <div className="mobile-header-content-area">
                        <div className="mobile-logo border-gray-800">
                            <Link className="d-flex" href="/">
                                <Logo className="logo-night" alt={process.env.REACT_APP_TITLE} src="/assets/imgs/logo-wide.png" />
                            </Link>
                        </div>
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav className="mt-15">
                                    <ul className="mobile-menu font-heading">
                                        <li className={isActive.key === "home" ? "active" : "has-children"} onClick={() => handleToggle("home")}>
                                            <a href="/">首頁</a>
                                        </li>
                                        <li className={isActive.key === "team" ? "active" : "has-children"} onClick={() => handleToggle("team")}>
                                            <a href="/team">球隊</a>
                                        </li>
                                        <li className={isActive.key === "arena" ? "has-children active" : "has-children"} onClick={() => handleToggle("arena")}>
                                            <span className="menu-expand"><i className="fi-rr-caret-down"></i></span>
                                            <a href="/arena">球館</a>
                                            <ul className={isActive.key === "arena" ? "sub-menu d-block" : "sub-menu d-none"}>
                                                <li><Link href="/single-sidebar">Blog Single 1</Link></li>
                                                <li><Link href="/single-no-sidebar">Blog Single 2</Link></li>
                                                <li><Link href="/single-center">Blog Single 3</Link></li>
                                            </ul>
                                        </li>
                                        <li className={isActive.key === "home" ? "has-children active" : "has-children"} onClick={() => handleToggle("home")}>
                                            <a href="/contact">聯絡我們</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="mobile-account border-gray-800">
                                <div className="mobile-header-top bg-gray-900">
                                    <div className="user-account"><Link href="/page-login"><img src="/assets/imgs/template/ava.jpg" alt={process.env.REACT_APP_TITLE} /></Link>
                                        <div className="content">
                                            <h6 className="user-name color-white">Hello<span className="color-white"> Steven !</span>
                                            </h6>
                                            <p className="font-xs text-muted">You have 3 new messages</p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="mobile-menu">
                                    <li><Link href="/page-login">Profile</Link></li>
                                    <li><Link href="/page-login">Articles Saved</Link></li>
                                    <li><Link href="/page-login">Add new post</Link></li>
                                    <li><Link href="/page-login">My Likes</Link></li>
                                    <li><Link href="/page-login">Account Setting</Link></li>
                                    <li><Link href="/page-login">Sign out</Link></li>
                                </ul>
                            </div>
                            <div className="site-copyright color-gray-400 mt-30">Copyright 2023 © Genz - Personal Blog
                                Template.<br />Designed by<Link href="http://alithemes.com" target="_blank">&nbsp; AliThemes</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MobileMenu;