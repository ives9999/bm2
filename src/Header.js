export default function Header() {
    return (
        <>
<header className="header sticky-bar bg-gray-900">
      <div className="container">
        <div className="main-header">
          <div className="header-logo"><a className="d-flex" href="index.html"><img className="logo-night" alt="GenZ" src="assets/imgs/template/logo.svg"/><img className="d-none logo-day" alt="GenZ" src="assets/imgs/template/logo-day.svg"/></a></div>
          <div className="header-nav">
            <nav className="nav-main-menu d-none d-xl-block">
              <ul className="main-menu">
                <li className="has-children"><a className="active" href="index.html">Home</a>
                  <ul className="sub-menu">
                    <li><a className="color-gray-500" href="index.html">Homepage - 1</a></li>
                    <li><a className="color-gray-500" href="index-2.html">Homepage - 2</a></li>
                    <li><a className="color-gray-500" href="index-3.html">Homepage - 3</a></li>
                    <li><a className="color-gray-500" href="index-4.html">Homepage - 4</a></li>
                  </ul>
                </li>
                <li className="has-children"><a className="color-gray-500" href="page-about.html">About Me</a>
                  <ul className="sub-menu">
                    <li><a className="color-gray-500" href="page-portfolio.html">My Portfolio</a></li>
                    <li><a className="color-gray-500" href="page-portfolio-2.html">My Portfolio 2</a></li>
                    <li><a className="color-gray-500" href="portfolio-details.html">Portfolio Details</a></li>
                  </ul>
                </li>
                <li className="has-children"><a className="color-gray-500" href="#">Category</a>
                  <ul className="sub-menu two-col">
                    <li><a className="color-gray-500" href="blog-archive.html">Blog Category 1</a></li>
                    <li><a className="color-gray-500" href="blog-archive-2.html">Blog Category 2</a></li>
                    <li><a className="color-gray-500" href="blog-archive-3.html">Blog Category 3</a></li>
                    <li><a className="color-gray-500" href="blog-archive-4.html">Blog Category 4</a></li>
                    <li><a className="color-gray-500" href="blog-archive-5.html">Blog Category 5</a></li>
                  </ul>
                </li>
                <li className="has-children"><a className="color-gray-500" href="#">Single Post</a>
                  <ul className="sub-menu two-col">
                    <li><a className="color-gray-500" href="single-sidebar.html">Blog Single 1</a></li>
                    <li><a className="color-gray-500" href="single-no-sidebar.html">Blog Single 2</a></li>
                    <li><a className="color-gray-500" href="single-center.html">Blog Single 3</a></li>
                  </ul>
                </li>
                <li className="has-children"><a className="color-gray-500" href="#">Pages</a>
                  <ul className="sub-menu two-col">
                    <li><a className="color-gray-500" href="page-about.html">About</a></li>
                    <li><a className="color-gray-500" href="page-author.html">Author posts</a></li>
                    <li><a className="color-gray-500" href="page-contact.html">Contact</a></li>
                    <li><a className="color-gray-500" href="page-search.html">Search results</a></li>
                    <li><a className="color-gray-500" href="page-login.html">Login</a></li>
                    <li><a className="color-gray-500" href="page-signup.html">Signup</a></li>
                    <li><a className="color-gray-500" href="page-404.html">Page 404</a></li>
                  </ul>
                </li>
                <li><a className="color-gray-500" href="page-contact.html">Contact</a></li>
              </ul>
            </nav>
            <div className="burger-icon burger-icon-white"><span className="burger-icon-top"></span><span className="burger-icon-mid"></span><span className="burger-icon-bottom"></span></div>
          </div>
          <div className="header-right text-end"><a className="btn btn-search" href="#"></a>
            <div className="form-search p-20">
              <form action="#">
                <input className="form-control" type="text" placeholder="Search"/>
                <input className="btn-search-2" type="submit" value=""/>
              </form>
              <div className="popular-keywords text-start mt-20">
                <p className="mb-10 color-white">Popular tags:</p><a className="color-gray-600 mr-10 font-xs" href="#"># Travel,</a><a className="color-gray-600 mr-10 font-xs" href="#"># Tech,</a><a className="color-gray-600 mr-10 font-xs" href="#"># Movie</a><a className="color-gray-600 mr-10 font-xs" href="#"># Lifestyle</a><a className="color-gray-600 mr-10 font-xs" href="#"># Sport</a>
              </div>
            </div>
            <div className="switch-button">
              <div className="form-check form-switch">
                <input className="form-check-input" id="flexSwitchCheckChecked" type="checkbox" role="switch" checked=""/>
              </div>
            </div><a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="page-login.html">Subscribe</a>
          </div>
        </div>
      </div>
    </header>
    <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar bg-gray-900">
      <div className="mobile-header-wrapper-inner">
        <div className="mobile-header-content-area">
          <div className="mobile-logo border-gray-800"><a className="d-flex" href="index.html"><img className="logo-night" alt="GenZ" src="assets/imgs/template/logo.svg"/><img className="d-none logo-day" alt="GenZ" src="assets/imgs/template/logo-day.svg"/></a></div>
          <div className="perfect-scroll">
            <div className="mobile-menu-wrap mobile-header-border">
              <nav className="mt-15">
                <ul className="mobile-menu font-heading">
                  <li className="has-children"><a href="index.html">Home</a>
                    <ul className="sub-menu">
                      <li><a href="index.html">Homepage - 1</a></li>
                      <li><a href="index-2.html">Homepage - 2</a></li>
                      <li><a href="index-3.html">Homepage - 3</a></li>
                      <li><a href="index-4.html">Homepage - 4</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><a href="#">Category</a>
                    <ul className="sub-menu">
                      <li><a href="blog-archive.html">Blog Category 1</a></li>
                      <li><a href="blog-archive-2.html">Blog Category 2</a></li>
                      <li><a href="blog-archive-3.html">Blog Category 3</a></li>
                      <li><a href="blog-archive-4.html">Blog Category 4</a></li>
                      <li><a href="blog-archive-5.html">Blog Category 5</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><a href="#">Single Post</a>
                    <ul className="sub-menu">
                      <li><a href="single-sidebar.html">Blog Single 1</a></li>
                      <li><a href="single-no-sidebar.html">Blog Single 2</a></li>
                      <li><a href="single-center.html">Blog Single 3</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><a className="color-gray-500" href="page-portfolio.html">Portfolio</a>
                    <ul className="sub-menu">
                      <li><a className="color-gray-500" href="page-portfolio.html">My Portfolio</a></li>
                      <li><a className="color-gray-500" href="page-portfolio-2.html">My Portfolio 2</a></li>
                      <li><a className="color-gray-500" href="portfolio-details.html">Portfolio Details</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><a href="#">Pages</a>
                    <ul className="sub-menu">
                      <li><a href="page-about.html">About</a></li>
                      <li><a href="page-author.html">Author posts</a></li>
                      <li><a href="page-contact.html">Contact</a></li>
                      <li><a href="page-search.html">Search results</a></li>
                      <li><a href="page-login.html">Login</a></li>
                      <li><a href="page-signup.html">Signup</a></li>
                      <li><a href="page-404.html">Page 404</a></li>
                    </ul>
                  </li>
                  <li><a href="page-contact.html">Contact</a></li>
                </ul>
              </nav>
            </div>
            <div className="mobile-account border-gray-800">
              <div className="mobile-header-top bg-gray-900">
                <div className="user-account"><a href="page-login.html"><img src="assets/imgs/template/ava.jpg" alt="GenZ"/></a>
                  <div className="content">
                    <h6 className="user-name color-white">Hello<span className="color-white"> Steven !</span></h6>
                    <p className="font-xs text-muted">You have 3 new messages</p>
                  </div>
                </div>
              </div>
              <ul className="mobile-menu">
                <li><a href="page-login.html">Profile</a></li>
                <li><a href="page-login.html">Articles Saved</a></li>
                <li><a href="page-login.html">Add new post</a></li>
                <li><a href="page-login.html">My Likes</a></li>
                <li><a href="page-login.html">Account Setting</a></li>
                <li><a href="page-login.html">Sign out</a></li>
              </ul>
            </div>
            <div className="site-copyright color-gray-400 mt-30">Copyright 2023 &copy; Genz - Personal Blog Template.<br/>Designed by<a href="http://alithemes.com" target="_blank">&nbsp; AliThemes</a></div>
          </div>
        </div>
      </div>
    </div>
    </>
    );
  }

